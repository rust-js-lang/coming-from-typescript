// bun chapters/20-modules-and-crates/compare.ts: a receipt, from the
// TypeScript modules and from the Rust crate's (as rust-js compiled them).
import cases from './cases.json'
import * as rustShop from './rust/src/shop.js'
import { shop } from './ts/index.ts'

const items = cases[0]!.items.map(([name, cents]) => ({ name: name as string, cents: cents as number }))
console.log(`ts:   ${JSON.stringify(shop.receipt(items))}`)
console.log(`rust: ${JSON.stringify(rustShop.receipt(items))}`)
