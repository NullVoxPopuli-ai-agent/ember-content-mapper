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
    result.diagnostics = transformedModule.errors.map(toMapperDiagnostic);
  }

  return result;
}
