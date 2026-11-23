// What TypeScript sees of `Option`, checked by `tsc` (bun run types). Each
// `@ts-expect-error` must be needed, or tsc fails.
import * as rust from './rust/src/lib.js'
import { team } from './team.ts'

// An `Option` field is optional, `nickname?: string | undefined`.
export const ada: rust.Person = { name: 'Ada' }
// An `Option` result may be either nothing, so test for both: `?? `, `== null`.
const name = rust.managersName(team, 'Grace')
export const said: string = name ?? 'nobody'
// @ts-expect-error it may be nothing
export const unchecked: string = name
// A `#[rust_js::nullable]` one is `T | null`: `=== null` is the whole test.
const orNull = rust.managersNameOrNull(team, 'Grace')
export const strict: string = orNull === null ? 'nobody' : orNull
