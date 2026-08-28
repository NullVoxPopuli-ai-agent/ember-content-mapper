/**
 * Benchmark comparison script using mitata.
 *
 * Copies the base branch's source to a temp directory, installs its
 * dependencies, then runs test/transform.bench.mjs several times: one process
 * per side per round, in mirrored order (control, experiment, experiment,
 * control, …). Separate processes prevent the two sides from sharing a V8
 * heap, which skewed p50s by up to 16% on identical code. The mirrored order
 * cancels runner frequency drift. The per-round p50s are merged into one
 * JSON result (median across rounds), with the round-to-round spread kept as
 * the noise estimate.
 *
 * Usage:
 *   node scripts/bench-compare.mjs [--base <branch>] [--rounds <n>]
 *
 * Options:
 *   --base <branch>   Branch to compare against (default: main)
 *   --rounds <n>      Rounds per side (default: 3, or BENCH_ROUNDS)
 */

import { execSync, spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

// ---------------------------------------------------------------------------
// CLI args
// ---------------------------------------------------------------------------

const args = process.argv.slice(2);

function argValue(flag) {
  const index = args.indexOf(flag);

  return index === -1 ? undefined : args[index + 1];
}

const BASE_BRANCH = argValue('--base') ?? 'main';
const ROUNDS = Number(argValue('--rounds') ?? process.env.BENCH_ROUNDS ?? 3);

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function run(cmd, opts = {}) {
  return execSync(cmd, { stdio: 'inherit', ...opts });
}

/**
 * Resolve a branch name to a commit SHA. Tries `origin/<branch>` first (for CI
 * where only the PR branch is checked out locally), then falls back to `<branch>`.
 */
function resolveRef(branch) {
  for (const candidate of [`origin/${branch}`, branch]) {
    const result = spawnSync('git', ['rev-parse', '--verify', candidate], {
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe'],
    });
    if (result.status === 0) return result.stdout.trim();
  }
  throw new Error(`Could not resolve ref for branch "${branch}". Is it fetched?`);
}

function median(nums) {
  const sorted = nums.slice().sort((a, b) => a - b);
  const mid = sorted.length >> 1;

  return sorted.length % 2 === 1 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

const ROOT = process.cwd();
const WORK_DIR = join(tmpdir(), `bench-compare-${Date.now()}`);
const CONTROL_DIR = join(WORK_DIR, 'control');
const RESULTS_DIR = join(WORK_DIR, 'results');

console.error(`\n🔧  Setting up control (${BASE_BRANCH}) in ${CONTROL_DIR}\n`);

const BASE_REF = resolveRef(BASE_BRANCH);
console.error(`   Resolved ${BASE_BRANCH} → ${BASE_REF.slice(0, 10)}\n`);

// Clean up temp dir on exit
function cleanup() {
  if (existsSync(WORK_DIR)) {
    try {
      rmSync(WORK_DIR, { recursive: true, force: true });
    } catch {
      // best-effort cleanup
    }
  }
}
process.on('exit', cleanup);
process.on('SIGINT', () => process.exit(130));
process.on('SIGTERM', () => process.exit(143));

try {
  // ── 1. Export base branch source to temp dir ─────────────────────────────
  mkdirSync(CONTROL_DIR, { recursive: true });
  mkdirSync(RESULTS_DIR, { recursive: true });

  // Copy the full tree (use the resolved SHA for reliability). The pnpm
  // workspace lists examples/* and test/test-packages/*, so a frozen-lockfile
  // install needs their manifests present.
  run(`git archive ${BASE_REF} | tar -x -C "${CONTROL_DIR}"`);

  // ── 2. Install dependencies in control dir ───────────────────────────────
  console.error(`\n📦  Installing dependencies for control (${BASE_BRANCH})…\n`);
  run('pnpm install --frozen-lockfile', {
    cwd: CONTROL_DIR,
    stdio: ['inherit', 'pipe', 'inherit'],
  });

  // ── 3. Run one bench process per side per round, in mirrored order ───────
  const benchScript = join(ROOT, 'test/transform.bench.mjs');

  // CPU pinning on Linux to reduce cross-core migration variance
  const IS_LINUX = process.platform === 'linux';
  const HAS_TASKSET = IS_LINUX && spawnSync('which', ['taskset'], { stdio: 'pipe' }).status === 0;
  if (HAS_TASKSET) console.error('📌  CPU pinning enabled (taskset -c 0)\n');

  const SIDES = { control: CONTROL_DIR, experiment: ROOT };
  const resultFiles = [];

  for (let round = 0; round < ROUNDS; round++) {
    const order = round % 2 === 0 ? ['control', 'experiment'] : ['experiment', 'control'];

    for (const side of order) {
      console.error(`\n🏎️  Round ${round + 1}/${ROUNDS}: ${side}…\n`);
      console.log(`\n━━━ round ${round + 1}/${ROUNDS}: ${side} ━━━\n`);

      const jsonPath = join(RESULTS_DIR, `round-${round}-${side}.json`);
      const benchArgs = [
        '--expose-gc',
        '--max-old-space-size=4096',
        benchScript,
        '--dir',
        SIDES[side],
        '--label',
        side,
      ];

      const cmd = HAS_TASKSET ? 'taskset' : 'node';
      const fullArgs = HAS_TASKSET ? ['-c', '0', 'node'].concat(benchArgs) : benchArgs;

      // The patched mitata (patches/mitata@1.0.34.patch) reads these sampling
      // floors from the environment. Its defaults (12 samples, 642ms of CPU
      // time per benchmark) make the p50 of the slow benchmarks unstable.
      // Values from the caller's environment win.
      const result = spawnSync(cmd, fullArgs, {
        stdio: 'inherit',
        cwd: ROOT,
        env: {
          MITATA_MIN_SAMPLES: '30',
          MITATA_MIN_CPU_TIME_MS: '3000',
          ...process.env,
          BENCH_JSON_OUTPUT: jsonPath,
        },
      });

      if (result.status !== 0) {
        console.error(`\n❌  Benchmark run failed (round ${round + 1}, ${side}).`);
        process.exit(1);
      }

      resultFiles.push(jsonPath);
    }
  }

  // ── 4. Merge the per-round results (median of p50s across rounds) ────────
  const byName = new Map();
  let context;

  for (const file of resultFiles) {
    const json = JSON.parse(readFileSync(file, 'utf8'));
    context ??= json.context;

    for (const trial of json.benchmarks || []) {
      for (const r of trial.runs || []) {
        if (!r.stats) continue;
        if (!byName.has(r.name)) byName.set(r.name, []);
        byName.get(r.name).push(r.stats);
      }
    }
  }

  const benchmarks = [];
  for (const [name, statsList] of byName) {
    const p50s = statsList.map((s) => s.p50 ?? s.avg);

    benchmarks.push({
      alias: name,
      runs: [
        {
          name,
          stats: {
            avg: median(statsList.map((s) => s.avg)),
            p50: median(p50s),
            min: median(statsList.map((s) => s.min)),
            max: median(statsList.map((s) => s.max)),
            roundP50s: p50s,
          },
        },
      ],
    });
  }

  const jsonOut = process.env.BENCH_JSON_OUTPUT;
  if (jsonOut) {
    writeFileSync(jsonOut, JSON.stringify({ context, rounds: ROUNDS, benchmarks }, null, 2));
  }

  console.error('\n✅  Benchmark comparison complete.\n');
} catch (e) {
  console.error('❌  Error:', e.message);
  process.exit(1);
}
