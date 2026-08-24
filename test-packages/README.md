# test-packages

This directory contains direct copies of the `test-packages/` from
[typed-ember/glint](https://github.com/typed-ember/glint) at `v1.10.0-@glint/ember-tsc`. The
source files are byte-identical to upstream. Only two files per package are adapted:
`package.json` (published dependency versions, the TypeScript 7 nightly, this mapper) and
`tsconfig.json` (a `contentMappers` entry, with the upstream top-level `glint` options mirrored
into the mapper options).

These packages are the end-to-end corpus for the mapper. Their `{{! @glint-expect-error }}` and
`// @ts-expect-error` directives are the assertions. A location without a directive is also an
assertion: the type-checker must not report there.

`test/typecheck.js` runs `tsc --runExternalCode` on each package. It compares the output with
`expected/<package>.txt`. An empty file means that the package type-checks the same as Glint. A
file with content records a known difference from Glint. When a difference is corrected, the
test fails until the snapshot is recorded again.

## Packages that are not copied

- `package-test-core`, `package-test-template`, `test-utils`: Glint's own vitest harnesses.
- `ts-plugin-test-app`, `ts-template-imports-app-no-config`: editor scenarios for the tsserver
  plugin and for inferred projects.
- `js-ember-app`: one empty fixture for Glint's default-config tests.
- `v2-ts-ember-addon`: a build-pipeline test.
- The `__tests__` and `*-fixture` directories of `ts-extensionless-app`: they drive Glint's own
  CLI harness (watch mode, build mode, tsc source patches). TypeScript 7 has none of that
  machinery.

## Known differences from Glint

`ts-gts-7-1-app`, `ts-special-forms-app`, and `ts-special-forms-pre-7-1-app` type-check clean.
The differences below are recorded in `expected/*.txt`.

### Extensionless imports of `.gts` modules

TypeScript's content mapper resolution only accepts specifiers that end in a mapped extension.
`import Greeting from './Greeting'` reports TS2307. Glint resolves it. This causes both errors
in `ts-extensionless-app` and one error in `ts-template-imports-app` (`src/index.gts`).

### `.gjs` files with handwritten declaration files

`with-declaration.gjs` has a handwritten `with-declaration.gjs.d.ts`. Glint types the module
from the declaration file. The content mapper transforms the `.gjs` itself and does not read the
declaration file. As a result, `Foo` types as a component without arguments. This causes the
seven `with-declaration-consumer.gts` errors in `ts-template-imports-app`, which include one
unused `@glint-expect-error`.

### The `ember-source` probe is per-process, not per-project

Glint's ember-template-imports environment resolves `ember-source` from the location of
`@glint/ember-tsc`. The result decides if the Ember 7.1 built-in keywords exist. One mapper
process serves all projects, and it resolves the `ember-source` of the workspace root (7.x). A
project that pins `ember-source` 6.x gets the 7.1-mode transform, but its types disagree. In
`ts-template-imports-app`, `{{hash}}` in `Playground.gts` reports "Property 'hash' does not
exist on type 'Keywords & Globals'". The correct fix is a probe root parameter in Glint's
environment.

### Handlebars parse errors are reported, not hidden

`ts-gts-7-1-app/src/globals/array-keyword-preserve-literals.test.gts` uses `{{! ... }}` short
comments with nested mustaches. `@glimmer/syntax` cannot parse them. When this occurs, Glint's
own CLI reports nothing and does not type-check the template
([typed-ember/glint#1221](https://github.com/typed-ember/glint/issues/1221)). The mapper reports
the parse error. A parse diagnostic stops TypeScript's semantic phase for the whole project. For
that reason, the file is excluded in this copy's `tsconfig.json`, and the other 17 files stay
verified.
