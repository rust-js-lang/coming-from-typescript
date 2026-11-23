// What TypeScript sees of the Rust, checked by `tsc` (bun run types). Each
// `@ts-expect-error` must be needed, or tsc fails.
import * as rust from './rust/src/lib.js'
import * as ts from './ts/stats.ts'

// The same signatures: a list of numbers in, a number or nothing out.
export const fromRust: (xs: number[]) => number | null | undefined = rust.mean
export const fromTs: (xs: number[]) => number | undefined = ts.mean

// The nothing must be handled before the number is used, in both.
const m = rust.mean([1, 2])
// @ts-expect-error `m` may be nothing
export const doubled: number = m * 2
export const safe: number = (m ?? 0) * 2
