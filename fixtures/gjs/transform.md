## Text

```js
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

- verbatim [0, 28) -> [0, 28) features=all "const numbers = [1, 2, 3];\n\n"
- atom [28, 69) -> [28, 28) features=0 "export default (/** @type {typeof import(" <- ""
- atom [69, 100) -> [38, 38) features=727039 "\"@glint/ember-tsc/-private/dsl\"" <- ""
- atom [100, 227) -> [28, 28) features=0 ")} */ ({})).templateExpression((__glintRef__, /** @type {typeof import(\"@glint… <- ""
- atom [227, 235) -> [41, 41) features=0 "{\nconst " <- ""
- atom [245, 275) -> [41, 41) features=0 " = __glintDSL__.emitComponent(" <- ""
- atom [275, 296) -> [44, 48) features=0 "__glintDSL__.resolve(" <- "each"
- atom [296, 317) -> [44, 48) features=0 "__glintDSL__.Globals." <- "each"
- verbatim [317, 321) -> [44, 48) features=727039 "each"
- atom [321, 322) -> [44, 48) features=0 ")" <- "each"
- atom [322, 323) -> [41, 41) features=0 "(" <- ""
- verbatim [323, 330) -> [49, 56) features=727039 "numbers"
- atom [330, 331) -> [41, 41) features=0 ")" <- ""
- atom [331, 343) -> [41, 41) features=0 ");\n{\nconst [" <- ""
- verbatim [343, 348) -> [61, 66) features=727039 "value"
- atom [348, 387) -> [41, 41) features=0 "] = __glintY__.blockParams[\"default\"];\n" <- ""
- atom [387, 433) -> [74, 74) features=0 "{\n__glintDSL__.noop(__glintDSL__.elementTypes." <- ""
- verbatim [433, 437) -> [75, 79) features=529411 "span"
- atom [437, 485) -> [74, 74) features=0 ");\n__glintDSL__.noop(__glintDSL__.elementTypes[\"" <- ""
- verbatim [485, 489) -> [75, 79) features=66552 "span"
- atom [489, 500) -> [74, 74) features=0 "\"]);\nconst " <- ""
- atom [510, 547) -> [74, 74) features=0 " = __glintDSL__.emitElement(\"span\");\n" <- ""
- atom [547, 572) -> [80, 80) features=0 "__glintDSL__.emitContent(" <- ""
- atom [572, 601) -> [82, 87) features=0 "__glintDSL__.resolveOrReturn(" <- "value"
- verbatim [601, 606) -> [82, 87) features=727039 "value"
- atom [606, 607) -> [82, 87) features=0 ")" <- "value"
- atom [607, 609) -> [80, 80) features=0 "()" <- ""
- atom [609, 610) -> [80, 80) features=0 ")" <- ""
- atom [610, 614) -> [74, 74) features=0 ";\n}\n" <- ""
- atom [614, 637) -> [41, 41) features=0 "}\n__glintDSL__.Globals." <- ""
- verbatim [637, 641) -> [102, 106) features=727039 "each"
- atom [641, 644) -> [41, 41) features=0 ";\n}" <- ""
- atom [644, 645) -> [38, 38) features=0 "\n" <- ""
- atom [645, 675) -> [28, 28) features=0 "__glintRef__; __glintDSL__;\n})" <- ""
- verbatim [675, 676) -> [120, 121) features=all "\n"

## Diagnostic directives

- ignore [75, 79) "span" over [433, 437) "span"
- ignore [75, 79) "span" over [485, 489) "span"

## Diagnostics

