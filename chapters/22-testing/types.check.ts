// What TypeScript sees of the tested crate, checked by `tsc` (bun run
// types). Each `@ts-expect-error` must be needed, or tsc fails.
import * as rust from './rust/src/lib.js'

const parsed = rust.parseDuration('1h30m')
export const seconds: number = parsed.TAG === 'Ok' ? parsed._0 : 0
// A private helper the unit tests reach isn't the crate's API: not exported.
// @ts-expect-error `unitSeconds` is private
export const unit = rust.unitSeconds
