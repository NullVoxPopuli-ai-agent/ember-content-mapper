# ember-content-mapper

A [TypeScript content mapper](https://github.com/microsoft/typescript-go/pull/4712) for Ember's
`.gts` and `.gjs` files.

With this package, native TypeScript 7 (`tsc`) type-checks `<template>` tags directly. You do not
need `ember-tsc`, Volar, or a separate CLI. `tsc --runExternalCode` starts the mapper as a child
process. The mapper transforms each `.gts` and `.gjs` file with
[Glint](https://github.com/typed-ember/glint)'s transform. TypeScript receives the transformed
text and its span mappings. Diagnostics point at the original template source.

## Requirements

- A TypeScript 7.1 nightly (`typescript@next`). Content mapper support shipped on 2026-08-19.
- The `--runExternalCode` flag on each `tsc` command.
- `@glint/ember-tsc`. It contains the template DSL types that the transformed output references.

## Installation

```sh
pnpm add -D ember-content-mapper @glint/ember-tsc
```

## Usage

Register the mapper in `tsconfig.json`. Include Glint's DSL types:

```jsonc
{
  "compilerOptions": {
    "types": ["ember-source/types", "@glint/ember-tsc/types"],
  },
  "contentMappers": [
    {
      "package": "ember-content-mapper",
      "extensions": [".gts", ".gjs"],
    },
  ],
  "include": ["src"],
}
```

Then type-check the project:

```sh
tsc --noEmit --runExternalCode
```

### Options

The `options` object of the `contentMappers` entry accepts the same options as Glint's
`ember-template-imports` environment:

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

The mapper translates Glint's template directives to the native diagnostic directives of the
content mapper protocol:

- `{{! @glint-expect-error }}` suppresses the diagnostics of the next line of template content.
  When it suppresses nothing, TypeScript reports
  `glint2578: Unused '@glint-expect-error' directive.`
- `{{! @glint-ignore }}` suppresses the diagnostics of the next line of template content.
- `{{! @glint-nocheck }}` suppresses the diagnostics of the whole template.

## Example apps

The [`examples/`](./examples) directory contains two full Ember apps. One comes from
`pnpm dlx ember.nvp`. The other comes from `pnpm dlx ember-cli@latest new`. Both use TypeScript 7
and this mapper. [examples/README.md](./examples/README.md) shows how to type-check them and how
to configure VS Code and Neovim.

## Tests

The [`test-packages/`](./test-packages) directory contains direct copies of Glint's own test
packages. Their `@glint-expect-error` and `@ts-expect-error` directives are the assertions.
[test-packages/README.md](./test-packages/README.md) documents the known differences from Glint.

## Debugging

Set `TS_CONTENT_MAPPER_DEBUG=1` to log the JSON-RPC traffic between `tsc` and the mapper.

## Prior art

- [mdx-content-mapper](https://github.com/remcohaszing/mdx-content-mapper). This package follows
  its structure.
- [Vue's content mapper](https://github.com/vuejs/language-tools/issues/6170).

## License

[MIT](LICENSE.md)
