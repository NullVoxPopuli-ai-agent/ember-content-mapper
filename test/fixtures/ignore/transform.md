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
- atom [352, 377) -> [94, 94) features=0 "__glintDSL__.emitContent(" <- ""
- atom [377, 406) -> [96, 103) features=0 "__glintDSL__.resolveOrReturn(" <- "unknown"
- verbatim [406, 413) -> [96, 103) features=727039 "unknown"
- atom [413, 414) -> [96, 103) features=0 ")" <- "unknown"
- atom [414, 416) -> [94, 94) features=0 "()" <- ""
- atom [416, 417) -> [94, 94) features=0 ")" <- ""
- atom [417, 419) -> [32, 32) features=0 ";\n" <- ""
- atom [419, 511) -> [22, 22) features=0 "__glintRef__; __glintDSL__;\n// begin directive placeholders\n// end directive … <- ""
- verbatim [511, 512) -> [117, 118) features=all "\n"

## Diagnostic directives

- ignore [94, 105) "{{unknown}}" over [352, 417) "__glintDSL__.emitContent(__glintDSL__.resolveOrReturn(unknown)())"

## Diagnostics

