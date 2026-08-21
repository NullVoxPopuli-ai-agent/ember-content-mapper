import type { TOC } from '@ember/component/template-only';

export const First: TOC<{ Args: { value: string } }> = <template>
  <b>{{@value}}</b>
</template>;

export const Second: TOC<{ Args: { count: number } }> = <template>
  <i>{{@count}}</i>
</template>;
