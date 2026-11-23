// bun chapters/01-the-same-function-twice/compare.ts: each case, and what the
// TypeScript and the Rust (as rust-js compiled it) say of it.
import cases from './cases.json'
import * as rust from './rust/src/lib.js'
import * as ts from './ts/stats.ts'

for (const { xs, why } of cases) {
  console.log(`${JSON.stringify(xs)}   (${why})`)
  console.log(`  ts:   ${ts.describe(xs)}`)
  console.log(`  rust: ${rust.describe(xs)}`)
}
