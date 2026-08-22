/**
 * @import { MapperDiagnostic, TransformParams, TransformResult } from '../protocol.js'
 * @import { TransformError } from '@glint/ember-tsc/transform/template/transformed-module'
 */

import { rewriteModule } from '@glint/ember-tsc/transform';
import ts from 'typescript';

import { SpanMapKind } from '../constants.js';
import { buildDiagnosticDirectives } from '../util/directives.js';
import { buildMappings } from '../util/mappings.js';
import { projects } from '../util/projects.js';

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
  /** @type {TransformResult['extension']} */
  const extension = fileName.endsWith('.gjs') ? '.js' : '.ts';

  const transformedModule = rewriteModule(
    ts,
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

    return passthrough;
  }

  if (transformedModule.errors.some((error) => error.isContentTagError)) {
    // The file could not be parsed, so there is no sensible transformed
    // output. Report the parse error against the original content.
    return {
      text: '',
      extension,
      diagnostics: transformedModule.errors.map(toMapperDiagnostic),
    };
  }

  const { mappings, analysis } = buildMappings(transformedModule);

  /** @type {TransformResult} */
  const result = { text: transformedModule.transformedContents, extension, mappings };

  const diagnosticDirectives = buildDiagnosticDirectives(analysis);
  if (diagnosticDirectives) {
    result.diagnosticDirectives = diagnosticDirectives;
  }

  if (transformedModule.errors.length > 0) {
    // Glint's directives also suppress transform errors (e.g. a special-form
    // arity error under `{{! @glint-expect-error }}`), but TypeScript's
    // diagnostic directives only apply to its own bind/check diagnostics, so
    // filter mapper diagnostics inside directive areas here. When a transform
    // error aborts a node's emission, no mapping nodes exist for the area, so
    // regions derived from the mapping tree can't cover it. An expect-error
    // directive's area of effect is the line after the comment, and each such
    // directive emits a placeholder whose original range is the comment, so
    // the area is recoverable from the placeholder.
    const suppressedRegions = analysis.expectNodes.concat(analysis.ignoreNodes);
    for (const placeholder of analysis.placeholders) {
      const lineEnd = content.indexOf('\n', placeholder.originalEnd);
      if (lineEnd === -1) {
        continue;
      }

      const nextLineEnd = content.indexOf('\n', lineEnd + 1);
      suppressedRegions.push({
        originalStart: lineEnd + 1,
        originalEnd: nextLineEnd === -1 ? content.length : nextLineEnd + 1,
        virtualStart: placeholder.virtualStart,
        virtualEnd: placeholder.virtualEnd,
      });
    }

    const diagnostics = transformedModule.errors
      .filter(
        (error) =>
          !suppressedRegions.some(
            (region) =>
              error.location.start >= region.originalStart &&
              error.location.start < region.originalEnd,
          ),
      )
      .map(toMapperDiagnostic);

    if (diagnostics.length > 0) {
      result.diagnostics = diagnostics;
    }
  }

  return result;
}
