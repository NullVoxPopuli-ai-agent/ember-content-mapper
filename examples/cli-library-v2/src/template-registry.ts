// Easily allow apps, which are not yet using strict mode templates, to consume your Glint types, by importing this file.
// Add all your components, helpers and modifiers to the template registry here, so apps don't have to do this.
// See https://typed-ember.gitbook.io/glint/environments/ember/authoring-addons

import type Avatar from './components/avatar.gjs';
import type Counter from './components/counter.gts';
import type Greeting from './components/greeting.gts';

export default interface Registry {
  Avatar: typeof Avatar;
  Counter: typeof Counter;
  Greeting: typeof Greeting;
}
