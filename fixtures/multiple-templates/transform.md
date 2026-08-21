## Text

```ts
import type { TOC } from '@ember/component/template-only';

export const First: TOC<{ Args: { value: string } }> = ({} as typeof import("@glint/ember-tsc/-private/dsl")).templateExpression((__glintRef__, __glintDSL__: typeof import("@glint/ember-tsc/-private/dsl")) => {
{
__glintDSL__.noop(__glintDSL__.elementTypes.b);
__glintDSL__.noop(__glintDSL__.elementTypes["b"]);
const __glintY__ = __glintDSL__.emitElement("b");
__glintDSL__.emitContent(__glintDSL__.resolveOrReturn(__glintRef__.args.value)());
}
__glintRef__; __glintDSL__;
});

export const Second: TOC<{ Args: { count: number } }> = ({} as typeof import("@glint/ember-tsc/-private/dsl")).templateExpression((__glintRef__, __glintDSL__: typeof import("@glint/ember-tsc/-private/dsl")) => {
{
__glintDSL__.noop(__glintDSL__.elementTypes.i);
__glintDSL__.noop(__glintDSL__.elementTypes["i"]);
const __glintY__ = __glintDSL__.emitElement("i");
__glintDSL__.emitContent(__glintDSL__.resolveOrReturn(__glintRef__.args.count)());
}
__glintRef__; __glintDSL__;
});

```

## Mappings

- verbatim [0, 115) -> [0, 115) features=all "import type { TOC } from '@ember/component/template-only';\n\nexport const Firs…
- atom [115, 136) -> [115, 115) features=0 "({} as typeof import(" <- ""
- atom [136, 167) -> [125, 125) features=727039 "\"@glint/ember-tsc/-private/dsl\"" <- ""
- atom [167, 271) -> [115, 115) features=0 ")).templateExpression((__glintRef__, __glintDSL__: typeof import(\"@glint/ember… <- ""
- atom [271, 317) -> [128, 128) features=0 "{\n__glintDSL__.noop(__glintDSL__.elementTypes." <- ""
- verbatim [317, 318) -> [129, 130) features=529411 "b"
- atom [318, 366) -> [128, 128) features=0 ");\n__glintDSL__.noop(__glintDSL__.elementTypes[\"" <- ""
- verbatim [366, 367) -> [129, 130) features=66552 "b"
- atom [367, 378) -> [128, 128) features=0 "\"]);\nconst " <- ""
- atom [388, 422) -> [128, 128) features=0 " = __glintDSL__.emitElement(\"b\");\n" <- ""
- atom [422, 447) -> [131, 131) features=0 "__glintDSL__.emitContent(" <- ""
- atom [447, 476) -> [133, 133) features=0 "__glintDSL__.resolveOrReturn(" <- ""
- atom [476, 494) -> [133, 133) features=0 "__glintRef__.args." <- ""
- verbatim [494, 499) -> [134, 139) features=727039 "value"
- atom [499, 500) -> [133, 133) features=0 ")" <- ""
- atom [500, 502) -> [131, 131) features=0 "()" <- ""
- atom [502, 503) -> [131, 131) features=0 ")" <- ""
- atom [503, 507) -> [128, 128) features=0 ";\n}\n" <- ""
- atom [507, 537) -> [115, 115) features=0 "__glintRef__; __glintDSL__;\n})" <- ""
- verbatim [537, 596) -> [157, 216) features=all ";\n\nexport const Second: TOC<{ Args: { count: number } }> = "
- atom [596, 617) -> [216, 216) features=0 "({} as typeof import(" <- ""
- atom [617, 648) -> [226, 226) features=727039 "\"@glint/ember-tsc/-private/dsl\"" <- ""
- atom [648, 752) -> [216, 216) features=0 ")).templateExpression((__glintRef__, __glintDSL__: typeof import(\"@glint/ember… <- ""
- atom [752, 798) -> [229, 229) features=0 "{\n__glintDSL__.noop(__glintDSL__.elementTypes." <- ""
- verbatim [798, 799) -> [230, 231) features=529411 "i"
- atom [799, 847) -> [229, 229) features=0 ");\n__glintDSL__.noop(__glintDSL__.elementTypes[\"" <- ""
- verbatim [847, 848) -> [230, 231) features=66552 "i"
- atom [848, 859) -> [229, 229) features=0 "\"]);\nconst " <- ""
- atom [869, 903) -> [229, 229) features=0 " = __glintDSL__.emitElement(\"i\");\n" <- ""
- atom [903, 928) -> [232, 232) features=0 "__glintDSL__.emitContent(" <- ""
- atom [928, 957) -> [234, 234) features=0 "__glintDSL__.resolveOrReturn(" <- ""
- atom [957, 975) -> [234, 234) features=0 "__glintRef__.args." <- ""
- verbatim [975, 980) -> [235, 240) features=727039 "count"
- atom [980, 981) -> [234, 234) features=0 ")" <- ""
- atom [981, 983) -> [232, 232) features=0 "()" <- ""
- atom [983, 984) -> [232, 232) features=0 ")" <- ""
- atom [984, 988) -> [229, 229) features=0 ";\n}\n" <- ""
- atom [988, 1018) -> [216, 216) features=0 "__glintRef__; __glintDSL__;\n})" <- ""
- verbatim [1018, 1020) -> [258, 260) features=all ";\n"

## Diagnostic directives

- ignore [129, 130) "b" over [317, 318) "b"
- ignore [129, 130) "b" over [366, 367) "b"
- ignore [230, 231) "i" over [798, 799) "i"
- ignore [230, 231) "i" over [847, 848) "i"

## Diagnostics

