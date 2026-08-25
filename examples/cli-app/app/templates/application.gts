import { pageTitle } from 'ember-page-title';
import { WelcomePage } from 'ember-welcome-page';

import { Avatar, Counter, Greeting } from '../components/index.ts';

<template>
  {{pageTitle "CliApp"}}

  <Greeting @name="Ember" class="greeting">
    (type-checked by TypeScript 7)
  </Greeting>

  <Avatar @name="Nully Vox Populi" />

  <Counter @initial={{3}} @step={{2}} as |count|>
    {{#if (gt count 9000)}}
      <p>It's over 9000!</p>
    {{/if}}
  </Counter>

  {{outlet}}

  {{! The following component displays Ember's default welcome message. }}
  <WelcomePage @extension="gts" />
  {{! Feel free to remove this! }}
</template>
