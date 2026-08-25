const known = 'yes';

<template>
  {{known}}
  {{! @glint-ignore: unknown is not defined }}
  {{unknown}}
</template>
