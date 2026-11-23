// What TypeScript sees of private fields, checked by `tsc` (bun run
// types). Each `@ts-expect-error` must be needed, or tsc fails.
import * as rust from './rust/src/lib.js'

// A struct with private fields is opaque: TypeScript can't make one, or
// read its fields, only ask its functions.
// @ts-expect-error a Temperature only comes from Temperature's functions
export const made: rust.Temperature = { celsius: -500 }
const made2 = rust.Temperature.fromCelsius(20)
export const read: number = made2.TAG === 'Ok' ? rust.Temperature.celsius(made2._0) : 0
// @ts-expect-error its field is private
export const peeked: number = made2.TAG === 'Ok' ? made2._0.celsius : 0

// A fieldless variant is its name; one with fields has a TAG.
export const roles: rust.Role[] = ['Engineer', { TAG: 'Manager', reports: 2 }]
