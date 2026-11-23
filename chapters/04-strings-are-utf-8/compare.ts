// bun chapters/04-strings-are-utf-8/compare.ts: each text, and what the
// TypeScript and the Rust (as rust-js compiled it) make of it.
import cases from './cases.json'
import * as rust from './rust/src/lib.js'
import * as ts from './ts/strings.ts'

for (const { text } of cases) {
  console.log(JSON.stringify(text))
  console.log(`  sizes     ts: ${JSON.stringify(ts.sizes(text)).padEnd(10)} rust: ${JSON.stringify(rust.sizes(text))}  (rust's: bytes, chars)`)
  console.log(`  initials  ts: ${JSON.stringify(ts.initials(text)).padEnd(10)} rust: ${JSON.stringify(rust.initials(text))}`)
  console.log(`  shorten   ts: ${JSON.stringify(ts.shorten(text, 4)).padEnd(10)} rust: ${JSON.stringify(rust.shorten(text, 4))}`)
  console.log(`  reverse   ts: ${JSON.stringify(ts.reverse(text))}  rust: ${JSON.stringify(rust.reverse(text))}`)
}
