/**
 * @import { MapperDiagnostic, TransformParams, TransformResult } from '../protocol.js'
 * @import { TransformError } from '@glint/ember-tsc/transform/template/transformed-module'
 * @import { Placeholder, Region } from '../util/mappings.js'
 */

import { existsSync, readFileSync } from 'node:fs';

import { rewriteModuleStandalone } from '@glint/ember-tsc/transform/standalone';

import { SpanMapKind } from '../constants.js';
import { buildDiagnosticDirectives } from '../util/directives.js';
import { applyInsertions, castCallHeritages } from '../util/heritage.js';
import { buildMappings } from '../util/mappings.js';
import { projects } from '../util/projects.js';
import { prependReferences } from '../util/references.js';

/**
 * @param {TransformError} error
 *   A Glint transform error.
 * @returns {MapperDiagnostic}
 *   The equivalent mapper diagnostic.
 */
function toMapperDiagnostic(error) {
  return {
    messageText: error.message,
    start: error.location.start,
    length: error.location.end - error.location.start,
  };
}

/**
 * @param {TransformError} error
 *   A Glint transform error.
 * @param {Region} region
 *   A region in original offsets.
 * @returns {boolean}
 *   Whether the error starts inside the region.
 */
function inRegion(error, region) {
  return error.location.start >= region.originalStart && error.location.start < region.originalEnd;
}

/**
 * A sibling declaration file wins over transforming the module, matching how
 * Glint treated hand-written declarations next to untyped `.gjs`/`.gts`
 * files. Both TypeScript 7's arbitrary-extension convention (`x.d.gjs.ts`)
 * and Glint's (`x.gjs.d.ts`) are honored.
 *
 * The declaration is parsed as a `.ts` module (the protocol has no `.d.ts`
 * extension), so anything unbodied or uninitialized in it must use ambient
 * (`declare`) syntax.
 *
 * @param {string} fileName
 * @returns {string | undefined}
 *   The path of the sibling declaration, if one exists.
 */
function siblingDeclaration(fileName) {
  const match = /^(.*)\.(gts|gjs)$/.exec(fileName);
  if (!match) {
    return undefined;
  }

  const [, base, extension] = match;
  for (const candidate of [`${base}.d.${extension}.ts`, `${base}.${extension}.d.ts`]) {
    if (existsSync(candidate)) {
      return candidate;
    }
  }

  return undefined;
}

/**
 * @param {TransformParams} params
 * @returns {TransformResult}
 *   The result for the `transform` request.
 */
export function transform(params) {
  const project = projects.get(params.projectHandle);
  if (!project) {
    throw new Error(`Unknown project handle: ${params.projectHandle}`);
  }

  const { content, fileName } = params;

  const declaration = siblingDeclaration(fileName);
  if (declaration) {
    return { text: readFileSync(declaration, 'utf8'), extension: '.ts' };
  }
  /** @type {TransformResult['extension']} */
  const extension = fileName.endsWith('.gjs') ? '.js' : '.ts';

  const transformedModule = rewriteModuleStandalone(
    { script: { filename: fileName, contents: content } },
    project.environment,
  );

  if (!transformedModule) {
    // The file contains no `<template>` tags, so it is already plain TS/JS.
    /** @type {TransformResult} */
    const passthrough = { text: content, extension };
    if (content.length > 0) {
      passthrough.mappings = [[0, content.length, 0, content.length, SpanMapKind.Verbatim]];
    }

    return prependReferences(withHeritageCasts(passthrough, fileName), project.referencePrefix);
  }

  if (transformedModule.errors.some((error) => error.isContentTagError)) {
    // The file could not be parsed (by content-tag, or by oxc for the script
    // parts), so there is no sensible transformed output. Report the parse
    // error against the original content.
    return prependReferences(
      { text: '', extension, diagnostics: transformedModule.errors.map(toMapperDiagnostic) },
      project.referencePrefix,
    );
  }

  const { mappings, analysis } = buildMappings(transformedModule);

  /** @type {TransformResult} */
  const result = { text: transformedModule.transformedContents, extension, mappings };

  // Glint's directives also suppress transform errors (e.g. a special-form
  // arity error under `{{! @glint-expect-error }}`), but TypeScript's
  // diagnostic directives only apply to its own bind/check diagnostics, so
  // mapper diagnostics inside directive areas are filtered here. When a
  // transform error aborts a node's emission, no mapping nodes exist for the
  // area, so regions derived from the mapping tree can't cover it. An
  // expect-error directive's area of effect is the line after the comment,
  // and each such directive emits a placeholder whose original range is the
  // comment, so the area is recoverable from the placeholder.
  const suppressedRegions = analysis.expectNodes.concat(analysis.ignoreNodes);
  /** @type {Set<Placeholder>} */
  const usedPlaceholders = new Set();
  for (const placeholder of analysis.placeholders) {
    const lineEnd = content.indexOf('\n', placeholder.originalEnd);
    if (lineEnd === -1) {
      continue;
    }

    const nextLineEnd = content.indexOf('\n', lineEnd + 1);
    const area = {
      originalStart: lineEnd + 1,
      originalEnd: nextLineEnd === -1 ? content.length : nextLineEnd + 1,
      virtualStart: placeholder.virtualStart,
      virtualEnd: placeholder.virtualEnd,
    };
    suppressedRegions.push(area);

    if (transformedModule.errors.some((error) => inRegion(error, area))) {
      usedPlaceholders.add(placeholder);
    }
  }

  const diagnosticDirectives = buildDiagnosticDirectives(analysis, usedPlaceholders);
  if (diagnosticDirectives) {
    result.diagnosticDirectives = diagnosticDirectives;
  }

  const diagnostics = transformedModule.errors
    .filter((error) => !suppressedRegions.some((region) => inRegion(error, region)))
    .map(toMapperDiagnostic);

  if (diagnostics.length > 0) {
    result.diagnostics = diagnostics;
  }

  return prependReferences(withHeritageCasts(result, fileName), project.referencePrefix);
}

/**
 * Work around microsoft/TypeScript#64058 for JavaScript output. See
 * `castCallHeritages`.
 *
 * @param {TransformResult} result
 *   The transform result, mutated in place.
 * @param {string} fileName
 *   The original file name.
 * @returns {TransformResult}
 *   The same result.
 */
function withHeritageCasts(result, fileName) {
  if (result.extension !== '.js') {
    return result;
  }

  return applyInsertions(result, castCallHeritages(result.text, fileName));
}
