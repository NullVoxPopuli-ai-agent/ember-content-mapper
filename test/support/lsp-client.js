import { spawn } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

import {
  ConfigurationRequest,
  createProtocolConnection,
  DidOpenTextDocumentNotification,
  ExitNotification,
  InitializedNotification,
  InitializeRequest,
  RegistrationRequest,
  ShutdownRequest,
  StreamMessageReader,
  StreamMessageWriter,
} from 'vscode-languageserver-protocol/node';

/**
 * Start TypeScript 7's `tsc --lsp --stdio` with content mappers enabled and
 * return a `ProtocolConnection` for typed LSP requests.
 *
 * @param {string} tsc
 *   Path to the TypeScript 7 `tsc` entry point.
 * @param {string} rootDir
 *   The project root to open.
 */
export async function startLanguageServer(tsc, rootDir) {
  const server = spawn(process.execPath, [tsc, '--lsp', '--stdio'], {
    cwd: rootDir,
    stdio: ['pipe', 'pipe', 'ignore'],
  });
  if (!server.stdout || !server.stdin) {
    throw new Error('tsc --lsp did not expose stdio pipes');
  }

  const connection = createProtocolConnection(
    new StreamMessageReader(server.stdout),
    new StreamMessageWriter(server.stdin),
  );
  // The server registers capabilities and asks for configuration; neither
  // matters for these tests.
  connection.onRequest(RegistrationRequest.type, () => {});
  connection.onRequest(ConfigurationRequest.type, ({ items }) => items.map(() => null));
  connection.listen();

  const rootUri = pathToFileURL(rootDir).href;
  await connection.sendRequest(InitializeRequest.type, {
    processId: process.pid,
    rootUri,
    workspaceFolders: [{ uri: rootUri, name: 'root' }],
    initializationOptions: { runExternalCode: true },
    capabilities: {
      textDocument: {
        hover: { contentFormat: ['markdown', 'plaintext'] },
        diagnostic: {},
        rename: { prepareSupport: true },
      },
    },
  });
  await connection.sendNotification(InitializedNotification.type, {});

  /** @type {Map<string, number>} */
  const versions = new Map();

  return {
    connection,

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
      const version = (versions.get(uri) ?? 0) + 1;
      versions.set(uri, version);
      const languageId =
        file.endsWith('.gjs') || file.endsWith('.js') ? 'javascript' : 'typescript';
      void connection.sendNotification(DidOpenTextDocumentNotification.type, {
        textDocument: { uri, languageId, version, text },
      });
      return { uri, text };
    },

    async stop() {
      try {
        await connection.sendRequest(ShutdownRequest.type);
        await connection.sendNotification(ExitNotification.type);
      } finally {
        connection.dispose();
        server.kill();
      }
    },
  };
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
