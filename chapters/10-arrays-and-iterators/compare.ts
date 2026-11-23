// bun chapters/10-arrays-and-iterators/compare.ts: each list, and what the
// TypeScript and the Rust (as rust-js compiled it) make of it.
import cases from './cases.json'
import * as rust from './rust/src/lib.js'
import * as ts from './ts/arrays.ts'

for (const { xs, n } of cases) {
  console.log(JSON.stringify(xs))
  console.log(`  top ${n}           ts: ${JSON.stringify(ts.top(xs, n)).padEnd(14)} rust: ${JSON.stringify(rust.top(xs, n))}`)
  console.log(`  running totals  ts: ${JSON.stringify(ts.runningTotals(xs)).padEnd(14)} rust: ${JSON.stringify(rust.runningTotals(xs))}`)
  console.log(`  changes         ts: ${JSON.stringify(ts.changes(xs)).padEnd(14)} rust: ${JSON.stringify(rust.changes(xs))}`)
}
