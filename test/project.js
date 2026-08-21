import assert from 'node:assert/strict';
import { test } from 'node:test';

import { closeProject } from '../lib/requests/close-project.js';
import { openProject } from '../lib/requests/open-project.js';
import { projects } from '../lib/util/projects.js';
import pkg from '../package.json' with { type: 'json' };

test('open and close project', () => {
  const projectHandle = `${pkg.name}@${pkg.version}:project-test`;
  const result = openProject({
    compilerOptions: {},
    configFileName: 'example/tsconfig.json',
    projectHandle,
    options: {},
  });

  assert.equal(result.optionDiagnostics, undefined);
  assert.match(String(result.configIdentity), /^ember-content-mapper@/);
  assert.ok(result.watchedFiles?.some((file) => file.endsWith('ember-source/package.json')));
  assert.ok(projects.has(projectHandle));

  closeProject({ projectHandle });
  assert.equal(projects.has(projectHandle), false);
});

test('invalid options produce option diagnostics', () => {
  const projectHandle = `${pkg.name}@${pkg.version}:invalid-options-test`;
  const result = openProject({
    compilerOptions: {},
    configFileName: 'example/tsconfig.json',
    projectHandle,
    options: {
      additionalGlobals: ['t', 42],
      additionalSpecialForms: 'nope',
      typo: true,
    },
  });

  assert.deepEqual(result.optionDiagnostics, [
    {
      path: ['typo'],
      messageText:
        "Unknown option 'typo'. Supported options are 'additionalGlobals' and 'additionalSpecialForms'.",
    },
    {
      path: ['additionalGlobals', 1],
      messageText: "'additionalGlobals' entries must be strings.",
    },
    {
      path: ['additionalSpecialForms'],
      messageText: "'additionalSpecialForms' must be an object.",
    },
  ]);

  closeProject({ projectHandle });
});
