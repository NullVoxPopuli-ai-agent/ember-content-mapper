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

## Type-check from the CLI

```sh
pnpm install
pnpm --filter nvp-app lint:types
pnpm --filter cli-app lint:types
```

Add a type error inside a `<template>` tag in `app/templates/application.gts` to see it reported at
the template position. Set `TS_CONTENT_MAPPER_DEBUG=1` to log the JSON-RPC traffic.

## Debug in VS Code

1. Install the [TypeScript (Native Preview)](https://marketplace.visualstudio.com/items?itemName=TypeScriptTeam.native-preview)
   extension and enable `"typescript.experimental.useTsgo": true`.
2. Trust the workspace. `tsc --lsp` only receives `--runExternalCode` in trusted workspaces;
   otherwise `contentMappers` is ignored.
3. Open a `.ts` file first so the server starts and discovers the app's `tsconfig.json`. Language
   server activation for `.gts` files without an open TypeScript file requires a VS Code extension
   that registers the mapper's extensions with the TypeScript extension, which does not exist yet.
4. Set the TypeScript log level to Trace to see the mapper's JSON-RPC traffic and stderr in the
   "TypeScript 7" output channel.
