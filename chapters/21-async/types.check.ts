// What TypeScript sees of async, checked by `tsc` (bun run types). Each
// `@ts-expect-error` must be needed, or tsc fails.
import * as rust from './rust/src/lib.js'

// An `async fn` returns a `Promise` of what it returns.
export const receipt: Promise<string> = rust.receipt(['tea'])
// @ts-expect-error a promise of a string isn't a string
export const notAwaited: string = rust.receipt(['tea'])
// A `Result` inside one is checked as any other.
const result = await rust.total(['tea'])
export const cents: number = result.TAG === 'Ok' ? result._0 : 0
