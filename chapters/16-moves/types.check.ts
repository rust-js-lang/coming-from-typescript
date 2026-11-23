// What TypeScript sees of moves, checked by `tsc` (bun run types). Each
// `@ts-expect-error` must be needed, or tsc fails.
import * as rust from './rust/src/lib.js'

// A `Vec` taken by value is `string[]`, not `readonly string[]`: the
// function owns it now, and may change it. TypeScript has no way to say
// "and you can't use it after", so the declaration can't either.
const frozen: readonly string[] = ['apple']
// @ts-expect-error checkout takes an array it may change
rust.checkout(frozen)
// A borrowed one, `&[String]`, is `readonly string[]`.
export const log: string[] = rust.save(frozen)
