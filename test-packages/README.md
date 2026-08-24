# test-packages

Direct copies of [typed-ember/glint](https://github.com/typed-ember/glint)'s `test-packages/` at
`v1.10.0-@glint/ember-tsc`. The sources are byte-identical to upstream; only `package.json`
(published dependency versions, TypeScript 7 nightly, this mapper) and `tsconfig.json`
(`contentMappers`, mirroring the upstream top-level `glint` options) are adapted.

These packages are the e2e corpus for this mapper: their `{{! @glint-expect-error }}` and
`// @ts-expect-error` directives (and the deliberate absence of directives elsewhere) assert
exactly which diagnostics the type-checker must and must not produce. `test/typecheck.js` runs
`tsc --runExternalCode` over each package and compares the output against
`expected/<package>.txt`. An empty expectation means the package type-checks identically to
Glint. A non-empty expectation is a known deviation, documented below; if a deviation is fixed,
the test fails until the snapshot is re-recorded.

Not copied: `package-test-core`, `package-test-template`, and `test-utils` (Glint's own vitest
harnesses), `ts-plugin-test-app` and `ts-template-imports-app-no-config` (tsserver-plugin and
inferred-project editor scenarios), `js-ember-app` (a single empty fixture for Glint's
default-config tests), and `v2-ts-ember-addon` (a build-pipeline test). The `__tests__` and
`*-fixture` directories of `ts-extensionless-app` are also not copied: they drive Glint's own
CLI harness (watch mode, build mode, tsc source patches), which does not apply to TypeScript 7.

## Known deviations

Recorded in `expected/*.txt`. `ts-gts-7-1-app`, `ts-special-forms-app`, and
`ts-special-forms-pre-7-1-app` type-check clean.

### Extensionless imports of `.gts` modules

TypeScript's content mapper resolution only recognizes specifiers that carry a mapped extension,
so `import Greeting from './Greeting'` reports TS2307 where Glint resolves it. Affects both
`ts-extensionless-app` errors and one line of `ts-template-imports-app`
(`src/index.gts`).

### `.gjs` files with handwritten declaration files

`with-declaration.gjs` ships a handwritten `with-declaration.gjs.d.ts`, which Glint uses to type
the module. The content mapper's resolution transforms the `.gjs` itself and never consults the
adjacent declaration file, so `Foo` types as an argument-less component. Accounts for the seven
`with-declaration-consumer.gts` lines of `ts-template-imports-app`, including one unused
`@glint-expect-error`.

### `ember-source` version probing is per-process, not per-project

Glint's ember-template-imports environment decides whether the Ember 7.1 built-in keywords exist
by resolving `ember-source` from `@glint/ember-tsc`'s own location. The mapper process is shared
across projects and resolves the workspace root's `ember-source` (7.x), so a project pinning
`ember-source` 6.x still gets the 7.1-mode transform while its types say otherwise:
`Playground.gts`'s `{{hash}}` reports "Property 'hash' does not exist on type
'Keywords & Globals'" in `ts-template-imports-app`. Fixing this needs Glint's environment to
accept a probe root per project.

### Handlebars parse errors are reported, not swallowed

`ts-gts-7-1-app/src/globals/array-keyword-preserve-literals.test.gts` uses `{{! ... }}` short
comments containing nested mustaches, which `@glimmer/syntax` cannot parse. Glint's own CLI
silently skips type-checking the entire template in that case (upstream, the file's assertions
are not actually verified, and a planted type error goes unreported). The mapper reports the
parse error instead. Because a parse diagnostic suppresses TypeScript's semantic phase for the
whole project, the file is excluded in this copy's `tsconfig.json` so the other 17 files stay
verified.
