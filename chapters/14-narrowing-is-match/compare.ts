// bun chapters/14-narrowing-is-match/compare.ts: each command, read by
// TypeScript's tests and Rust's patterns (as rust-js compiled them).
import cases from './cases.json'
import * as rust from './rust/src/lib.js'
import * as ts from './ts/narrowing.ts'

for (const [line] of cases.commands) {
  console.log(`> ${line}`)
  console.log(`  ts:   ${ts.command(line as string)}`)
  console.log(`  rust: ${rust.command(line as string)}`)
}
