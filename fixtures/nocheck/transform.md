## Text

```ts
export default ({} as typeof import("@glint/ember-tsc/-private/dsl")).templateExpression((__glintRef__, __glintDSL__: typeof import("@glint/ember-tsc/-private/dsl")) => {
__glintDSL__.emitContent(__glintDSL__.resolveOrReturn(unknownOne)());
__glintDSL__.emitContent(__glintDSL__.resolveOrReturn(unknownTwo)());
__glintRef__; __glintDSL__;
// begin directive placeholders
// end directive placeholders
})

```

## Mappings

- atom [0, 36) -> [0, 0) features=0 "export default ({} as typeof import(" <- ""
- atom [36, 67) -> [10, 10) features=727039 "\"@glint/ember-tsc/-private/dsl\"" <- ""
- atom [67, 171) -> [0, 0) features=0 ")).templateExpression((__glintRef__, __glintDSL__: typeof import(\"@glint/ember… <- ""
- atom [171, 196) -> [55, 55) features=0 "__glintDSL__.emitContent(" <- ""
- atom [196, 225) -> [57, 67) features=0 "__glintDSL__.resolveOrReturn(" <- "unknownOne"
- verbatim [225, 235) -> [57, 67) features=727039 "unknownOne"
- atom [235, 236) -> [57, 67) features=0 ")" <- "unknownOne"
- atom [236, 238) -> [55, 55) features=0 "()" <- ""
- atom [238, 239) -> [55, 55) features=0 ")" <- ""
- atom [239, 241) -> [10, 10) features=0 ";\n" <- ""
- atom [241, 266) -> [72, 72) features=0 "__glintDSL__.emitContent(" <- ""
- atom [266, 295) -> [74, 84) features=0 "__glintDSL__.resolveOrReturn(" <- "unknownTwo"
- verbatim [295, 305) -> [74, 84) features=727039 "unknownTwo"
- atom [305, 306) -> [74, 84) features=0 ")" <- "unknownTwo"
- atom [306, 308) -> [72, 72) features=0 "()" <- ""
- atom [308, 309) -> [72, 72) features=0 ")" <- ""
- atom [309, 311) -> [10, 10) features=0 ";\n" <- ""
- atom [311, 403) -> [0, 0) features=0 "__glintRef__; __glintDSL__;\n// begin directive placeholders\n// end directive … <- ""
- verbatim [403, 404) -> [98, 99) features=all "\n"

## Diagnostic directives

- ignore [10, 87) "\n  {{! @glint-nocheck: not typesafe yet }}\n  {{unknownOne}}\n  {{unknownTwo}}… over [171, 311) "__glintDSL__.emitContent(__glintDSL__.resolveOrReturn(unknownOne)());\n__glintD…

## Diagnostics

