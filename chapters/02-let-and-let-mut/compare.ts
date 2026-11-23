// bun chapters/02-let-and-let-mut/compare.ts: who changes your cart.
import * as rust from './rust/src/lib.js'
import * as ts from './ts/cart.ts'

for (const [name, side] of [['ts', ts], ['rust', rust]] as const) {
  const cart = ['apple']
  const more = side.withItem(cart, 'pear')
  console.log(`${name}: withItem(cart, 'pear') gives ${JSON.stringify(more)}; your cart is ${JSON.stringify(cart)}`)
  side.addItem(cart, 'fig')
  console.log(`${name}: addItem(cart, 'fig');            your cart is ${JSON.stringify(cart)}`)
}
