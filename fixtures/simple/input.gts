import Component from '@glimmer/component';

export interface GreetingSignature {
  Args: { name: string };
}

export default class Greeting extends Component<GreetingSignature> {
  get loud(): string {
    return this.args.name.toUpperCase();
  }

  <template>
    <p>Hello, {{this.loud}}!</p>
  </template>
}
