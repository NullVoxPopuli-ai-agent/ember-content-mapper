# Example apps

Two Ember apps that type-check with TypeScript 7 and this mapper. Open them in your editor to
debug the mapper against real app code.

- `nvp-app`: from `pnpm dlx ember.nvp --type app --layers typescript --layers qunit --layers prettier`
- `cli-app`: from `pnpm dlx ember-cli@latest new cli-app --typescript`

Changes from the generated apps:

- `typescript` is a 7.1 nightly.
- `tsconfig.json` has a `contentMappers` entry for `.gts` and `.gjs`.
- `lint:types` runs `tsc --noEmit --runExternalCode`.
- `@glint/tsserver-plugin` and the lint tooling are removed.

Each app has a class component with a signature and blocks (`counter.gts`), a template-only
component (`greeting.gts`), a `.gjs` component with a JSDoc signature (`avatar.gjs`), a modifier,
helper functions, a `.ts` file that imports `.gts` and `.gjs` modules (`components/index.ts`), the
Ember 7.1 keywords, and a rendering test in `.gts`.

## CLI

```sh
pnpm install
pnpm --filter nvp-app lint:types
pnpm --filter cli-app lint:types
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
