import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { after, before, test } from 'node:test';
import { fileURLToPath } from 'node:url';

import {
  createMessageConnection,
  StreamMessageReader,
  StreamMessageWriter,
} from 'vscode-jsonrpc/node';

const serverPath = fileURLToPath(new URL('../lib/server.js', import.meta.url));

// Every transformed module starts with the type references its output needs,
// so that projects do not have to list them in `compilerOptions.types`. Both
// resolve here: `ember-source` and `@glint/ember-tsc` are devDependencies of
// this repository.
const references = [
  '/// <reference types="ember-source/types" />',
  '/// <reference types="@glint/ember-tsc/types" />',
  '',
].join('\n');

/** @type {import('node:child_process').ChildProcess} */
let server;
/** @type {import('vscode-jsonrpc').MessageConnection} */
let connection;

before(() => {
  server = spawn(process.execPath, [serverPath], { stdio: ['pipe', 'pipe', 'inherit'] });
  assert.ok(server.stdout && server.stdin);
  connection = createMessageConnection(
    new StreamMessageReader(server.stdout),
    new StreamMessageWriter(server.stdin),
  );
  connection.listen();
});

after(() => {
  connection.dispose();
  server.kill();
});

test('initialize', async () => {
  const result = await connection.sendRequest('initialize', {
    protocolVersion: 1,
    positionEncodings: ['utf-8', 'utf-16'],
  });

  assert.deepEqual(result, {
    protocolVersion: 1,
    positionEncoding: 'utf-16',
    diagnosticSource: 'glint',
  });
});

test('openProject reports a config identity and option diagnostics', async () => {
  const valid = await connection.sendRequest('openProject', {
    configFileName: '/tmp/project/tsconfig.json',
    projectHandle: 'valid',
    options: { additionalGlobals: ['t'] },
    compilerOptions: {},
  });
  assert.match(valid.configIdentity, /^ember-content-mapper@/);
  assert.equal(valid.optionDiagnostics, undefined);

  const invalid = await connection.sendRequest('openProject', {
    configFileName: '/tmp/project/tsconfig.json',
    projectHandle: 'invalid',
    options: { additionalGlobals: 'nope' },
    compilerOptions: {},
  });
  assert.deepEqual(
    invalid.optionDiagnostics.map((/** @type {{ path: unknown }} */ diagnostic) => diagnostic.path),
    [['additionalGlobals']],
  );
});

test('transform returns text, mappings, and directives', async () => {
  const content = [
    'const known = 1;',
    '<template>',
    '  {{! @glint-expect-error }}',
    '  {{known.nope}}',
    '</template>',
    '',
  ].join('\n');

  const result = await connection.sendRequest('transform', {
    fileName: '/tmp/project/src/example.gts',
    content,
    projectHandle: 'valid',
  });

  assert.equal(result.extension, '.ts');
  assert.ok(result.text.startsWith(references));
  assert.match(result.text, /templateExpression/);
  assert.ok(result.mappings.length > 0);
  assert.ok(
    result.mappings.every((/** @type {number[]} */ mapping) => mapping[0] >= references.length),
    'no mapping covers the reference prefix',
  );
  assert.ok(
    result.diagnosticDirectives.directives.some(
      (/** @type {number[]} */ directive) => directive[4] === 1,
    ),
    'the expect-error directive becomes an Expect directive',
  );
  assert.equal(result.diagnostics, undefined);
});

test('transform of a file without templates passes it through', async () => {
  const content = 'export const answer = 42;\n';
  const result = await connection.sendRequest('transform', {
    fileName: '/tmp/project/src/plain.gts',
    content,
    projectHandle: 'valid',
  });

  assert.equal(result.text, references + content);
  assert.deepEqual(result.mappings, [[references.length, content.length, 0, content.length, 0]]);
});

test('transform of an unparseable file reports a diagnostic and no text', async () => {
  const result = await connection.sendRequest('transform', {
    fileName: '/tmp/project/src/broken.gts',
    content: '<template>\n  <p>never closed\n',
    projectHandle: 'valid',
  });

  assert.equal(result.text, references);
  assert.equal(result.diagnostics.length, 1);
});

test('transform for an unknown project handle is a JSON-RPC error', async () => {
  await assert.rejects(
    connection.sendRequest('transform', {
      fileName: '/tmp/project/src/example.gts',
      content: '',
      projectHandle: 'never-opened',
    }),
    /Unknown project handle/,
  );
});

test('closeProject releases the handle', async () => {
  await connection.sendRequest('closeProject', { projectHandle: 'valid' });
  await assert.rejects(
    connection.sendRequest('transform', {
      fileName: '/tmp/project/src/example.gts',
      content: '',
      projectHandle: 'valid',
    }),
    /Unknown project handle/,
  );
});
