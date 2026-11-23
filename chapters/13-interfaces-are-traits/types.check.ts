// What TypeScript sees of traits, checked by `tsc` (bun run types). Each
// `@ts-expect-error` must be needed, or tsc fails.
import * as rust from './rust/src/lib.js'

// An `impl Shape for Circle` is a `Shape<Circle>`: its methods take the
// circle first.
const shape: rust.Shape<rust.Circle> = rust.circleShape
export const area: number = shape.area({ radius: 1 })
// @ts-expect-error circleShape's methods take circles
rust.circleShape.area({ side: 2 })

// Across the boundary, TypeScript's rules are structural: `Meters` and
// `Seconds` are both `[number]`, and swapping them type-checks here,
// though Rust refuses it in Rust.
const meters: rust.Meters = [100]
const seconds: rust.Seconds = [9.58]
export const swapped: number = rust.speed(seconds, meters)
