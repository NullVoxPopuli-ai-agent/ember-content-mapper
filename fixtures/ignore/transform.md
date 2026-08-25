## Text

```ts
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

- verbatim [0, 22) -> [0, 22) features=all "const known = 'yes';\n\n"
- atom [22, 58) -> [22, 22) features=0 "export default ({} as typeof import(" <- ""
- atom [58, 89) -> [32, 32) features=727039 "\"@glint/ember-tsc/-private/dsl\"" <- ""
- atom [89, 193) -> [22, 22) features=0 ")).templateExpression((__glintRef__, __glintDSL__: typeof import(\"@glint/ember… <- ""
- atom [193, 218) -> [35, 35) features=0 "__glintDSL__.emitContent(" <- ""
- atom [218, 247) -> [37, 42) features=0 "__glintDSL__.resolveOrReturn(" <- "known"
- verbatim [247, 252) -> [37, 42) features=727039 "known"
- atom [252, 253) -> [37, 42) features=0 ")" <- "known"
- atom [253, 255) -> [35, 35) features=0 "()" <- ""
- atom [255, 256) -> [35, 35) features=0 ")" <- ""
- atom [256, 258) -> [32, 32) features=0 ";\n" <- ""
- atom [258, 283) -> [94, 94) features=0 "__glintDSL__.emitContent(" <- ""
- atom [283, 312) -> [96, 103) features=0 "__glintDSL__.resolveOrReturn(" <- "unknown"
- verbatim [312, 319) -> [96, 103) features=727039 "unknown"
- atom [319, 320) -> [96, 103) features=0 ")" <- "unknown"
- atom [320, 322) -> [94, 94) features=0 "()" <- ""
- atom [322, 323) -> [94, 94) features=0 ")" <- ""
- atom [323, 325) -> [32, 32) features=0 ";\n" <- ""
- atom [325, 417) -> [22, 22) features=0 "__glintRef__; __glintDSL__;\n// begin directive placeholders\n// end directive … <- ""
- verbatim [417, 418) -> [117, 118) features=all "\n"

## Diagnostic directives

- ignore [94, 105) "{{unknown}}" over [258, 323) "__glintDSL__.emitContent(__glintDSL__.resolveOrReturn(unknown)())"

## Diagnostics

