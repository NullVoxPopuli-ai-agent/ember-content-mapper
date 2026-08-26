import { spawn } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

/**
 * A minimal JSON-RPC client for TypeScript 7's `tsc --lsp --stdio`, enough
 * to open documents and issue requests in tests.
 */
export class LspClient {
  /** @type {import('node:child_process').ChildProcess} */
  #server;
  #seq = 0;
  /** @type {Map<number, { resolve: (value: unknown) => void, reject: (error: Error) => void }>} */
  #pending = new Map();
  #buffer = Buffer.alloc(0);
  /** @type {Map<string, number>} */
  #versions = new Map();
  /** @type {Map<string, unknown[]>} */
  #notifications = new Map();

  /**
   * @param {string} tsc
   *   Path to the TypeScript 7 `tsc` entry point.
   * @param {string} rootDir
   *   The project root to open.
   */
  constructor(tsc, rootDir) {
    this.rootDir = rootDir;
    this.#server = spawn(process.execPath, [tsc, '--lsp', '--stdio'], {
      cwd: rootDir,
      stdio: ['pipe', 'pipe', 'ignore'],
    });
    if (!this.#server.stdout || !this.#server.stdin) {
      throw new Error('tsc --lsp did not expose stdio pipes');
    }

    this.#server.stdout.on('data', (chunk) => this.#receive(chunk));
  }

  /**
   * @param {Buffer} chunk
   */
  #receive(chunk) {
    this.#buffer = Buffer.concat([this.#buffer, chunk]);
    for (;;) {
      const headerEnd = this.#buffer.indexOf('\r\n\r\n');
      if (headerEnd === -1) return;
      const header = this.#buffer.subarray(0, headerEnd).toString();
      const length = Number(/Content-Length: (\d+)/.exec(header)?.[1]);
      if (this.#buffer.length < headerEnd + 4 + length) return;
      const message = JSON.parse(
        this.#buffer.subarray(headerEnd + 4, headerEnd + 4 + length).toString(),
      );
      this.#buffer = this.#buffer.subarray(headerEnd + 4 + length);
      this.#dispatch(message);
    }
  }

  /**
   * @param {any} message
   */
  #dispatch(message) {
    if (message.id !== undefined && message.method === undefined) {
      const pending = this.#pending.get(message.id);
      this.#pending.delete(message.id);
      if (!pending) return;
      if (message.error) {
        pending.reject(new Error(`${message.error.code}: ${message.error.message}`));
      } else {
        pending.resolve(message.result);
      }
      return;
    }

    if (message.id !== undefined) {
      // A server-to-client request: answer with an empty result.
      const result =
        message.method === 'workspace/configuration'
          ? (message.params?.items ?? []).map(() => null)
          : null;
      this.#write({ jsonrpc: '2.0', id: message.id, result });
      return;
    }

    const list = this.#notifications.get(message.method) ?? [];
    list.push(message.params);
    this.#notifications.set(message.method, list);
  }

  /**
   * @param {object} message
   */
  #write(message) {
    const body = JSON.stringify(message);
    /** @type {NonNullable<typeof this.#server.stdin>} */ (this.#server.stdin).write(
      `Content-Length: ${Buffer.byteLength(body)}\r\n\r\n${body}`,
    );
  }

  /**
   * @param {string} method
   * @param {unknown} [params]
   * @returns {Promise<any>}
   */
  request(method, params) {
    const id = ++this.#seq;
    return new Promise((resolve, reject) => {
      this.#pending.set(id, { resolve, reject });
      this.#write(
        params === undefined
          ? { jsonrpc: '2.0', id, method }
          : { jsonrpc: '2.0', id, method, params },
      );
    });
  }

  /**
   * @param {string} method
   * @param {unknown} [params]
   */
  notify(method, params) {
    this.#write(
      params === undefined ? { jsonrpc: '2.0', method } : { jsonrpc: '2.0', method, params },
    );
  }

  async initialize() {
    const result = await this.request('initialize', {
      processId: process.pid,
      rootUri: pathToFileURL(this.rootDir).href,
      workspaceFolders: [{ uri: pathToFileURL(this.rootDir).href, name: 'root' }],
      initializationOptions: { runExternalCode: true },
      capabilities: {
        textDocument: {
          hover: { contentFormat: ['markdown', 'plaintext'] },
          completion: { completionItem: { snippetSupport: false } },
          diagnostic: {},
          rename: { prepareSupport: true },
          definition: { linkSupport: false },
        },
        workspace: { workspaceEdit: { documentChanges: false } },
      },
    });
    this.notify('initialized', {});
    return result;
  }

  /**
   * Open a document, optionally with text that differs from the file on disk.
   *
   * @param {string} file
   *   Absolute file path.
   * @param {string} [text]
   *   Document text; defaults to the file's content.
   * @returns {{ uri: string, text: string }}
   */
  open(file, text = readFileSync(file, 'utf8')) {
    const uri = pathToFileURL(file).href;
    const version = (this.#versions.get(uri) ?? 0) + 1;
    this.#versions.set(uri, version);
    const languageId = file.endsWith('.gjs') || file.endsWith('.js') ? 'javascript' : 'typescript';
    this.notify('textDocument/didOpen', { textDocument: { uri, languageId, version, text } });
    return { uri, text };
  }

  async shutdown() {
    try {
      await this.request('shutdown');
      this.notify('exit');
    } finally {
      this.#server.kill();
    }
  }
}

/**
 * Compute the LSP position of `needle` in `text`, plus `offset` characters.
 *
 * @param {string} text
 * @param {string} needle
 * @param {number} [offset]
 * @returns {{ line: number, character: number }}
 */
export function positionOf(text, needle, offset = 0) {
  const index = text.indexOf(needle);
  if (index === -1) {
    throw new Error(`Needle not found: ${needle}`);
  }

  const target = index + offset;
  const before = text.slice(0, target);
  const line = before.split('\n').length - 1;
  const character = target - (before.lastIndexOf('\n') + 1);
  return { line, character };
}
