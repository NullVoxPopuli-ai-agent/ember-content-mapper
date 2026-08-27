import ClassicMixin from './classic-mixin.gjs';

export const Ok = <template><ClassicMixin @channelName="hi" /></template>;

export const Wrong = <template>
  {{! @glint-expect-error: channelName is a string }}
  <ClassicMixin @channelName={{1}} />
</template>;
