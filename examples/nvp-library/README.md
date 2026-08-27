# nvp-library

An Ember v2 library (addon) built with
[`@nullvoxpopuli/ember-rolldown`](https://github.com/NullVoxPopuli/ember.nvp/tree/main/packages/rolldown)
and [tsdown](https://tsdown.dev/), type-checked with TypeScript 7 and
[ember-content-mapper](../../README.md).

## Development

```bash
pnpm install
```

Build the distributable (JS + `.d.ts` into `dist/`):

```bash
pnpm build
```

Rebuild on change while developing:

```bash
pnpm start
```

Type-check `.gts` through the content mapper:

```bash
pnpm lint:types
```

The build tooling (tsdown and `@nullvoxpopuli/ember-rolldown`) needs classic TypeScript's JS
API, which the 7.1 nightly no longer ships. So `typescript` stays on 6.x for the build, the
nightly is aliased as `typescript-7`, and `lint:types` invokes its `tsc` directly.

## Structure

- `src/` — your library source. Author components in `.gts`/`.gjs`
  (template-tag) and plain modules in `.ts`/`.js`.
- `src/index.ts` — the public entry point. Everything a consumer can import
  must be re-exported from here (or added as an entry in `tsdown.config.js`).
- `dist/` — the built output that gets published (git-ignored).

Declarations are emitted with
[isolated declarations](https://www.typescriptlang.org/tsconfig/#isolatedDeclarations),
so every exported value needs an explicit type annotation — in particular,
annotate exported template-only components with `TOC<...>`.

## Publishing

`dist/` is built automatically on `prepack`, so `npm publish` ships the
compiled output plus your `src/`.
