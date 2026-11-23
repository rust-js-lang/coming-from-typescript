// What TypeScript sees here, checked by `tsc` (bun run types): the `Rc`s
// and `RefCell`s stay inside, and what crosses is plain.
import * as rust from './rust/src/lib.js'

export const log: string[] = rust.chat([['ada', 'hi']])
// @ts-expect-error each line is a speaker and a text
rust.chat([['ada']])
