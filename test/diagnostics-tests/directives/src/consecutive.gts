const known = 'yes';

<template>
  {{! @glint-expect-error: the next line is another directive }}
  {{! @glint-expect-error: nothing is wrong below }}
  {{known}}
</template>
