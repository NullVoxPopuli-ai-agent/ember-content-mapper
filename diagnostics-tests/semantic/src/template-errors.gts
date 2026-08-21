import Component from '@glimmer/component';

export default class Broken extends Component<{ Args: { count: number } }> {
  <template>
    <p>{{this.missingProperty}}</p>
    <p>{{fooBarNotDefined}}</p>
    {{! @glint-expect-error: intentionally missing }}
    <p>{{this.alsoMissing}}</p>
  </template>
}
