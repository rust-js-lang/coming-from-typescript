// What TypeScript sees, checked by `tsc` (bun run types). On this side of
// the boundary, rust-js gives back two of the three conveniences.
import * as rust from './rust/src/lib.js'
import type * as ts from './ts/easier.ts'

// A trailing `Option` parameter may be left out.
export const hello: string = rust.greet('Ada')
// `UserPatch` is `Partial<User>`, both ways.
export const patch: rust.UserPatch = {} satisfies Partial<ts.User>
export const partial: Partial<ts.User> = { email: 'ada@new.example' } satisfies rust.UserPatch
// @ts-expect-error a patch's fields are still a user's
export const wrong: rust.UserPatch = { email: 42 }
