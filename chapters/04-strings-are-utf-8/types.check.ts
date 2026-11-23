// What TypeScript sees of Rust's strings, checked by `tsc` (bun run types).
import * as rust from './rust/src/lib.js'

// `String` and `&str` are both `string`; a pair of lengths is a tuple.
export const sizes: [number, number] = rust.sizes('héllo')
export const word: string = rust.firstWord('hello there')
export const short: string = rust.shorten('hello there', 4)
