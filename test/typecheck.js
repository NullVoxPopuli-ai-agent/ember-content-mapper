import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';

const root = fileURLToPath(new URL('..', import.meta.url));
const tsc7 = fileURLToPath(new URL('../node_modules/typescript-7/bin/tsc', import.meta.url));

/**
 * Run TypeScript 7 with the content mapper enabled on a project.
 *
 * @param {string} project
 *   The project directory, relative to the repository root.
 * @returns {string}
 *   The combined tsc output.
 */
function typecheck(project) {
  try {
    return String(
      execFileSync(process.execPath, [tsc7, '-p', project, '--runExternalCode'], {
        cwd: root,
        stdio: ['ignore', 'pipe', 'pipe'],
      }),
    );
  } catch (error) {
    const result = /** @type {{ stdout: Buffer, stderr: Buffer }} */ (error);
    return `${result.stdout}${result.stderr}`;
  }
}

test('type-tests typecheck cleanly', () => {
  assert.equal(typecheck('type-tests'), '');
});

for (const project of ['semantic', 'parse-error']) {
  test(`diagnostics-tests/${project} reports mapped diagnostics`, () => {
    const expected = readFileSync(
      new URL(`../diagnostics-tests/${project}/expected-output.txt`, import.meta.url),
      'utf8',
    );

    assert.equal(typecheck(`diagnostics-tests/${project}`), expected);
  });
}
