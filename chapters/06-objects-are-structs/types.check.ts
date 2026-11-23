// What TypeScript sees of a struct, checked by `tsc` (bun run types). Each
// `@ts-expect-error` must be needed, or tsc fails.
import * as rust from './rust/src/lib.js'
import * as ts from './ts/shapes.ts'

// A struct with `pub` fields is an interface: the same type as the
// TypeScript one, both ways.
const r: rust.Rect = rust.Rect.new(0, 0, 2, 3)
export const asTs: ts.Rect = r
export const fromTs: rust.Rect = ts.newRect(0, 0, 2, 3)

// Its methods are on `Rect`, the receiver first, not on the object.
export const area: number = rust.Rect.area(r)
// @ts-expect-error a plain object has no `area` method
export const notOnIt: number = r.area()
