# ember-library-v2

An Embroider v2 addon (library), from the default blueprint, that builds and type-checks with
TypeScript 7 and [ember-content-mapper](../../README.md). The example focuses on build inputs
and outputs: `src/` holds `.gts`, `.gjs`, and `.ts` modules, and the build emits browser-ready
JS plus type declarations.

## Build

```sh
pnpm build
```

- rollup compiles `src/` to `dist/`.
- `tsc --runExternalCode` emits declarations into `declarations/` through the content mapper.
  A `.gts` module emits `counter.d.gts.ts`, and the `.gts`/`.gjs` import specifiers in the
  other declaration files stay as written -- TypeScript 7 consumers resolve them through the
  same mapper (`./components/counter.gts` -> `counter.d.gts.ts`).

`addon.declarations()` is not used in `rollup.config.mjs`: it strips `.gts` extensions from
import specifiers in the emitted declarations (a workaround for the `ember-tsc` pipeline, see
[typed-ember/glint#628](https://github.com/typed-ember/glint/issues/628)), which would make
them unresolvable here.

Note: `package.json#exports` maps `./*` types to `./declarations/*.d.ts`, which the `.gts` and
`.gjs` modules do not emit. Import components from the package root (`index.ts` re-exports
them); the per-module subpaths still work at runtime.

## Type checking

```sh
pnpm lint:types
```

Runs `tsc --noEmit --runExternalCode` with the `contentMappers` entry in `tsconfig.json`.

## License

This project is licensed under the [MIT License](LICENSE.md).
