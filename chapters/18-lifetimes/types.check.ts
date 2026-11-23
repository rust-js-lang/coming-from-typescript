// What TypeScript sees of lifetimes, checked by `tsc` (bun run types):
// nothing. A `&'a str` is a `string`, like any other.
import * as rust from './rust/src/lib.js'

export const longer: string = rust.longest('apple', 'fig')
export const found: string[] = rust.mentions('Rust is fast.', 'rust')
// @ts-expect-error a string's result is a string, not a number
export const wrong: number = rust.firstWord('hello world')
