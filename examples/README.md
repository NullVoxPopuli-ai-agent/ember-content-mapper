# Examples

Two Ember apps and two Ember libraries that type-check with TypeScript 7 and this mapper. Open
them in your editor to debug the mapper against real code.

## Apps

- `nvp-app`: from `pnpm dlx ember.nvp --type app --layers typescript --layers qunit --layers prettier`
- `cli-app`: from `pnpm dlx ember-cli@latest new cli-app --typescript`

Changes from the generated apps:

- `typescript` is a 7.1 nightly.
- `tsconfig.json` has a `contentMappers` entry for `.gts` and `.gjs`.
- `lint:types` runs `tsc --noEmit --runExternalCode`.
- `@glint/tsserver-plugin` and the lint tooling are removed.
- `compilerOptions.types` no longer lists `ember-source/types` or `@glint/ember-tsc/types`. The
  mapper references both from the transformed text.

Each app has a class component with a signature and blocks (`counter.gts`), a template-only
component (`greeting.gts`), a `.gjs` component with a JSDoc signature (`avatar.gjs`), a modifier,
helper functions, a `.ts` file that imports `.gts` and `.gjs` modules (`components/index.ts`), the
Ember 7.1 keywords, and a rendering test in `.gts`.

## Libraries

Both libraries focus on build inputs and outputs: `src/` holds `.gts`, `.gjs`, and `.ts` modules,
and the build emits browser-ready JS plus type declarations. Each has a class component with a
signature and blocks (`counter.gts`), a template-only component (`greeting.gts`), helper
functions, and an `index.ts` that imports the `.gts` modules.

- `ember-library-v2`: from the Embroider v2 addon blueprint. Rollup compiles `src/` to `dist/`
  and `tsc --runExternalCode` emits `declarations/` through the mapper. A `.gts` module emits
  `counter.d.gts.ts`, and the `.gts`/`.gjs` specifiers in the other declaration files stay as
  written; TypeScript 7 consumers resolve them through the same mapper. `addon.declarations()`
  is not used: it strips `.gts` extensions from the emitted declarations (an `ember-tsc`-era
  workaround), which would break that resolution. Also has a `.gjs` component (`avatar.gjs`) and
  a filled-in `template-registry.ts`.
- `nvp-library`: from the `ember.nvp` library blueprint, built with tsdown and
  `@nullvoxpopuli/ember-rolldown`, which bundle `dist/index.js` and emit a bundled
  `dist/index.d.ts` via isolated declarations. The build tooling needs classic TypeScript's JS
  API, which the 7.1 nightly no longer ships, so `typescript` stays on 6.x and the nightly is
  aliased as `typescript-7`; `lint:types` runs `node ./node_modules/typescript-7/bin/tsc
  --noEmit --runExternalCode`.

## CLI

```sh
pnpm install
pnpm --filter nvp-app lint:types
pnpm --filter cli-app lint:types
pnpm --filter nvp-library lint:types
pnpm --filter ember-library-v2 lint:types
pnpm --filter nvp-library build
pnpm --filter ember-library-v2 build
```

Add a type error inside a `<template>` in `app/templates/application.gts`. The error points at
the template. `TS_CONTENT_MAPPER_DEBUG=1` logs the JSON-RPC traffic.

## VS Code

Open the app directory, for example `code examples/nvp-app`.

1. Install [TypeScript (Native Preview)](https://marketplace.visualstudio.com/items?itemName=TypeScriptTeam.native-preview).
   The marketplace build `0.20260708.2` is older than content mapper support (2026-08-19). Until
   a newer build ships, build it from `microsoft/typescript-go` main (see below).
2. Install Glint 2 1.4.0 or newer. On TypeScript 7 workspaces it registers `.gts` and `.gjs`
   with TypeScript (Native Preview) and does not start its own language server. The "Glint2
   Language Server" output channel logs this.
3. Set `"typescript.experimental.useTsgo": true`, trust the workspace, and reload.

The "TypeScript 7" output channel logs the mapper's JSON-RPC traffic at log level Trace.

To build TypeScript (Native Preview) from source:

```sh
git clone --depth 1 --filter=blob:none --sparse https://github.com/microsoft/typescript-go.git
cd typescript-go
git sparse-checkout set _extension
npm ci
cd _extension
npm run bundle:release
```

Copy `_extension` without `node_modules` to a new directory. Unpack the `lib/` directory of
`@typescript/typescript-<platform>@<nightly>` into `<directory>/lib`. Then:

```sh
npx @vscode/vsce package 0.<date>.99 --no-update-package-json --no-dependencies --target <platform> --allow-unused-files-pattern
code --install-extension native-preview-*.vsix
```

## Neovim

[ember.nvim](https://github.com/NullVoxPopuli/ember.nvim) attaches nvim-lspconfig's `tsc`
(TypeScript 7's LSP) when the nearest `tsconfig.json` has `contentMappers`, and keeps `ts_ls`
and `glint` detached. Without ember.nvim:

```lua
vim.lsp.config('tsc', {
  filetypes = { 'javascript', 'typescript', 'javascript.glimmer', 'typescript.glimmer' },
  -- TypeScript starts content mappers only with this opt-in.
  init_options = { runExternalCode = true },
  get_language_id = function(_, filetype)
    if filetype == 'typescript.glimmer' then
      return 'typescript'
    end

    if filetype == 'javascript.glimmer' then
      return 'javascript'
    end

    return filetype
  end,
})
vim.lsp.enable('tsc')
```
