import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";

import { formatCount } from "../utils/format.ts";

export interface CounterSignature {
  Args: {
    initial?: number;
    step?: number;
  };
  Blocks: {
    default: [count: number];
  };
  Element: HTMLDivElement;
}

// Isolated declarations: every exported member is explicitly annotated.
export default class Counter extends Component<CounterSignature> {
  @tracked count: number = this.args.initial ?? 0;

  get step(): number {
    return this.args.step ?? 1;
  }

  increment = (): void => {
    this.count += this.step;
  };

  decrement = (): void => {
    this.count -= this.step;
  };

  <template>
    <div ...attributes>
      <output>{{formatCount this.count}}</output>
      <button type="button" {{on "click" this.increment}}>
        +{{this.step}}
      </button>
      <button type="button" {{on "click" this.decrement}}>
        -{{this.step}}
      </button>
      {{yield this.count}}
    </div>
  </template>
}
