import type { ComponentLike } from '@glint/template';

interface Tab {
  component: ComponentLike<{ Args: Record<string, never> }>;
}
declare const tabs: readonly Tab[];

export const Looped = <template>{{#each tabs as |tab|}}<tab.component />{{/each}}</template>;
