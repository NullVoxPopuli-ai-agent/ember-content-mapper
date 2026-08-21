const numbers = [1, 2, 3];

<template>
  {{#each numbers as |value|}}
    <span>{{value}}</span>
  {{/each}}
</template>
