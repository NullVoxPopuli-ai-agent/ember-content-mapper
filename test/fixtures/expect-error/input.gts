const known = 'yes';

<template>
  {{known}}
  {{! @glint-expect-error: unknown is not defined }}
  {{unknown}}
</template>
