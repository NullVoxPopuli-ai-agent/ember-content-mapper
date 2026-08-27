/**
 * @import { DiagnosticDirectives, MappedDiagnosticDirective } from '../protocol.js'
 * @import { DirectiveAnalysis, Region } from './mappings.js'
 */

import { DiagnosticDirectivePolicy } from '../constants.js';

/**
 * Merge overlapping or touching virtual regions into their unions.
 *
 * @param {Region[]} regions
 *   The regions to merge.
 * @returns {Region[]}
 *   The merged regions, sorted by virtual start.
 */
function mergeRegions(regions) {
  const sorted = regions.slice().sort((a, b) => a.virtualStart - b.virtualStart);
  /** @type {Region[]} */
  const merged = [];

  for (const region of sorted) {
    const previous = merged.at(-1);
    if (previous && region.virtualStart <= previous.virtualEnd) {
      previous.virtualEnd = Math.max(previous.virtualEnd, region.virtualEnd);
      previous.originalStart = Math.min(previous.originalStart, region.originalStart);
      previous.originalEnd = Math.max(previous.originalEnd, region.originalEnd);
    } else {
      merged.push({ ...region });
    }
  }

  return merged;
}

/**
 * Tracks accepted virtual ranges so that later, lower-priority directives can
 * be clipped around them: TypeScript rejects diagnostic directives whose
 * virtual ranges overlap.
 */
class DisjointRanges {
  /** @type {{ start: number, end: number }[]} */
  #accepted = [];

  /**
   * Reserve a range, returning the subranges not already covered.
   *
   * @param {number} start
   *   The start of the range to reserve.
   * @param {number} end
   *   The end of the range to reserve.
   * @returns {{ start: number, end: number }[]}
   *   The parts of the range that were still free.
   */
  reserve(start, end) {
    /** @type {{ start: number, end: number }[]} */
    const free = [];
    let cursor = start;

    const overlapping = this.#accepted
      .filter((range) => range.end > start && range.start < end)
      .sort((a, b) => a.start - b.start);

    for (const range of overlapping) {
      if (range.start > cursor) {
        free.push({ start: cursor, end: range.start });
      }

      cursor = Math.max(cursor, range.end);
    }

    if (cursor < end) {
      free.push({ start: cursor, end });
    }

    for (const range of free) {
      this.#accepted.push(range);
    }

    return free;
  }
}

/**
 * Convert the directive analysis into content mapper diagnostic directives.
 *
 * Each `{{! @glint-expect-error }}` becomes an Expect directive over the
 * virtual range its area of effect transforms to, so TypeScript itself
 * suppresses the expected diagnostics and reports the directive comment when
 * it suppressed nothing. `@glint-ignore` and `@glint-nocheck` areas become
 * Ignore directives, as do the scaffolding regions Glint emits for its own
 * Volar-based diagnostic machinery.
 *
 * @param {DirectiveAnalysis} analysis
 *   The directive analysis produced by `buildMappings`.
 * @returns {DiagnosticDirectives | undefined}
 *   The diagnostic directives, if any.
 */
export function buildDiagnosticDirectives(analysis) {
  /** @type {MappedDiagnosticDirective[]} */
  const directives = [];

  // Group expect-error nodes by their owning directive. The placeholder for a
  // directive maps back to the directive comment, and a directive's comment
  // always precedes its area of effect in the original text, so each node
  // belongs to the nearest preceding placeholder.
  const placeholders = analysis.placeholders
    .slice()
    .sort((a, b) => a.originalStart - b.originalStart);
  /** @type {Map<number, Region[]>} */
  const byPlaceholder = new Map();
  /** @type {Region[]} */
  const unowned = [];

  for (const node of analysis.expectNodes) {
    let owner = -1;
    for (const [index, placeholder] of placeholders.entries()) {
      if (placeholder.originalStart <= node.originalStart) {
        owner = index;
      } else {
        break;
      }
    }

    if (owner === -1) {
      unowned.push(node);
      continue;
    }

    const group = byPlaceholder.get(owner);
    if (group) {
      group.push(node);
    } else {
      byPlaceholder.set(owner, [node]);
    }
  }

  // Directives may not overlap in virtual text, but the analysis regions do:
  // the Ignore-carrying `elementTypes` duplicates sit inside expect-error
  // areas, for example. Reserve ranges in priority order, clipping each
  // directive to the parts still free. Expect areas go first so an area is
  // never split (a split area would report one unused-directive diagnostic
  // per fragment).
  const reserved = new DisjointRanges();

  /**
   * @param {Region} region
   *   The directive's region.
   * @param {import('../protocol.js').DiagnosticDirectivePolicy} policy
   *   The directive's policy.
   */
  function emit(region, policy) {
    for (const free of reserved.reserve(region.virtualStart, region.virtualEnd)) {
      directives.push([
        region.originalStart,
        region.originalEnd - region.originalStart,
        free.start,
        free.end,
        policy,
      ]);
    }
  }

  for (const [index, nodes] of byPlaceholder) {
    const placeholder = placeholders[index];
    let virtualStart = Infinity;
    let virtualEnd = -Infinity;
    for (const node of nodes) {
      virtualStart = Math.min(virtualStart, node.virtualStart);
      virtualEnd = Math.max(virtualEnd, node.virtualEnd);
    }

    emit(
      {
        originalStart: placeholder.originalStart,
        originalEnd: placeholder.originalEnd,
        virtualStart,
        virtualEnd,
      },
      DiagnosticDirectivePolicy.Expect,
    );
  }

  for (const region of mergeRegions(unowned)) {
    emit(region, DiagnosticDirectivePolicy.Expect);
  }

  for (const region of analysis.scaffolding) {
    emit(region, DiagnosticDirectivePolicy.Ignore);
  }

  for (const region of mergeRegions(analysis.ignoreNodes)) {
    emit(region, DiagnosticDirectivePolicy.Ignore);
  }

  if (directives.length === 0) {
    return undefined;
  }

  directives.sort((a, b) => a[2] - b[2]);

  return {
    unusedExpectDirectiveDiagnostics: [
      { code: 2578, messageText: "Unused '@glint-expect-error' directive." },
    ],
    directives,
  };
}
