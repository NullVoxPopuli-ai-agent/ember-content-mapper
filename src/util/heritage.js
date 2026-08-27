/**
 * @import { SpanMapping, TransformResult } from '../protocol.js'
 */

import { parseSync } from 'oxc-parser';

/**
 * A piece of text to insert into the transformed text.
 *
 * @typedef {object} Insertion
 * @property {number} offset
 *   The virtual offset the text goes in front of, before any insertion.
 * @property {string} text
 *   The text to insert.
 */

/**
 * @typedef {{ type: string, start: number, end: number } & Record<string, unknown>} Node
 */

/**
 * Extract the type from a JSDoc `@extends {Type}` or `@augments {Type}` tag.
 *
 * @param {string} comment
 *   The comment text, without the delimiters.
 * @returns {string | undefined}
 *   The type, or `undefined` when the comment has no such tag.
 */
function extendsType(comment) {
  const match = /@(?:extends|augments)\s*\{/.exec(comment);
  if (!match) {
    return undefined;
  }

  // Signatures nest braces (`Component<{ Args: {...} }>`), so match them.
  let depth = 1;
  const start = match.index + match[0].length;
  for (let index = start; index < comment.length; index += 1) {
    if (comment[index] === '{') {
      depth += 1;
    } else if (comment[index] === '}') {
      depth -= 1;
      if (depth === 0) {
        return comment.slice(start, index).trim();
      }
    }
  }

  return undefined;
}

/**
 * Find the insertions that give TypeScript 7 the JSDoc `@extends` signature
 * of every class whose heritage is a call expression.
 *
 * TypeScript 7 attaches a JSDoc `extends` tag only to an identifier heritage.
 * Over `Base.extend(Mixin)` the tag is ignored, so the class has no signature
 * and every invocation reports `TS2554: Expected 0 arguments`
 * (microsoft/TypeScript#64058). TypeScript 5.9 and 6 honor the tag. Both
 * honor a JSDoc type cast on the heritage expression, so the transform wraps
 * the call in one: `(Base.extend(Mixin))` preceded by a `type` tag of
 * `new (...args: any[]) => Base<Sig>`.
 *
 * The cast loses the static side of the heritage on the subclass. Remove this
 * once the upstream fix ships in the nightly the README requires.
 *
 * @param {string} text
 *   Transformed JavaScript text.
 * @param {string} fileName
 *   The file name, for the parser's dialect detection.
 * @returns {Insertion[]}
 *   The insertions, in ascending offset order. Empty when the text has no
 *   such class or does not parse.
 */
export function castCallHeritages(text, fileName) {
  const { program, comments, errors } = parseSync(fileName, text);
  if (errors.length > 0) {
    return [];
  }

  /** @type {Insertion[]} */
  const insertions = [];

  /**
   * The JSDoc block that documents a node: the last block comment before it
   * with only whitespace in between.
   *
   * @param {number} start
   *   The node's start offset.
   * @returns {string | undefined}
   *   The comment text, if any.
   */
  function leadingJsDoc(start) {
    for (const comment of comments) {
      if (
        comment.type === 'Block' &&
        comment.value.startsWith('*') &&
        comment.end <= start &&
        text.slice(comment.end, start).trim() === ''
      ) {
        return comment.value;
      }
    }

    return undefined;
  }

  /**
   * @param {Node} node
   *   A class node.
   * @param {number} documentedStart
   *   Where the class's JSDoc attaches: the class itself, or the export
   *   declaration that wraps it.
   */
  function visitClass(node, documentedStart) {
    const superClass = /** @type {Node | null} */ (node['superClass']);
    if (!superClass || superClass.type !== 'CallExpression') {
      return;
    }

    const comment = leadingJsDoc(documentedStart) ?? leadingJsDoc(node.start);
    const type = comment === undefined ? undefined : extendsType(comment);
    if (type === undefined) {
      return;
    }

    insertions.push({
      offset: superClass.start,
      text: `/** @type {new (...args: any[]) => ${type}} */ (`,
    });
    insertions.push({ offset: superClass.end, text: ')' });
  }

  /**
   * @param {unknown} value
   *   An AST node, a list of nodes, or a scalar.
   * @param {Node | undefined} parent
   *   The enclosing node.
   */
  function walk(value, parent) {
    if (Array.isArray(value)) {
      for (const item of value) {
        walk(item, parent);
      }

      return;
    }

    if (value === null || typeof value !== 'object' || !('type' in value)) {
      return;
    }

    const node = /** @type {Node} */ (value);
    if (node.type === 'ClassDeclaration' || node.type === 'ClassExpression') {
      const wrapped =
        parent &&
        (parent.type === 'ExportDefaultDeclaration' || parent.type === 'ExportNamedDeclaration');
      visitClass(node, wrapped ? parent.start : node.start);
    }

    for (const [key, child] of Object.entries(node)) {
      if (key !== 'type' && key !== 'start' && key !== 'end') {
        walk(child, node);
      }
    }
  }

  walk(program.body, undefined);
  insertions.sort((a, b) => a.offset - b.offset);
  return insertions;
}

/**
 * @param {number} virtualStart
 * @param {number} virtualLength
 * @param {number} originalStart
 * @param {number} originalLength
 * @param {SpanMapping} like
 *   The mapping whose kind and features to copy.
 * @returns {SpanMapping}
 *   A mapping with the given ranges.
 */
function span(virtualStart, virtualLength, originalStart, originalLength, like) {
  const [, , , , kind, features] = like;
  return features === undefined
    ? [virtualStart, virtualLength, originalStart, originalLength, kind]
    : [virtualStart, virtualLength, originalStart, originalLength, kind, features];
}

/**
 * Apply insertions to a transform result, shifting every mapping and
 * directive past each insertion point.
 *
 * A mapping that spans an insertion point is split around the inserted text,
 * so the text stays unmapped: it has no counterpart in the original file.
 *
 * @param {TransformResult} result
 *   The transform result, mutated in place.
 * @param {Insertion[]} insertions
 *   The insertions, in ascending offset order, with offsets in the text as it
 *   was before any of them.
 * @returns {TransformResult}
 *   The same result, with the insertions applied.
 */
export function applyInsertions(result, insertions) {
  if (insertions.length === 0) {
    return result;
  }

  /** @type {string[]} */
  const parts = [];
  let cursor = 0;
  for (const insertion of insertions) {
    parts.push(result.text.slice(cursor, insertion.offset), insertion.text);
    cursor = insertion.offset;
  }

  parts.push(result.text.slice(cursor));
  result.text = parts.join('');

  /**
   * @param {number} offset
   *   An offset in the text before the insertions.
   * @returns {number}
   *   The same position in the text after them. A position equal to an
   *   insertion point lands after the inserted text.
   */
  function shift(offset) {
    let shifted = offset;
    for (const insertion of insertions) {
      if (insertion.offset <= offset) {
        shifted += insertion.text.length;
      }
    }

    return shifted;
  }

  /** @type {TransformResult['mappings']} */
  const mappings = [];
  for (const mapping of result.mappings ?? []) {
    let [virtualStart, virtualLength, originalStart, originalLength] = mapping;
    const virtualEnd = virtualStart + virtualLength;
    for (const insertion of insertions) {
      if (insertion.offset <= virtualStart || insertion.offset >= virtualEnd) {
        continue;
      }

      // Split around the insertion. A Verbatim mapping splits its original
      // range at the same distance; an Atom keeps its original range whole.
      const headLength = insertion.offset - virtualStart;
      const verbatim = mapping[4] === 0;
      mappings.push(
        span(
          shift(virtualStart),
          headLength,
          originalStart,
          verbatim ? headLength : originalLength,
          mapping,
        ),
      );
      virtualStart = insertion.offset;
      virtualLength -= headLength;
      if (verbatim) {
        originalStart += headLength;
        originalLength -= headLength;
      }
    }

    mappings.push(span(shift(virtualStart), virtualLength, originalStart, originalLength, mapping));
  }

  result.mappings = mappings;

  for (const directive of result.diagnosticDirectives?.directives ?? []) {
    const start = directive[2];
    directive[2] = shift(start);
    directive[3] = shift(directive[3]);
  }

  return result;
}
