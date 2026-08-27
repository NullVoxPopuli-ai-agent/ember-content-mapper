import Component from '@ember/component';
import Evented from '@ember/object/evented';

/**
 * @typedef ClassicMixinSignature
 * @property {object} Args
 * @property {string} Args.channelName
 */

/** @extends {Component<ClassicMixinSignature>} */
export default class ClassicMixin extends Component.extend(Evented) {
  tagName = '';

  <template>x</template>
}
