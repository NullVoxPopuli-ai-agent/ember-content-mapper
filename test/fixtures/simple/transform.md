## Text

```ts
/// <reference types="ember-source/types" />
/// <reference types="@glint/ember-tsc/types" />
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

- verbatim [94, 345) -> [0, 251) features=all "import Component from '@glimmer/component';\n\nexport interface GreetingSignatu…
- atom [345, 375) -> [251, 251) features=0 "static { ({} as typeof import(" <- ""
- atom [375, 406) -> [261, 261) features=727039 "\"@glint/ember-tsc/-private/dsl\"" <- ""
- atom [406, 526) -> [251, 251) features=0 ")).templateForBackingValue(this, function(__glintRef__, __glintDSL__: typeof im… <- ""
- atom [526, 572) -> [266, 266) features=0 "{\n__glintDSL__.noop(__glintDSL__.elementTypes." <- ""
- verbatim [572, 573) -> [267, 268) features=529411 "p"
- atom [573, 621) -> [266, 266) features=0 ");\n__glintDSL__.noop(__glintDSL__.elementTypes[\"" <- ""
- verbatim [621, 622) -> [267, 268) features=66552 "p"
- atom [622, 633) -> [266, 266) features=0 "\"]);\nconst " <- ""
- atom [643, 677) -> [266, 266) features=0 " = __glintDSL__.emitElement(\"p\");\n" <- ""
- atom [677, 702) -> [276, 276) features=0 "__glintDSL__.emitContent(" <- ""
- atom [702, 731) -> [278, 278) features=0 "__glintDSL__.resolveOrReturn(" <- ""
- atom [731, 744) -> [278, 278) features=0 "__glintRef__." <- ""
- verbatim [744, 748) -> [278, 282) features=727039 "this"
- atom [748, 749) -> [278, 278) features=0 "." <- ""
- verbatim [749, 753) -> [283, 287) features=727039 "loud"
- atom [753, 754) -> [278, 278) features=0 ")" <- ""
- atom [754, 756) -> [276, 276) features=0 "()" <- ""
- atom [756, 757) -> [276, 276) features=0 ")" <- ""
- atom [757, 759) -> [266, 266) features=0 ";\n" <- ""
- atom [759, 761) -> [266, 266) features=0 "}\n" <- ""
- atom [761, 793) -> [251, 251) features=0 "__glintRef__; __glintDSL__;\n}) }" <- ""
- verbatim [793, 796) -> [308, 311) features=all "\n}\n"

## Diagnostic directives

- ignore [267, 268) "p" over [572, 573) "p"
- ignore [267, 268) "p" over [621, 622) "p"

## Diagnostics

