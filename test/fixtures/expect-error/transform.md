## Text

```ts
/// <reference types="ember-source/types" />
/// <reference types="@glint/ember-tsc/types" />
const known = 'yes';

export default ({} as typeof import("@glint/ember-tsc/-private/dsl")).templateExpression((__glintRef__, __glintDSL__: typeof import("@glint/ember-tsc/-private/dsl")) => {
__glintDSL__.emitContent(__glintDSL__.resolveOrReturn(known)());
__glintDSL__.emitContent(__glintDSL__.resolveOrReturn(unknown)());
__glintRef__; __glintDSL__;
// begin directive placeholders
// @ts-expect-error expect-error
;
// end directive placeholders
})

```

## Mappings

- verbatim [94, 116) -> [0, 22) features=all "const known = 'yes';\n\n"
- atom [116, 152) -> [22, 22) features=0 "export default ({} as typeof import(" <- ""
- atom [152, 183) -> [32, 32) features=727039 "\"@glint/ember-tsc/-private/dsl\"" <- ""
- atom [183, 287) -> [22, 22) features=0 ")).templateExpression((__glintRef__, __glintDSL__: typeof import(\"@glint/ember… <- ""
- atom [287, 312) -> [35, 35) features=0 "__glintDSL__.emitContent(" <- ""
- atom [312, 341) -> [37, 42) features=0 "__glintDSL__.resolveOrReturn(" <- "known"
- verbatim [341, 346) -> [37, 42) features=727039 "known"
- atom [346, 347) -> [37, 42) features=0 ")" <- "known"
- atom [347, 349) -> [35, 35) features=0 "()" <- ""
- atom [349, 350) -> [35, 35) features=0 ")" <- ""
- atom [350, 352) -> [32, 32) features=0 ";\n" <- ""
- atom [352, 377) -> [100, 100) features=0 "__glintDSL__.emitContent(" <- ""
- atom [377, 406) -> [102, 109) features=0 "__glintDSL__.resolveOrReturn(" <- "unknown"
- verbatim [406, 413) -> [102, 109) features=727039 "unknown"
- atom [413, 414) -> [102, 109) features=0 ")" <- "unknown"
- atom [414, 416) -> [100, 100) features=0 "()" <- ""
- atom [416, 417) -> [100, 100) features=0 ")" <- ""
- atom [417, 419) -> [32, 32) features=0 ";\n" <- ""
- atom [419, 479) -> [22, 22) features=0 "__glintRef__; __glintDSL__;\n// begin directive placeholders\n" <- ""
- atom [511, 546) -> [22, 22) features=0 "\n;\n// end directive placeholders\n})" <- ""
- verbatim [546, 547) -> [123, 124) features=all "\n"

## Diagnostic directives

- expect [47, 97) "{{! @glint-expect-error: unknown is not defined }}" over [352, 417) "__glintDSL__.emitContent(__glintDSL__.resolveOrReturn(unknown)())"
- ignore [47, 97) "{{! @glint-expect-error: unknown is not defined }}" over [479, 511) "// @ts-expect-error expect-error"

## Diagnostics

