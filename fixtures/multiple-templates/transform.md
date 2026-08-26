## Text

```ts
/// <reference types="ember-source/types" />
/// <reference types="@glint/ember-tsc/types" />
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

- verbatim [94, 209) -> [0, 115) features=all "import type { TOC } from '@ember/component/template-only';\n\nexport const Firs…
- atom [209, 230) -> [115, 115) features=0 "({} as typeof import(" <- ""
- atom [230, 261) -> [125, 125) features=727039 "\"@glint/ember-tsc/-private/dsl\"" <- ""
- atom [261, 365) -> [115, 115) features=0 ")).templateExpression((__glintRef__, __glintDSL__: typeof import(\"@glint/ember… <- ""
- atom [365, 411) -> [128, 128) features=0 "{\n__glintDSL__.noop(__glintDSL__.elementTypes." <- ""
- verbatim [411, 412) -> [129, 130) features=529411 "b"
- atom [412, 460) -> [128, 128) features=0 ");\n__glintDSL__.noop(__glintDSL__.elementTypes[\"" <- ""
- verbatim [460, 461) -> [129, 130) features=66552 "b"
- atom [461, 472) -> [128, 128) features=0 "\"]);\nconst " <- ""
- atom [482, 516) -> [128, 128) features=0 " = __glintDSL__.emitElement(\"b\");\n" <- ""
- atom [516, 541) -> [131, 131) features=0 "__glintDSL__.emitContent(" <- ""
- atom [541, 570) -> [133, 133) features=0 "__glintDSL__.resolveOrReturn(" <- ""
- atom [570, 588) -> [133, 133) features=0 "__glintRef__.args." <- ""
- verbatim [588, 593) -> [134, 139) features=727039 "value"
- atom [593, 594) -> [133, 133) features=0 ")" <- ""
- atom [594, 596) -> [131, 131) features=0 "()" <- ""
- atom [596, 597) -> [131, 131) features=0 ")" <- ""
- atom [597, 601) -> [128, 128) features=0 ";\n}\n" <- ""
- atom [601, 631) -> [115, 115) features=0 "__glintRef__; __glintDSL__;\n})" <- ""
- verbatim [631, 690) -> [157, 216) features=all ";\n\nexport const Second: TOC<{ Args: { count: number } }> = "
- atom [690, 711) -> [216, 216) features=0 "({} as typeof import(" <- ""
- atom [711, 742) -> [226, 226) features=727039 "\"@glint/ember-tsc/-private/dsl\"" <- ""
- atom [742, 846) -> [216, 216) features=0 ")).templateExpression((__glintRef__, __glintDSL__: typeof import(\"@glint/ember… <- ""
- atom [846, 892) -> [229, 229) features=0 "{\n__glintDSL__.noop(__glintDSL__.elementTypes." <- ""
- verbatim [892, 893) -> [230, 231) features=529411 "i"
- atom [893, 941) -> [229, 229) features=0 ");\n__glintDSL__.noop(__glintDSL__.elementTypes[\"" <- ""
- verbatim [941, 942) -> [230, 231) features=66552 "i"
- atom [942, 953) -> [229, 229) features=0 "\"]);\nconst " <- ""
- atom [963, 997) -> [229, 229) features=0 " = __glintDSL__.emitElement(\"i\");\n" <- ""
- atom [997, 1022) -> [232, 232) features=0 "__glintDSL__.emitContent(" <- ""
- atom [1022, 1051) -> [234, 234) features=0 "__glintDSL__.resolveOrReturn(" <- ""
- atom [1051, 1069) -> [234, 234) features=0 "__glintRef__.args." <- ""
- verbatim [1069, 1074) -> [235, 240) features=727039 "count"
- atom [1074, 1075) -> [234, 234) features=0 ")" <- ""
- atom [1075, 1077) -> [232, 232) features=0 "()" <- ""
- atom [1077, 1078) -> [232, 232) features=0 ")" <- ""
- atom [1078, 1082) -> [229, 229) features=0 ";\n}\n" <- ""
- atom [1082, 1112) -> [216, 216) features=0 "__glintRef__; __glintDSL__;\n})" <- ""
- verbatim [1112, 1114) -> [258, 260) features=all ";\n"

## Diagnostic directives

- ignore [129, 130) "b" over [411, 412) "b"
- ignore [129, 130) "b" over [460, 461) "b"
- ignore [230, 231) "i" over [892, 893) "i"
- ignore [230, 231) "i" over [941, 942) "i"

## Diagnostics

