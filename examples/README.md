# Example apps

Two full Ember apps wired to type-check with native TypeScript 7 and this content mapper. Use them
to debug the mapper against real app code in your editor.

- `nvp-app`: generated with `pnpm dlx ember.nvp --type app --layers typescript --layers qunit --layers prettier`
- `cli-app`: generated with `pnpm dlx ember-cli@latest new cli-app --typescript`

Changes from the generated output, in each app:

- `typescript` is pinned to a 7.1 nightly.
- `tsconfig.json` registers `ember-content-mapper` for `.gts`/`.gjs` under `contentMappers`.
- `lint:types` runs `tsc --noEmit --runExternalCode` instead of `ember-tsc --noEmit`.
- `@glint/tsserver-plugin` is removed. It only loads into a TypeScript 5/6 tsserver; with TS 7 the
  content mapper covers type-checking instead.

Each app exercises the surfaces the mapper has to handle: a class-based component with a signature,
tracked state, and yielded blocks (`counter.gts`), a template-only component (`greeting.gts`), an
untyped `.gjs` component with a JSDoc signature (`avatar.gjs`), a custom modifier
(`modifiers/autofocus.ts`) and plain functions used as helpers, a `.ts` barrel importing `.gts` and
`.gjs` modules (`components/index.ts`), the Ember 7.1 built-in keywords (`on`, `gt`, `each`),
`trackedArray` from `@ember/reactive/collections` (nvp-app), and a rendering test written in `.gts`.

## Type-check from the CLI

```sh
pnpm install
pnpm --filter nvp-app lint:types
pnpm --filter cli-app lint:types
```

Add a type error inside a `<template>` tag in `app/templates/application.gts` to see it reported at
the template position. Set `TS_CONTENT_MAPPER_DEBUG=1` to log the JSON-RPC traffic.

## Debug in VS Code

The marketplace build of the
[TypeScript (Native Preview)](https://marketplace.visualstudio.com/items?itemName=TypeScriptTeam.native-preview)
extension is `0.20260708.2` (2026-07-08) and predates content mapper support (merged
2026-08-19). Until a newer build ships, build the extension from
[microsoft/typescript-go](https://github.com/microsoft/typescript-go) main. The client code is
TypeScript; the native server comes from the published platform package, so no Go toolchain is
needed:

```sh
git clone --depth 1 --filter=blob:none --sparse https://github.com/microsoft/typescript-go.git
cd typescript-go
git sparse-checkout set _extension
npm ci
cd _extension
npm run bundle:release
# stage: copy _extension (minus node_modules and tsconfigs) to a clean directory,
# then unpack the `lib/` of @typescript/typescript-<platform>@<nightly> into <stage>/lib
npx @vscode/vsce package 0.<date>.99 --no-update-package-json --no-dependencies --target <platform> --allow-unused-files-pattern
code --install-extension native-preview-*.vsix
```

Then:

1. Set `"typescript.experimental.useTsgo": true` and reload. Trust the workspace: the extension
   sends the `runExternalCode` opt-in (setting `js/ts.contentMappers.enabled`, default true)
   only for trusted workspaces.
2. Disable the Glint extension for this workspace (Extensions view, "Disable (Workspace)"). Its
   language server needs a TypeScript 5/6 workspace library, and these apps pin TypeScript 7.
   [typed-ember/glint#1228](https://github.com/typed-ember/glint/pull/1228) makes the extension
   stand down on TypeScript 7 workspaces by itself.
3. Open a `.ts` file first so the server discovers the app's `tsconfig.json`. Full `.gts` editor
   features also need an extension that registers the mapper's file extensions with the
   TypeScript extension (`registerContentMappers`), and that does not exist yet.

Set the TypeScript log level to Trace to see the mapper's JSON-RPC traffic in the "TypeScript 7"
output channel.

## Debug in Neovim

Classic setups (`ts_ls` + `@glint/tsserver-plugin`, or `glint-language-server`) only work against a
TypeScript 5/6 tsserver, so in these apps they paint syntax errors over every `<template>` tag.
Detach them for content-mapper projects and use nvim-lspconfig's `tsc` (TypeScript 7's native LSP)
instead:

```lua
vim.lsp.config('tsc', {
  filetypes = {
    'javascript',
    'typescript',
    'javascript.glimmer',
    'typescript.glimmer',
  },
  init_options = {
    -- Content mappers spawn processes declared by the project, so TypeScript
    -- requires this explicit opt-in (VS Code sends it for trusted workspaces).
    runExternalCode = true,
  },
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

[ember.nvim](https://github.com/NullVoxPopuli/ember.nvim) does all of this automatically for
projects whose tsconfig declares `contentMappers` (see
[ember.nvim#4](https://github.com/NullVoxPopuli/ember.nvim/pull/4)).
