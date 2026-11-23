// bun chapters/18-lifetimes/compare.ts: a config read both ways.
import cases from './cases.json'
import * as rust from './rust/src/lib.js'
import * as ts from './ts/lifetimes.ts'

const [config] = cases.pairs[0]! as [string, unknown]
console.log(`pairs of ${JSON.stringify(config)}`)
console.log(`  ts:   ${JSON.stringify(ts.pairs(config))}`)
console.log(`  rust: ${JSON.stringify(rust.pairs(config))}`)
