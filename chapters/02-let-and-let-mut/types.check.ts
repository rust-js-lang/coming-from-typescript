// What TypeScript sees of `&` and `&mut`, checked by `tsc` (bun run types).
// Each `@ts-expect-error` must be needed, or tsc fails.
import * as rust from './rust/src/lib.js'
import * as ts from './ts/cart.ts'

const frozen: readonly string[] = ['apple']

// The TypeScript says `readonly` where it only reads, so a frozen cart may go in.
export const fromTs: string[] = ts.withItem(frozen, 'pear')

// rust-js declares `&[String]` as `string[]`, not `readonly string[]`, so a
// frozen cart can't, though Rust promises only to read it (rust-js#2392).
// @ts-expect-error a readonly array isn't a string[]
export const fromRust: string[] = rust.withItem(frozen, 'pear')

// Neither says `addItem` changes what it's given: `&mut` doesn't reach the
// `.d.ts`, and TypeScript has no word for it.
export const changes: void = rust.addItem(['apple'], 'fig')
