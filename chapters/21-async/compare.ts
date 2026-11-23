// bun chapters/21-async/compare.ts: baskets, priced by each side, and when
// a TypeScript promise starts.
import cases from './cases.json'
import * as rust from './rust/src/lib.js'
import * as ts from './ts/shop.ts'

for (const { items } of cases) {
  console.log(JSON.stringify(items))
  console.log(`  ts:   ${await ts.receipt(items)}`)
  console.log(`  rust: ${await rust.receipt(items)}`)
}
console.log(`made, never awaited`)
console.log(`  ts:   ${JSON.stringify(ts.madeNotAwaited())}`)
console.log(`  rust: ["made"]   (native Rust, rust/tests/native.rs)`)
