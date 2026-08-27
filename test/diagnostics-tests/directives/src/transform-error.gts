// A special-form arity error is a transform error, not a TypeScript
// diagnostic. The directive suppresses it and counts as used.
<template>
  {{! @glint-expect-error: eq requires two parameters }}
  {{eq}}
</template>
