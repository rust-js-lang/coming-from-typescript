// bun chapters/16-moves/compare.ts: a cart, an order, and what happens when
// the cart changes after; then a save that fails halfway.
import cases from './cases.json'
import * as rust from './rust/src/lib.js'
import * as ts from './ts/moves.ts'

const cart = ['apple']
const order = ts.checkout(cart)
cart.push('pear')
console.log(`ts:   checkout(cart), then cart.push("pear")`)
console.log(`      order is ${JSON.stringify(order)}: count says 1, items say 2`)
console.log(`rust: checkout(cart), then cart.push("pear")`)
console.log(`      won't compile: borrow of moved value: cart`)
const [lines] = cases.saves[1]!
console.log(`\nsave ${JSON.stringify(lines)}`)
console.log(`  ts:   ${JSON.stringify(ts.save(lines as string[]))}`)
console.log(`  rust: ${JSON.stringify(rust.save(lines as string[]))}`)
