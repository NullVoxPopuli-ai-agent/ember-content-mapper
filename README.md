# ember-content-mapper

A [TypeScript content mapper](https://github.com/microsoft/typescript-go/pull/4712) for Ember's
`.gts` and `.gjs` files.

With this package, native TypeScript 7 (`tsc`) can type-check `<template>` tags directly. No
`ember-tsc`, no Volar, no separate CLI: `tsc --runExternalCode` spawns the mapper, which transforms
each `.gts`/`.gjs` file with [Glint](https://github.com/typed-ember/glint)'s transform and hands
TypeScript the transformed text plus span mappings, so diagnostics point at the original template
source.

## Requirements

- A TypeScript 7.1 nightly (`typescript@next`). Content mapper support shipped on 2026-08-19.
- `tsc` must be run with `--runExternalCode`.
- `@glint/ember-tsc` provides the template DSL types the transformed output references.

## Installation

```sh
pnpm add -D ember-content-mapper @glint/ember-tsc
```

## Usage

Register the mapper in `tsconfig.json` and include Glint's DSL types:

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

Then type-check with:

```sh
tsc --noEmit --runExternalCode
```

### Options

The `options` object of the `contentMappers` entry accepts the same environment options as Glint's
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

Glint's template directives are translated to the content mapper protocol's native diagnostic
directives:

- `{{! @glint-expect-error }}` suppresses diagnostics in the next content's transformed output and
  reports `glint2578: Unused '@glint-expect-error' directive.` when it suppressed nothing.
- `{{! @glint-ignore }}` suppresses diagnostics in the next content's transformed output.
- `{{! @glint-nocheck }}` suppresses diagnostics for the whole template.

## Debugging

Set `TS_CONTENT_MAPPER_DEBUG=1` to log the JSON-RPC traffic between `tsc` and the mapper.

## Prior art

- [mdx-content-mapper](https://github.com/remcohaszing/mdx-content-mapper), which this package's
  structure follows.
- [Vue's content mapper](https://github.com/vuejs/language-tools/issues/6170).

## License

[MIT](LICENSE.md)
