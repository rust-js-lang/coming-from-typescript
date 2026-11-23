// What TypeScript sees of Rust's kinds of number, checked by `tsc` (bun run
// types). Each `@ts-expect-error` must be needed, or tsc fails.
import * as rust from './rust/src/lib.js'

// Every whole number up to 32 bits, and every float, is a `number`.
export const half: number = rust.share(7)[0]
// A 64-bit one is a `bigint`, and TypeScript keeps the two apart.
export const next: bigint = rust.nextId(41n)
// @ts-expect-error a number isn't a bigint
export const notBig: bigint = rust.nextId(41)
// A parse is a Result: the number, or why not.
const count = rust.parseCount('42')
export const n: number = count.TAG === 'Ok' ? count._0 : 0
