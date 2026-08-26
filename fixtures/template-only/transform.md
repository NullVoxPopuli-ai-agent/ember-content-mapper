## Text

```ts
/// <reference types="ember-source/types" />
/// <reference types="@glint/ember-tsc/types" />
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

- verbatim [94, 117) -> [0, 23) features=all "const name = 'world';\n\n"
- atom [117, 153) -> [23, 23) features=0 "export default ({} as typeof import(" <- ""
- atom [153, 184) -> [33, 33) features=727039 "\"@glint/ember-tsc/-private/dsl\"" <- ""
- atom [184, 288) -> [23, 23) features=0 ")).templateExpression((__glintRef__, __glintDSL__: typeof import(\"@glint/ember… <- ""
- atom [288, 334) -> [36, 36) features=0 "{\n__glintDSL__.noop(__glintDSL__.elementTypes." <- ""
- verbatim [334, 336) -> [37, 39) features=529411 "h1"
- atom [336, 384) -> [36, 36) features=0 ");\n__glintDSL__.noop(__glintDSL__.elementTypes[\"" <- ""
- verbatim [384, 386) -> [37, 39) features=66552 "h1"
- atom [386, 397) -> [36, 36) features=0 "\"]);\nconst " <- ""
- atom [407, 442) -> [36, 36) features=0 " = __glintDSL__.emitElement(\"h1\");\n" <- ""
- atom [442, 467) -> [47, 47) features=0 "__glintDSL__.emitContent(" <- ""
- atom [467, 496) -> [49, 53) features=0 "__glintDSL__.resolveOrReturn(" <- "name"
- verbatim [496, 500) -> [49, 53) features=727039 "name"
- atom [500, 501) -> [49, 53) features=0 ")" <- "name"
- atom [501, 503) -> [47, 47) features=0 "()" <- ""
- atom [503, 504) -> [47, 47) features=0 ")" <- ""
- atom [504, 506) -> [36, 36) features=0 ";\n" <- ""
- atom [506, 508) -> [36, 36) features=0 "}\n" <- ""
- atom [508, 538) -> [23, 23) features=0 "__glintRef__; __glintDSL__;\n})" <- ""
- verbatim [538, 539) -> [73, 74) features=all "\n"

## Diagnostic directives

- ignore [37, 39) "h1" over [334, 336) "h1"
- ignore [37, 39) "h1" over [384, 386) "h1"

## Diagnostics

