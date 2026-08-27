import Component from '@ember/component';
import Evented from '@ember/object/evented';

/**
 * @typedef Signature
 * @property {object} Args
 * @property {string} Args.channelName
 */

/** @extends {Component<Signature>} */
export default class ClassicMixin extends Component.extend(Evented) {
  tagName = '';

  <template>{{this.args.channelName}}</template>
}

/** @augments {Component<{ Args: { count: number } }>} */
export class Nested extends Component.extend({}) {}

/** @extends {Component<Signature>} */
export class Plain extends Component {}
