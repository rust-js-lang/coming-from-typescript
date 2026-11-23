// What TypeScript sees of slices and Vecs, checked by `tsc` (bun run
// types). Each `@ts-expect-error` must be needed, or tsc fails.
import * as rust from './rust/src/lib.js'

// A `&[u32]` is a `readonly number[]`: a frozen array goes in.
const frozen: readonly number[] = Object.freeze([3, 9, 4, 7])
// A `Vec<u32>` that comes out is the caller's own, a plain `number[]`.
export const best: number[] = rust.top(frozen, 2)
best.push(1)
// `get` is an `Option`: it may be nothing.
// @ts-expect-error `item` may be undefined
export const unchecked: number = rust.item(frozen, 9)
export const checked: number = rust.item(frozen, 9) ?? 0

// TypeScript's own index, without `noUncheckedIndexedAccess`, is typed
// `number` and is `undefined` at run time: the gap `get` closes.
export const past: number = frozen[9]
