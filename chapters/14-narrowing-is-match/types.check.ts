// What TypeScript sees of an untagged enum, checked by `tsc` (bun run
// types). Each `@ts-expect-error` must be needed, or tsc fails.
import * as rust from './rust/src/lib.js'
import * as ts from './ts/narrowing.ts'

// `#[rust_js::untagged]`'s `Value` is TypeScript's union, both ways.
const nested: rust.Value = ['a', [1, 2], 0.5]
export const asTs: ts.Value = nested
export const fromTs: rust.Value = asTs
// @ts-expect-error a boolean isn't a Value
export const notOne: rust.Value = true
