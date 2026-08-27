/**
 * @import { TransformResult } from '../lib/protocol.js'
 */

import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

import { assertEqual, testFixturesDirectory } from 'snapshot-fixtures';

import { closeProject } from '../lib/requests/close-project.js';
import { openProject } from '../lib/requests/open-project.js';
import { transform } from '../lib/requests/transform.js';
import pkg from '../package.json' with { type: 'json' };

const directory = new URL('fixtures/', import.meta.url);

const policyNames = /** @type {const} */ (['ignore', 'expect']);
const kindNames = /** @type {const} */ (['verbatim', 'atom', 'alias']);

/**
 * @param {string} text
 *   The text to quote.
 * @returns {string}
 *   A single-line JSON representation, truncated for readability.
 */
function quote(text) {
  const json = JSON.stringify(text);
  return json.length > 80 ? `${json.slice(0, 80)}…` : json;
}

/**
 * @param {string} original
 *   The original file content.
 * @param {TransformResult} result
 *   The transform result.
 * @returns {string}
 *   A markdown representation of the result.
 */
function resultToMarkdown(original, result) {
  const lines = ['## Text', '', `\`\`\`${result.extension.slice(1)}`, result.text, '```', ''];

  lines.push('## Mappings', '');
  let previousVirtualEnd = 0;
  for (const mapping of result.mappings ?? []) {
    const [virtualStart, virtualLength, originalStart, originalLength, kind, features] = mapping;
    const virtualText = result.text.slice(virtualStart, virtualStart + virtualLength);
    const originalText = original.slice(originalStart, originalStart + originalLength);

    assert.ok(virtualStart >= previousVirtualEnd, 'virtual spans must not overlap');
    previousVirtualEnd = virtualStart + virtualLength;
    if (kind === 0) {
      assertEqual(virtualText, originalText);
    }

    const location = `[${virtualStart}, ${virtualStart + virtualLength}) -> [${originalStart}, ${originalStart + originalLength})`;
    const description =
      kind === 0 ? `${quote(virtualText)}` : `${quote(virtualText)} <- ${quote(originalText)}`;
    lines.push(
      `- ${kindNames[kind]} ${location} features=${features === undefined ? 'all' : features} ${description}`,
    );
  }

  lines.push('', '## Diagnostic directives', '');
  for (const directive of result.diagnosticDirectives?.directives ?? []) {
    const [originalStart, originalLength, virtualStart, virtualEnd, policy] = directive;
    const originalText = original.slice(originalStart, originalStart + originalLength);
    const virtualText = result.text.slice(virtualStart, virtualEnd);
    lines.push(
      `- ${policyNames[policy]} [${originalStart}, ${originalStart + originalLength}) ${quote(originalText)} over [${virtualStart}, ${virtualEnd}) ${quote(virtualText)}`,
    );
  }

  lines.push('', '## Diagnostics', '');
  for (const diagnostic of result.diagnostics ?? []) {
    lines.push(
      `- [${diagnostic.start}, ${diagnostic.start + diagnostic.length}): ${diagnostic.messageText}`,
    );
  }

  lines.push('');
  return lines.join('\n');
}

let count = 0;

testFixturesDirectory({
  directory,
  write: true,
  tests: {
    'transform.md'(file) {
      const original = String(file);
      const fixtureDirectory = dirname(file.path);
      const tsconfig = JSON.parse(readFileSync(join(fixtureDirectory, 'tsconfig.json'), 'utf8'));
      const mapperEntry = /** @type {{ package: string, options?: object }[]} */ (
        tsconfig.contentMappers
      ).find((entry) => entry.package === pkg.name);
      assert.ok(mapperEntry);

      count += 1;
      const projectHandle = `${pkg.name}:${count}`;
      openProject({
        configFileName: join(fixtureDirectory, 'tsconfig.json'),
        compilerOptions: {},
        options: /** @type {Record<string, unknown>} */ (mapperEntry.options),
        projectHandle,
      });
      try {
        const result = transform({
          content: original,
          fileName: file.path,
          projectHandle,
        });

        return resultToMarkdown(original, result);
      } finally {
        closeProject({ projectHandle });
      }
    },
  },
});
