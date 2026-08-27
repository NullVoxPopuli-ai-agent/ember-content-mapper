import type { ComponentLike } from '@glint/template';

declare const Comp: ComponentLike<{ Args: { a: string; b?: string } }>;

export const B = <template>{{component Comp a="hi"}}</template>;
