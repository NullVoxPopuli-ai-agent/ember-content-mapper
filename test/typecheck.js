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

// Direct copies of typed-ember/glint's test-packages (at v1.10.0). Their
// sources are byte-identical to upstream; only package.json and tsconfig.json
// are adapted. The expected output of each package documents where this
// mapper's behavior deviates from Glint's own type-checking; an empty
// expectation means the package type-checks clean. See
// test-packages/README.md for why each non-empty expectation exists.
const testPackages = [
  'ts-template-imports-app',
  'ts-gts-7-1-app',
  'ts-special-forms-app',
  'ts-special-forms-pre-7-1-app',
  'ts-extensionless-app',
];

for (const name of testPackages) {
  test(`test-packages/${name} matches its expected output`, () => {
    const expected = readFileSync(
      new URL(`../test-packages/expected/${name}.txt`, import.meta.url),
      'utf8',
    );

    assert.equal(typecheck(`test-packages/${name}`), expected);
  });
}

for (const project of ['semantic', 'parse-error', 'invalid-options']) {
  test(`diagnostics-tests/${project} reports mapped diagnostics`, () => {
    const expected = readFileSync(
      new URL(`../diagnostics-tests/${project}/expected-output.txt`, import.meta.url),
      'utf8',
    );

    assert.equal(typecheck(`diagnostics-tests/${project}`), expected);
  });
}
