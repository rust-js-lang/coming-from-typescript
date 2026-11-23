// bun chapters/23-calling-js/compare.ts: Rust's receipt, its prices written
// by TypeScript's `Intl`, in three currencies.
import * as rust from './rust/src/lib.js'

const items = [
  { name: 'tea', price: 350 },
  { name: 'cake', price: 1299 },
]
for (const currency of ['USD', 'EUR', 'JPY']) {
  console.log(`${currency}: ${JSON.stringify(rust.receipt(items, currency))}`)
}
console.log(`a tenth off: ${rust.discounted(items, (item) => Math.floor(item.price / 10))}`)
