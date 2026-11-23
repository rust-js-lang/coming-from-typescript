// What TypeScript sees of generics, checked by `tsc` (bun run types). Each
// `@ts-expect-error` must be needed, or tsc fails.
import * as rust from './rust/src/lib.js'

// A generic struct is a generic interface, its methods generic functions.
const stack: rust.Stack<number> = rust.Stack.new()
rust.Stack.push(stack, 1)
// @ts-expect-error a Stack<number> holds numbers
rust.Stack.push(stack, 'one')

// A function whose bound rust-js passes as a value isn't declared: TypeScript
// can't give the `PartialOrd` its JS takes. `highest` gives it, and is.
// @ts-expect-error `largest` isn't declared
export const largest = rust.largest
export const highest: number | null | undefined = rust.highest([3, 9, 4])
