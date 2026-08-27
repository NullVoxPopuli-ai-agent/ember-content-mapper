# ember-content-mapper

Type-check `.gts` and `.gjs` files with native TypeScript 7.

This package is a [TypeScript content mapper](https://github.com/microsoft/typescript-go/pull/4712).

## Requirements

- TypeScript 7.1 nightly or newer (`typescript@next`).
- Node 22.21.1 or newer, or Node 24.10.0 or newer. See [Node](#node).
- imports must specify the file extensions

### Node

The mapper process runs on Node 22 and 24. The constraint comes from the `tsc` launcher: the
`typescript` package's `bin/tsc` replaces itself with the native compiler through
`process.execve`, and on Node 22.15.0 to 22.20.0 and 24.0.0 to 24.9.x `process.execve` starts
the compiler with an empty environment
([nodejs/node#60029](https://github.com/nodejs/node/pull/60029)). Without `PATH`, the compiler
cannot find `node` to start the mapper, and every mapped file reports:

```
error TS100026: The content mapper 'ember-content-mapper' failed 5 times and will not be used.
<file>(1,1): error TS100025: The content mapper 'ember-content-mapper' failed to transform this file.
  The content mapper process failed while handling the project request.
```

The mapper never starts, so it cannot report a clearer error. The `engines` field in
`package.json` makes package managers warn at install time. On an affected Node, run the native
binary directly, for example `node_modules/@typescript/typescript-linux-x64/lib/tsc`.

## Install

```sh
pnpm add -D ember-content-mapper @glint/ember-tsc
```

## Use

Add the mapper to `tsconfig.json`:

```jsonc
{
  "contentMappers": [
    {
      "package": "ember-content-mapper",
      "extensions": [".gts", ".gjs"],
    },
  ],
  "include": ["src"],
}
```

Type-check:

```sh
tsc --noEmit --runExternalCode
```

### Options

`options` accepts the options of Glint's `ember-template-imports` environment:

```jsonc
{
  "contentMappers": [
    {
      "package": "ember-content-mapper",
      "extensions": [".gts", ".gjs"],
      "options": {
        "additionalGlobals": ["t"],
        "additionalSpecialForms": {},
      },
    },
  ],
}
```

### Directives

Glint's directives work as before:

- `{{! @glint-expect-error }}` suppresses the diagnostics on the next line. If there are none,
  TypeScript reports `glint2578: Unused '@glint-expect-error' directive.`
- `{{! @glint-ignore }}` suppresses the diagnostics on the next line.
- `{{! @glint-nocheck }}` suppresses the diagnostics in the whole template.

### Declaration files

A sibling declaration file wins over transforming the module, matching Glint: `counter.gjs` is
typed from `counter.d.gjs.ts` (TypeScript 7's arbitrary-extension convention) or `counter.gjs.d.ts`
(Glint's) when one exists. The declaration is parsed as a `.ts` module, so anything unbodied or
uninitialized in it must use ambient (`declare`) syntax.

## Migrating from TS6

On TypeScript 6, Glint 2 type-checks `.gts` and `.gjs` with its own compiler, `ember-tsc`, and
serves editors from its own language server. TypeScript 7 does both itself and calls this mapper
for the transform. So most of the migration is deleting configuration.

Install the TypeScript 7 nightly and the mapper:

```sh
pnpm add -D typescript@next ember-content-mapper
```

Keep `@glint/ember-tsc` and `@glint/template` installed. The mapper transforms with
`@glint/ember-tsc` and references its types, and `@glint/template` types the signatures you write
by hand.

### tsconfig.json

Add the `contentMappers` entry from [Use](#use). Then remove:

- `"ember-source/types"` and `"@glint/ember-tsc/types"` from `compilerOptions.types`. The mapper
  references both from the transformed text now. Keep every other entry, for example
  `"@embroider/core/virtual"` or `"vite/client"`. If nothing is left and the config extends
  `@tsconfig/ember` or `@ember/app-tsconfig`, drop the key: those already set `"types": []`.
- `{ "name": "@glint/tsserver-plugin" }` from `compilerOptions.plugins`. TypeScript 7 does not
  load tsserver plugins. The `contentMappers` entry replaces it.

If the project still has a Glint 1 `glint` key, its `environment` options move to the mapper's
`options`. See [Options](#options).

### package.json

- Replace `ember-tsc` in your scripts with `tsc --noEmit --runExternalCode`. Without
  `--runExternalCode`, TypeScript reports `TS100024: Content mappers require the
  '--runExternalCode' command line flag to be enabled.`
- Remove `@glint/tsserver-plugin`.

### Source

Add the extension to relative imports of `.gts` and `.gjs` modules:

```diff
-export { default as Counter } from './counter';
+export { default as Counter } from './counter.gts';
```

TypeScript resolves a content-mapped file only when the specifier has the extension. Glint
resolved it either way, so this is usually the only source change the migration needs.

Glint's `{{! @glint-expect-error }}`, `{{! @glint-ignore }}`, and `{{! @glint-nocheck }}`
directives keep working. See [Directives](#directives).

### Editor

Glint's language server is no longer in the loop. See [Editors](#editors) for what replaces it.

## Editors

- VS Code: TypeScript (Native Preview) plus Glint 2 1.4.0 or newer. Glint registers `.gts` and
  `.gjs` with TypeScript and stands down its own language server.
- Neovim: [ember.nvim](https://github.com/NullVoxPopuli/ember.nvim) attaches TypeScript 7's LSP
  when `tsconfig.json` has `contentMappers`.

[examples/README.md](./examples/README.md) has the details.

## Debug

`TS_CONTENT_MAPPER_DEBUG=1` logs the JSON-RPC traffic between `tsc` and the mapper.

## Repository

- [`examples/`](./examples): two Ember apps that use the mapper.
- [`test/test-packages/`](./test/test-packages): copies of Glint's test packages, with the known
  differences recorded in [test/test-packages/README.md](./test/test-packages/README.md).
- [`test/`](./test): snapshot tests of the transform, tests of the server process, LSP tests
  against the example app (hover, definition, completion, diagnostics, rename), and compiler
  mode tests (declaration emit, `--build` up-to-date checks, option diagnostics).

## Prior art

- [mdx-content-mapper](https://github.com/remcohaszing/mdx-content-mapper), which this package
  follows.
- [Vue's content mapper](https://github.com/vuejs/language-tools/issues/6170).

## License

[MIT](LICENSE.md)
