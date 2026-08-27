# test-packages

Copies of Glint's `test-packages/` at `v1.10.0-@glint/ember-tsc`. The source files are identical to
upstream. Only `package.json` (published versions, the TypeScript 7 nightly, this mapper) and
`tsconfig.json` (the `contentMappers` entry, with the upstream `glint` options as mapper options)
are changed.

The `@glint-expect-error` and `@ts-expect-error` directives in these files are the assertions. A
line without a directive asserts that there is no diagnostic.

`test/typecheck.js` runs `tsc --runExternalCode` on each package and compares the output with
`expected/<package>.txt`. An empty file means that the output is the same as Glint's. Other files
record the known differences below. When a difference is fixed, the test fails until the file is
updated.

Not copied: `package-test-core`, `package-test-template`, `test-utils` (vitest harnesses),
`ts-plugin-test-app` and `ts-template-imports-app-no-config` (editor scenarios), `js-ember-app`
(one empty fixture), `v2-ts-ember-addon` (a build test), and the `__tests__` and `*-fixture`
directories of `ts-extensionless-app` (Glint's CLI harness).

## Known differences

`ts-gts-7-1-app`, `ts-special-forms-app`, and `ts-special-forms-pre-7-1-app` type-check clean.

### Extensionless imports

TypeScript resolves content-mapped files only when the specifier has the extension.
`import Greeting from './Greeting'` reports TS2307. Glint resolves it. This causes both errors in
`ts-extensionless-app` and one in `ts-template-imports-app` (`src/index.gts`).

### `.gjs` files with declaration files

Glint types `with-declaration.gjs` from `with-declaration.gjs.d.ts`. The mapper transforms the
`.gjs` and does not read the declaration file, so `Foo` types as a component without arguments.
This causes the seven `with-declaration-consumer.gts` errors in `ts-template-imports-app`.

### `ember-source` version per process

Glint's environment resolves `ember-source` from the location of `@glint/ember-tsc`. One mapper
process serves all projects and resolves the `ember-source` of the workspace root (7.x). A
project with `ember-source` 6.x gets the 7.1 transform while its types disagree. In
`ts-template-imports-app`, `{{hash}}` in `Playground.gts` reports "Property 'hash' does not exist
on type 'Keywords & Globals'". The fix is a probe root parameter in Glint's environment.

### Parse errors

`ts-gts-7-1-app/src/globals/array-keyword-preserve-literals.test.gts` has `{{! ... }}` comments
with nested mustaches, which `@glimmer/syntax` cannot parse. Glint's CLI reports nothing and does
not check the template ([typed-ember/glint#1221](https://github.com/typed-ember/glint/issues/1221)).
The mapper reports the parse error. A parse error stops TypeScript's semantic phase for the whole
project, so the file is excluded in `tsconfig.json` and the other 17 files stay checked.
