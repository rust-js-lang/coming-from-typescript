// What TypeScript sees of `&` and `&mut`, checked by `tsc` (bun run types).
// Each `@ts-expect-error` must be needed, or tsc fails.
import * as rust from './rust/src/lib.js'
import * as ts from './ts/cart.ts'

const frozen: readonly string[] = ['apple']

// The TypeScript says `readonly` where it only reads, so a frozen cart may go in.
export const fromTs: string[] = ts.withItem(frozen, 'pear')

// rust-js declares `&[String]` as `readonly string[]`: Rust only reads it,
// so a frozen cart may go in here too (rust-js#2392).
export const fromRust: string[] = rust.withItem(frozen, 'pear')

// `&mut Vec<String>` is a `string[]`: it changes what it's given, so a
// frozen cart can't go in.
// @ts-expect-error a readonly array isn't a string[]
rust.addItem(frozen, 'fig')
