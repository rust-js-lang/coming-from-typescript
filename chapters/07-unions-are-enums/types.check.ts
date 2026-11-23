// What TypeScript sees of the enum, checked by `tsc` (bun run types). Each
// `@ts-expect-error` must be needed, or tsc fails.
import * as rust from './rust/src/lib.js'
import * as ts from './ts/shapes.ts'

// rust-js's Shape is the TypeScript union, both ways.
const circle: rust.Shape = { kind: 'circle', radius: 2 }
export const asTs: ts.Shape = circle
export const fromTs: rust.Shape = ts.doubled(circle)
// A kind that isn't one isn't one, and a kind's fields are its own.
// @ts-expect-error there's no 'triangle'
export const triangle: rust.Shape = { kind: 'triangle' }
// @ts-expect-error a circle has a radius, not a side
export const wrongField: rust.Shape = { kind: 'circle', side: 2 }
