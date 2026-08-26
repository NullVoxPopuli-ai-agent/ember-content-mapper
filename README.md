# ember-content-mapper

Type-check `.gts` and `.gjs` files with native TypeScript 7.

This package is a [TypeScript content mapper](https://github.com/microsoft/typescript-go/pull/4712).

## Requirements

- TypeScript 7.1 nightly or newer (`typescript@next`).
- imports must specify the file extensions

## Install

```sh
pnpm add -D ember-content-mapper @glint/ember-tsc
```

## Use

Add the mapper and Glint's types to `tsconfig.json`:

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
- [`test-packages/`](./test-packages): copies of Glint's test packages, with the known
  differences recorded in [test-packages/README.md](./test-packages/README.md).
- [`test/`](./test): snapshot tests of the transform, tests of the server process, LSP tests
  against the example app (hover, definition, completion, diagnostics, rename), and compiler
  mode tests (declaration emit, `--build` up-to-date checks, option diagnostics).

## Prior art

- [mdx-content-mapper](https://github.com/remcohaszing/mdx-content-mapper), which this package
  follows.
- [Vue's content mapper](https://github.com/vuejs/language-tools/issues/6170).

## License

[MIT](LICENSE.md)
