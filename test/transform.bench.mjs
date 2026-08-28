/**
 * Benchmark script using mitata.
 *
 * Benchmarks the transform request of exactly one source tree per process.
 * By default that is the current checkout; `--dir <path>` benchmarks another
 * tree with the same fixtures and harness (bench-compare.mjs uses this for
 * the base branch). The two sides of a comparison never share a process:
 * two copies of the same code in one V8 heap get different code layout and
 * optimization treatment, which skewed p50s by up to 16% on identical code.
 *
 * Usage:
 *   node --expose-gc test/transform.bench.mjs [--dir <path>] [--label <name>]
 *
 * Options:
 *   --dir <path>     Source tree to benchmark (default: the repo root)
 *   --label <name>   Suffix for benchmark names, e.g. "control" produces
 *                    "gts small (control)" (default: no suffix)
 */

import { readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

import { bench, do_not_optimize, run } from 'mitata';

// ---------------------------------------------------------------------------
// CLI args
// ---------------------------------------------------------------------------

const args = process.argv.slice(2);

/**
 * @param {string} flag
 *   The flag to look up.
 * @returns {string | undefined}
 *   The value after the flag.
 */
function argValue(flag) {
  const index = args.indexOf(flag);

  return index === -1 ? undefined : args[index + 1];
}

const dirArg = argValue('--dir');
const TREE = dirArg ? resolve(dirArg) : fileURLToPath(new URL('..', import.meta.url));
const LABEL = argValue('--label');

// ---------------------------------------------------------------------------
// Load the tree's request handlers and open a bench project
// ---------------------------------------------------------------------------

/** @type {{ openProject: typeof import('../src/requests/open-project.js').openProject }} */
const { openProject } = await import(
  pathToFileURL(join(TREE, 'src/requests/open-project.js')).href
);
/** @type {{ transform: typeof import('../src/requests/transform.js').transform }} */
const { transform } = await import(pathToFileURL(join(TREE, 'src/requests/transform.js')).href);

openProject({ configFileName: '', compilerOptions: {}, projectHandle: 'bench' });

/**
 * @param {string} fileName
 *   The original file name.
 * @param {string} content
 *   The file content.
 * @returns {unknown}
 *   The transform result.
 */
function benchTransform(fileName, content) {
  return transform({ content, fileName, projectHandle: 'bench' });
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

const FIXTURES = TYPES.flatMap((type) =>
  SIZES.map((size) => ({ name: `${type} ${size}`, ...fixture(`${size}.${type}`) })),
);

// ---------------------------------------------------------------------------
// JIT warm-up — transform every fixture so V8 compiles and optimises the hot
// paths before any measurement begins
// ---------------------------------------------------------------------------

const WARMUP_ROUNDS = 20;

for (const { content, path } of FIXTURES) {
  for (let i = 0; i < WARMUP_ROUNDS; i++) {
    do_not_optimize(benchTransform(path, content));
  }
}

globalThis.gc?.();

// ---------------------------------------------------------------------------
// Register and run
// ---------------------------------------------------------------------------

for (const { name, content, path } of FIXTURES) {
  const benchName = LABEL ? `${name} (${LABEL})` : name;

  bench(benchName, () => do_not_optimize(benchTransform(path, content)));
}

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
