/**
 * Benchmark script using mitata.
 *
 * When run standalone (`node --expose-gc test/transform.bench.mjs`), it
 * benchmarks the local transform only. When `bench-compare.mjs` passes
 * `--control-dir <dir>`, it also loads the control (base-branch) transform
 * from that directory and wraps each size in a `summary()` so mitata shows a
 * side-by-side comparison with boxplots.
 *
 * Usage:
 *   node --expose-gc test/transform.bench.mjs [--control-dir <path>]
 */

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { bench, boxplot, do_not_optimize, run, summary } from 'mitata';

import { openProject } from '../src/requests/open-project.js';
import { transform } from '../src/requests/transform.js';

// ---------------------------------------------------------------------------
// CLI args
// ---------------------------------------------------------------------------

const args = process.argv.slice(2);
const ctrlIdx = args.indexOf('--control-dir');
const controlArg = ctrlIdx === -1 ? undefined : args[ctrlIdx + 1];
const CONTROL_DIR = controlArg ? resolve(controlArg) : null;

// ---------------------------------------------------------------------------
// Set up experiment (current branch) and control (base branch) transforms
// ---------------------------------------------------------------------------

/**
 * @typedef {(fileName: string, content: string) => unknown} Transformer
 */

/**
 * Open a bench project and bind a transform function to it. The two sides are
 * separate module instances, so each registers the handle in its own project
 * map.
 *
 * @param {{ openProject: typeof openProject, transform: typeof transform }} requests
 *   The request handlers of one side.
 * @param {string} handle
 *   The project handle to open.
 * @returns {Transformer}
 *   A transform bound to the opened project.
 */
function makeTransformer(requests, handle) {
  requests.openProject({ configFileName: '', compilerOptions: {}, projectHandle: handle });

  return (fileName, content) => requests.transform({ content, fileName, projectHandle: handle });
}

const experimentTransform = makeTransformer({ openProject, transform }, 'bench:experiment');

/** @type {Transformer | null} */
let controlTransform = null;

if (CONTROL_DIR) {
  /** @type {{ openProject: typeof openProject }} */
  const controlOpenProject = await import(resolve(CONTROL_DIR, 'src/requests/open-project.js'));
  /** @type {{ transform: typeof transform }} */
  const controlTransformModule = await import(resolve(CONTROL_DIR, 'src/requests/transform.js'));

  controlTransform = makeTransformer(
    { openProject: controlOpenProject.openProject, transform: controlTransformModule.transform },
    'bench:control',
  );
}

// ---------------------------------------------------------------------------
// Fixture content
// ---------------------------------------------------------------------------

/**
 * @param {string} name
 *   The fixture file name.
 * @returns {{ content: string, path: string }}
 *   The fixture content and its absolute path.
 */
function fixture(name) {
  const path = fileURLToPath(new URL(`./bench/${name}`, import.meta.url));

  return { content: readFileSync(path, 'utf8'), path };
}

const TYPES = /** @type {const} */ (['gts', 'gjs']);
const SIZES = /** @type {const} */ (['small', 'medium', 'large']);

const FIXTURES = TYPES.map((type) => ({
  type,
  sizes: SIZES.map((size) => ({ size, ...fixture(`${size}.${type}`) })),
}));

// ---------------------------------------------------------------------------
// JIT warm-up — transform every fixture on both sides so V8 compiles and
// optimises the hot paths before any measurement begins.  Without this, the
// first-to-run side pays the JIT compilation cost, creating order bias.
// ---------------------------------------------------------------------------

const WARMUP_ROUNDS = 20;

for (const { sizes } of FIXTURES) {
  for (const { content, path } of sizes) {
    for (let i = 0; i < WARMUP_ROUNDS; i++) {
      do_not_optimize(experimentTransform(path, content));
      if (controlTransform) do_not_optimize(controlTransform(path, content));
    }
  }
}

globalThis.gc?.();

// Alternate registration order: whichever side runs first in a summary group
// gets a small advantage (warm instruction cache, more favourable
// thermal/frequency state).  By flipping the order on every other group the
// bias cancels out across the full run instead of always penalising the same
// side.
let groupIndex = 0;

for (const { type, sizes } of FIXTURES) {
  for (const { size, content, path } of sizes) {
    // Force a full GC before each benchmark group to reduce GC-triggered variance
    globalThis.gc?.();

    const boundControl = controlTransform;
    if (boundControl) {
      const controlFirst = groupIndex % 2 === 0;
      groupIndex++;

      boxplot(() => {
        summary(() => {
          if (controlFirst) {
            bench(`${type} ${size} (control)`, () => do_not_optimize(boundControl(path, content)));
            bench(`${type} ${size} (experiment)`, () =>
              do_not_optimize(experimentTransform(path, content)));
          } else {
            bench(`${type} ${size} (experiment)`, () =>
              do_not_optimize(experimentTransform(path, content)));
            bench(`${type} ${size} (control)`, () => do_not_optimize(boundControl(path, content)));
          }
        });
      });
    } else {
      // Standalone mode — just benchmark the local transform
      bench(`${type} ${size}`, () => do_not_optimize(experimentTransform(path, content)));
    }
  }
}

// ---------------------------------------------------------------------------
// Run
// ---------------------------------------------------------------------------

const result = await run({ colors: false, throw: true });

// Write JSON output if requested
const jsonPath = process.env['BENCH_JSON_OUTPUT'];
if (jsonPath) {
  const { writeFileSync } = await import('node:fs');

  const benchmarks = result.benchmarks.map((trial) => ({
    alias: trial.alias,
    runs: trial.runs.map((r) => ({
      name: r.name,
      args: r.args,
      error: r.error
        ? { message: r.error instanceof Error ? r.error.message : String(r.error) }
        : undefined,
      stats: r.stats
        ? {
            avg: r.stats.avg,
            min: r.stats.min,
            max: r.stats.max,
            p50: r.stats.p50,
            p75: r.stats.p75,
            p99: r.stats.p99,
            samples: r.stats.samples,
          }
        : undefined,
    })),
  }));

  writeFileSync(jsonPath, JSON.stringify({ context: result.context, benchmarks }, null, 2));
}
