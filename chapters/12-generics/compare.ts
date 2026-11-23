// bun chapters/12-generics/compare.ts: the same generic `largest`, asked
// of numbers, letters, and objects TypeScript has no order for.
import * as rust from './rust/src/lib.js'
import * as ts from './ts/generics.ts'

console.log(`largest of [3, 9, 4]       ts: ${ts.highest([3, 9, 4])}  rust: ${rust.highest([3, 9, 4])}`)
console.log(`last letter of "zebra"     ts: ${ts.lastLetter('zebra')}  rust: ${rust.lastLetter('zebra')}`)
const prices = [{ cents: 300 }, { cents: 900 }, { cents: 400 }]
console.log(`largest of three prices    ts: ${JSON.stringify(ts.largest(prices))}  rust: won't compile without a PartialOrd`)
