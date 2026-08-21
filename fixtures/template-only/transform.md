## Text

```ts
const name = 'world';

export default ({} as typeof import("@glint/ember-tsc/-private/dsl")).templateExpression((__glintRef__, __glintDSL__: typeof import("@glint/ember-tsc/-private/dsl")) => {
{
__glintDSL__.noop(__glintDSL__.elementTypes.h1);
__glintDSL__.noop(__glintDSL__.elementTypes["h1"]);
const __glintY__ = __glintDSL__.emitElement("h1");
__glintDSL__.emitContent(__glintDSL__.resolveOrReturn(name)());
}
__glintRef__; __glintDSL__;
})

```

## Mappings

- verbatim [0, 23) -> [0, 23) features=all "const name = 'world';\n\n"
- atom [23, 59) -> [23, 23) features=0 "export default ({} as typeof import(" <- ""
- atom [59, 90) -> [33, 33) features=727039 "\"@glint/ember-tsc/-private/dsl\"" <- ""
- atom [90, 194) -> [23, 23) features=0 ")).templateExpression((__glintRef__, __glintDSL__: typeof import(\"@glint/ember… <- ""
- atom [194, 240) -> [36, 36) features=0 "{\n__glintDSL__.noop(__glintDSL__.elementTypes." <- ""
- verbatim [240, 242) -> [37, 39) features=529411 "h1"
- atom [242, 290) -> [36, 36) features=0 ");\n__glintDSL__.noop(__glintDSL__.elementTypes[\"" <- ""
- verbatim [290, 292) -> [37, 39) features=66552 "h1"
- atom [292, 348) -> [36, 36) features=0 "\"]);\nconst __glintY__ = __glintDSL__.emitElement(\"h1\");\n" <- ""
- atom [348, 373) -> [47, 47) features=0 "__glintDSL__.emitContent(" <- ""
- atom [373, 402) -> [49, 53) features=0 "__glintDSL__.resolveOrReturn(" <- "name"
- verbatim [402, 406) -> [49, 53) features=727039 "name"
- atom [406, 407) -> [49, 53) features=0 ")" <- "name"
- atom [407, 409) -> [47, 47) features=0 "()" <- ""
- atom [409, 410) -> [47, 47) features=0 ")" <- ""
- atom [410, 412) -> [36, 36) features=0 ";\n" <- ""
- atom [412, 414) -> [36, 36) features=0 "}\n" <- ""
- atom [414, 444) -> [23, 23) features=0 "__glintRef__; __glintDSL__;\n})" <- ""
- verbatim [444, 445) -> [73, 74) features=all "\n"

## Diagnostic directives

- ignore [37, 39) "h1" over [240, 242) "h1"
- ignore [37, 39) "h1" over [290, 292) "h1"

## Diagnostics

