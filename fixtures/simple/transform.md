## Text

```ts
import Component from '@glimmer/component';

export interface GreetingSignature {
  Args: { name: string };
}

export default class Greeting extends Component<GreetingSignature> {
  get loud(): string {
    return this.args.name.toUpperCase();
  }

  static { ({} as typeof import("@glint/ember-tsc/-private/dsl")).templateForBackingValue(this, function(__glintRef__, __glintDSL__: typeof import("@glint/ember-tsc/-private/dsl")) {
{
__glintDSL__.noop(__glintDSL__.elementTypes.p);
__glintDSL__.noop(__glintDSL__.elementTypes["p"]);
const __glintY__ = __glintDSL__.emitElement("p");
__glintDSL__.emitContent(__glintDSL__.resolveOrReturn(__glintRef__.this.loud)());
}
__glintRef__; __glintDSL__;
}) }
}

```

## Mappings

- verbatim [0, 251) -> [0, 251) features=all "import Component from '@glimmer/component';\n\nexport interface GreetingSignatu…
- atom [251, 281) -> [251, 251) features=0 "static { ({} as typeof import(" <- ""
- atom [281, 312) -> [261, 261) features=727039 "\"@glint/ember-tsc/-private/dsl\"" <- ""
- atom [312, 432) -> [251, 251) features=0 ")).templateForBackingValue(this, function(__glintRef__, __glintDSL__: typeof im… <- ""
- atom [432, 478) -> [266, 266) features=0 "{\n__glintDSL__.noop(__glintDSL__.elementTypes." <- ""
- verbatim [478, 479) -> [267, 268) features=529411 "p"
- atom [479, 527) -> [266, 266) features=0 ");\n__glintDSL__.noop(__glintDSL__.elementTypes[\"" <- ""
- verbatim [527, 528) -> [267, 268) features=66552 "p"
- atom [528, 583) -> [266, 266) features=0 "\"]);\nconst __glintY__ = __glintDSL__.emitElement(\"p\");\n" <- ""
- atom [583, 608) -> [276, 276) features=0 "__glintDSL__.emitContent(" <- ""
- atom [608, 637) -> [278, 278) features=0 "__glintDSL__.resolveOrReturn(" <- ""
- atom [637, 650) -> [278, 278) features=0 "__glintRef__." <- ""
- verbatim [650, 654) -> [278, 282) features=727039 "this"
- atom [654, 655) -> [278, 278) features=0 "." <- ""
- verbatim [655, 659) -> [283, 287) features=727039 "loud"
- atom [659, 660) -> [278, 278) features=0 ")" <- ""
- atom [660, 662) -> [276, 276) features=0 "()" <- ""
- atom [662, 663) -> [276, 276) features=0 ")" <- ""
- atom [663, 665) -> [266, 266) features=0 ";\n" <- ""
- atom [665, 667) -> [266, 266) features=0 "}\n" <- ""
- atom [667, 699) -> [251, 251) features=0 "__glintRef__; __glintDSL__;\n}) }" <- ""
- verbatim [699, 702) -> [308, 311) features=all "\n}\n"

## Diagnostic directives

- ignore [267, 268) "p" over [478, 479) "p"
- ignore [267, 268) "p" over [527, 528) "p"

## Diagnostics

