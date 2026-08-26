## Text

```js
/// <reference types="ember-source/types" />
/// <reference types="@glint/ember-tsc/types" />
const numbers = [1, 2, 3];

export default (/** @type {typeof import("@glint/ember-tsc/-private/dsl")} */ ({})).templateExpression((__glintRef__, /** @type {typeof import("@glint/ember-tsc/-private/dsl")} */ __glintDSL__) => {
{
const __glintY__ = __glintDSL__.emitComponent(__glintDSL__.resolve(__glintDSL__.Globals.each)(numbers));
{
const [value] = __glintY__.blockParams["default"];
{
__glintDSL__.noop(__glintDSL__.elementTypes.span);
__glintDSL__.noop(__glintDSL__.elementTypes["span"]);
const __glintY__ = __glintDSL__.emitElement("span");
__glintDSL__.emitContent(__glintDSL__.resolveOrReturn(value)());
}
}
__glintDSL__.Globals.each;
}
__glintRef__; __glintDSL__;
})

```

## Mappings

- verbatim [94, 122) -> [0, 28) features=all "const numbers = [1, 2, 3];\n\n"
- atom [122, 163) -> [28, 28) features=0 "export default (/** @type {typeof import(" <- ""
- atom [163, 194) -> [38, 38) features=727039 "\"@glint/ember-tsc/-private/dsl\"" <- ""
- atom [194, 321) -> [28, 28) features=0 ")} */ ({})).templateExpression((__glintRef__, /** @type {typeof import(\"@glint… <- ""
- atom [321, 329) -> [41, 41) features=0 "{\nconst " <- ""
- atom [339, 369) -> [41, 41) features=0 " = __glintDSL__.emitComponent(" <- ""
- atom [369, 390) -> [44, 48) features=0 "__glintDSL__.resolve(" <- "each"
- atom [390, 411) -> [44, 48) features=0 "__glintDSL__.Globals." <- "each"
- verbatim [411, 415) -> [44, 48) features=727039 "each"
- atom [415, 416) -> [44, 48) features=0 ")" <- "each"
- atom [416, 417) -> [41, 41) features=0 "(" <- ""
- verbatim [417, 424) -> [49, 56) features=727039 "numbers"
- atom [424, 425) -> [41, 41) features=0 ")" <- ""
- atom [425, 437) -> [41, 41) features=0 ");\n{\nconst [" <- ""
- verbatim [437, 442) -> [61, 66) features=727039 "value"
- atom [442, 481) -> [41, 41) features=0 "] = __glintY__.blockParams[\"default\"];\n" <- ""
- atom [481, 527) -> [74, 74) features=0 "{\n__glintDSL__.noop(__glintDSL__.elementTypes." <- ""
- verbatim [527, 531) -> [75, 79) features=529411 "span"
- atom [531, 579) -> [74, 74) features=0 ");\n__glintDSL__.noop(__glintDSL__.elementTypes[\"" <- ""
- verbatim [579, 583) -> [75, 79) features=66552 "span"
- atom [583, 594) -> [74, 74) features=0 "\"]);\nconst " <- ""
- atom [604, 641) -> [74, 74) features=0 " = __glintDSL__.emitElement(\"span\");\n" <- ""
- atom [641, 666) -> [80, 80) features=0 "__glintDSL__.emitContent(" <- ""
- atom [666, 695) -> [82, 87) features=0 "__glintDSL__.resolveOrReturn(" <- "value"
- verbatim [695, 700) -> [82, 87) features=727039 "value"
- atom [700, 701) -> [82, 87) features=0 ")" <- "value"
- atom [701, 703) -> [80, 80) features=0 "()" <- ""
- atom [703, 704) -> [80, 80) features=0 ")" <- ""
- atom [704, 708) -> [74, 74) features=0 ";\n}\n" <- ""
- atom [708, 731) -> [41, 41) features=0 "}\n__glintDSL__.Globals." <- ""
- verbatim [731, 735) -> [102, 106) features=727039 "each"
- atom [735, 738) -> [41, 41) features=0 ";\n}" <- ""
- atom [738, 739) -> [38, 38) features=0 "\n" <- ""
- atom [739, 769) -> [28, 28) features=0 "__glintRef__; __glintDSL__;\n})" <- ""
- verbatim [769, 770) -> [120, 121) features=all "\n"

## Diagnostic directives

- ignore [75, 79) "span" over [527, 531) "span"
- ignore [75, 79) "span" over [579, 583) "span"

## Diagnostics

