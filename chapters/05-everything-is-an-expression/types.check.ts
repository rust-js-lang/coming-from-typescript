// What TypeScript sees of the Rust, checked by `tsc` (bun run types).
import * as rust from './rust/src/lib.js'

// A `&'static str` is a `string`; an `Option<usize>` a number or nothing.
export const letter: string = rust.grade(95)
const at = rust.firstNegative([1, -2])
export const where: number = at ?? -1
