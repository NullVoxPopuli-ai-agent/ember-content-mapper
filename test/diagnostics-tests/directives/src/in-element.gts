import type { ComponentLike } from '@glint/template';

declare const Child: ComponentLike<{ Args: { a: string } }>;

<template>
  <Child
    {{! @glint-expect-error: the next line is a valid arg }}
    @a="x"
  />
  <Child @a="x"
    {{! @glint-expect-error: the next line closes the tag }}
  />
  {{#if true}}
    {{! @glint-expect-error: the next line closes the block }}
  {{/if}}
</template>
