## Text

```js
/// <reference types="ember-source/types" />
/// <reference types="@glint/ember-tsc/types" />
import Component from '@ember/component';
import Evented from '@ember/object/evented';

/**
 * @typedef Signature
 * @property {object} Args
 * @property {string} Args.channelName
 */

/** @extends {Component<Signature>} */
export default class ClassicMixin extends /** @type {new (...args: any[]) => Component<Signature>} */ (Component.extend(Evented)) {
  tagName = '';

  static { (/** @type {typeof import("@glint/ember-tsc/-private/dsl")} */ ({})).templateForBackingValue(this, function(__glintRef__, /** @type {typeof import("@glint/ember-tsc/-private/dsl")} */ __glintDSL__) {
__glintDSL__.emitContent(__glintDSL__.resolveOrReturn(__glintRef__.this.args?.channelName)());
__glintRef__; __glintDSL__;
}) }
}

/** @augments {Component<{ Args: { count: number } }>} */
export class Nested extends /** @type {new (...args: any[]) => Component<{ Args: { count: number } }>} */ (Component.extend({})) {}

/** @extends {Component<Signature>} */
export class Plain extends Component {}

```

## Mappings

- verbatim [94, 360) -> [0, 266) features=all "import Component from '@ember/component';\nimport Evented from '@ember/object/e…
- verbatim [421, 446) -> [266, 291) features=all "Component.extend(Evented)"
- verbatim [447, 469) -> [291, 313) features=all " {\n  tagName = '';\n\n  "
- atom [469, 504) -> [313, 313) features=0 "static { (/** @type {typeof import(" <- ""
- atom [504, 535) -> [323, 323) features=727039 "\"@glint/ember-tsc/-private/dsl\"" <- ""
- atom [535, 678) -> [313, 313) features=0 ")} */ ({})).templateForBackingValue(this, function(__glintRef__, /** @type {typ… <- ""
- atom [678, 703) -> [323, 323) features=0 "__glintDSL__.emitContent(" <- ""
- atom [703, 732) -> [325, 325) features=0 "__glintDSL__.resolveOrReturn(" <- ""
- atom [732, 745) -> [325, 325) features=0 "__glintRef__." <- ""
- verbatim [745, 749) -> [325, 329) features=727039 "this"
- atom [749, 750) -> [325, 325) features=0 "." <- ""
- verbatim [750, 754) -> [330, 334) features=727039 "args"
- atom [754, 756) -> [325, 325) features=0 "?." <- ""
- verbatim [756, 767) -> [335, 346) features=727039 "channelName"
- atom [767, 768) -> [325, 325) features=0 ")" <- ""
- atom [768, 770) -> [323, 323) features=0 "()" <- ""
- atom [770, 771) -> [323, 323) features=0 ")" <- ""
- atom [771, 773) -> [323, 323) features=0 ";\n" <- ""
- atom [773, 805) -> [313, 313) features=0 "__glintRef__; __glintDSL__;\n}) }" <- ""
- verbatim [805, 895) -> [359, 449) features=all "\n}\n\n/** @augments {Component<{ Args: { count: number } }>} */\nexport class …
- verbatim [974, 994) -> [449, 469) features=all "Component.extend({})"
- verbatim [995, 1079) -> [469, 553) features=all " {}\n\n/** @extends {Component<Signature>} */\nexport class Plain extends Compo…

## Diagnostic directives


## Diagnostics

