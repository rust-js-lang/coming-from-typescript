// What TypeScript sees of borrows, checked by `tsc` (bun run types). Each
// `@ts-expect-error` must be needed, or tsc fails.
import * as rust from './rust/src/lib.js'

const frozen: readonly string[] = ['a', 'long']
// `&[String]` reads: `readonly string[]`, so a frozen array may go in.
export const count: number = rust.letters(frozen)
// `&mut [String]` changes: `string[]`.
// @ts-expect-error capitalizeAll changes the array it's lent
rust.capitalizeAll(frozen)
// `&mut u32` is a box JavaScript can see changed: `{ value: number }`.
// @ts-expect-error a number would be a copy, its change lost
rust.addPoints(5, 10)
