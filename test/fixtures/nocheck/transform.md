## Text

```ts
/// <reference types="ember-source/types" />
/// <reference types="@glint/ember-tsc/types" />
export default ({} as typeof import("@glint/ember-tsc/-private/dsl")).templateExpression((__glintRef__, __glintDSL__: typeof import("@glint/ember-tsc/-private/dsl")) => {
__glintDSL__.emitContent(__glintDSL__.resolveOrReturn(unknownOne)());
__glintDSL__.emitContent(__glintDSL__.resolveOrReturn(unknownTwo)());
__glintRef__; __glintDSL__;
// begin directive placeholders
// end directive placeholders
})

```

## Mappings

- atom [94, 130) -> [0, 0) features=0 "export default ({} as typeof import(" <- ""
- atom [130, 161) -> [10, 10) features=727039 "\"@glint/ember-tsc/-private/dsl\"" <- ""
- atom [161, 265) -> [0, 0) features=0 ")).templateExpression((__glintRef__, __glintDSL__: typeof import(\"@glint/ember… <- ""
- atom [265, 290) -> [55, 55) features=0 "__glintDSL__.emitContent(" <- ""
- atom [290, 319) -> [57, 67) features=0 "__glintDSL__.resolveOrReturn(" <- "unknownOne"
- verbatim [319, 329) -> [57, 67) features=727039 "unknownOne"
- atom [329, 330) -> [57, 67) features=0 ")" <- "unknownOne"
- atom [330, 332) -> [55, 55) features=0 "()" <- ""
- atom [332, 333) -> [55, 55) features=0 ")" <- ""
- atom [333, 335) -> [10, 10) features=0 ";\n" <- ""
- atom [335, 360) -> [72, 72) features=0 "__glintDSL__.emitContent(" <- ""
- atom [360, 389) -> [74, 84) features=0 "__glintDSL__.resolveOrReturn(" <- "unknownTwo"
- verbatim [389, 399) -> [74, 84) features=727039 "unknownTwo"
- atom [399, 400) -> [74, 84) features=0 ")" <- "unknownTwo"
- atom [400, 402) -> [72, 72) features=0 "()" <- ""
- atom [402, 403) -> [72, 72) features=0 ")" <- ""
- atom [403, 405) -> [10, 10) features=0 ";\n" <- ""
- atom [405, 497) -> [0, 0) features=0 "__glintRef__; __glintDSL__;\n// begin directive placeholders\n// end directive … <- ""
- verbatim [497, 498) -> [98, 99) features=all "\n"

## Diagnostic directives

- ignore [10, 87) "\n  {{! @glint-nocheck: not typesafe yet }}\n  {{unknownOne}}\n  {{unknownTwo}}… over [265, 405) "__glintDSL__.emitContent(__glintDSL__.resolveOrReturn(unknownOne)());\n__glintD…

## Diagnostics

