/**
 * @import { TransformResult } from '../protocol.js'
 */

/**
 * Build the triple-slash reference prefix prepended to every transformed
 * module.
 *
 * The transform's output only type-checks when Glint's integration
 * declarations are in the program: they register Ember's built-in components,
 * helpers, and modifiers with the template DSL, and `ember-source/types`
 * supplies the `@ember/*` module declarations they build on. Users used to
 * list both in `compilerOptions.types`. Referencing them from the transformed
 * text instead means the mapper's own requirements travel with the mapper.
 *
 * A reference in one transformed file covers the whole program, because both
 * packages contribute ambient declarations. Projects with no `.gts` or `.gjs`
 * file get no transformed text and so no references; such a project does not
 * need this mapper either.
 *
 * @param {string | undefined} emberSourceVersion
 *   The version of the resolved `ember-source`, or `undefined` when it is not
 *   installed.
 * @returns {string}
 *   The prefix, ending in a newline.
 */
export function buildReferencePrefix(emberSourceVersion) {
  const packages = ['@glint/ember-tsc/types'];

  // Without `ember-source` there are no `@ember/*` types to reference, and
  // referencing it anyway would report TS2688 on synthesized text.
  if (emberSourceVersion !== undefined) {
    packages.unshift('ember-source/types');
  }

  return packages.map((name) => `/// <reference types="${name}" />\n`).join('');
}

/**
 * Prepend the reference prefix to a transform result, shifting every virtual
 * offset past it.
 *
 * Triple-slash references are only honored at the top of a file, so the
 * prefix has to come before the transformed text.
 *
 * The prefix is left unmapped, because it has no counterpart in the original
 * file. Nothing covers it with an Ignore directive either: a reference that
 * does not resolve means the project is missing a package this mapper needs,
 * and TypeScript reports that as TS2688 against the `.gts` file with a note
 * that the location is in virtual code. Suppressing it would trade one clear
 * diagnostic for a pile of unresolved-global ones.
 *
 * @param {TransformResult} result
 *   The transform result, mutated in place.
 * @param {string} prefix
 *   The prefix from `buildReferencePrefix`.
 * @returns {TransformResult}
 *   The same result, with the prefix applied.
 */
export function prependReferences(result, prefix) {
  const offset = prefix.length;

  result.text = prefix + result.text;

  for (const mapping of result.mappings ?? []) {
    mapping[0] += offset;
  }

  for (const directive of result.diagnosticDirectives?.directives ?? []) {
    directive[2] += offset;
    directive[3] += offset;
  }

  return result;
}
