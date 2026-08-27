// A plain TypeScript module importing .gts modules: the content mapper
// resolves these imports and types the .ts side of the boundary.
export { default as Counter } from "./components/counter.gts";
export type { CounterSignature } from "./components/counter.gts";
export { default as Greeting } from "./components/greeting.gts";
export type { GreetingSignature } from "./components/greeting.gts";
export { formatCount, shout } from "./utils/format.ts";
