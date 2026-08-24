/**
 * @import { OpenProjectParams, OpenProjectResult, OptionDiagnostic } from '../protocol.js'
 */

import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { GlintEnvironment } from '@glint/ember-tsc/config/index';

import { probeEmberSource } from '../util/ember-probe.js';
import { projects } from '../util/projects.js';

const require = createRequire(import.meta.url);

/** @type {{ name: string, version: string }} */
const ownManifest = require('ember-content-mapper/package.json');

// `@glint/ember-tsc` does not export its package.json yet
// (typed-ember/glint#1222), so locate it relative to a module it does export
// (lib/transform/index.js is two levels down). Once the export ships, this
// becomes require('@glint/ember-tsc/package.json').
const emberTscRoot = dirname(
  dirname(dirname(fileURLToPath(import.meta.resolve('@glint/ember-tsc/transform')))),
);

/** @type {{ version: string }} */
const emberTscManifest = JSON.parse(readFileSync(join(emberTscRoot, 'package.json'), 'utf8'));

/**
 * Validate the `contentMappers` entry's `options` object.
 *
 * @param {Record<string, unknown>} options
 *   The options to validate.
 * @returns {OptionDiagnostic[]}
 *   Diagnostics for invalid option values.
 */
function validateOptions(options) {
  /** @type {OptionDiagnostic[]} */
  const diagnostics = [];

  for (const key of Object.keys(options)) {
    if (key !== 'additionalGlobals' && key !== 'additionalSpecialForms') {
      diagnostics.push({
        path: [key],
        messageText: `Unknown option '${key}'. Supported options are 'additionalGlobals' and 'additionalSpecialForms'.`,
      });
    }
  }

  const additionalGlobals = options['additionalGlobals'];
  if (additionalGlobals !== undefined) {
    if (Array.isArray(additionalGlobals)) {
      for (const [index, value] of additionalGlobals.entries()) {
        if (typeof value !== 'string') {
          diagnostics.push({
            path: ['additionalGlobals', index],
            messageText: `'additionalGlobals' entries must be strings.`,
          });
        }
      }
    } else {
      diagnostics.push({
        path: ['additionalGlobals'],
        messageText: `'additionalGlobals' must be an array of strings.`,
      });
    }
  }

  const additionalSpecialForms = options['additionalSpecialForms'];
  if (
    additionalSpecialForms !== undefined &&
    (typeof additionalSpecialForms !== 'object' ||
      additionalSpecialForms === null ||
      Array.isArray(additionalSpecialForms))
  ) {
    diagnostics.push({
      path: ['additionalSpecialForms'],
      messageText: `'additionalSpecialForms' must be an object.`,
    });
  }

  return diagnostics;
}

/**
 * @param {OpenProjectParams} params
 * @returns {OpenProjectResult}
 *   The result for the `openProject` request.
 */
export function openProject(params) {
  const options = params.options ?? {};
  const optionDiagnostics = validateOptions(options);
  const environment = GlintEnvironment.load(options);

  projects.set(params.projectHandle, { params, environment });

  // The transform's output depends on configuration discovered outside the
  // tsconfig: the installed ember-source (which decides whether the 7.1
  // built-in keywords are treated as globals) and the installed Glint
  // transform itself.
  const emberSource = probeEmberSource();
  const configIdentity = [
    `${ownManifest.name}@${ownManifest.version}`,
    `@glint/ember-tsc@${emberTscManifest.version}`,
    `ember-source@${emberSource?.version ?? 'none'}`,
  ].join(';');

  /** @type {OpenProjectResult} */
  const result = { configIdentity };
  if (emberSource) {
    result.watchedFiles = [emberSource.packageJsonPath];
  }

  if (optionDiagnostics.length > 0) {
    result.optionDiagnostics = optionDiagnostics;
  }

  return result;
}
