// The TypeScript and the Rust rust-js compiled give what cases.json records
// native Rust giving; the receipt, which calls TypeScript's `formatMoney`
// from Rust, is held to the TypeScript's own. rust/tests/native.rs holds
// native Rust to the cases.
import { expect, test } from 'bun:test'
import cases from './cases.json'
import * as rust from './rust/src/lib.js'
import * as ts from './ts/shop.ts'

const tenthOff = (item: ts.Item) => Math.floor(item.price / 10)

for (const c of cases) {
  const items = c.items.map(([name, price]) => ({ name: name as string, price: price as number }))
  test(`the items ${JSON.stringify(c.items)}`, () => {
    expect(rust.total(items)).toBe(c.total)
    expect(ts.total(items)).toBe(c.total)
    // A TypeScript function given where the Rust takes a closure.
    expect(rust.discounted(items, tenthOff)).toBe(c.tenth_off)
    expect(ts.discounted(items, tenthOff)).toBe(c.tenth_off)
    // Rust calling TypeScript's `Intl`, in three currencies.
    for (const currency of ['USD', 'EUR', 'JPY']) {
      expect(rust.receipt(items, currency)).toEqual(ts.receipt(items, currency))
    }
  })
}

test("a receipt, Rust's lines in TypeScript's words", () => {
  const items = [{ name: 'tea', price: 350 }]
  expect(rust.receipt(items, 'USD')).toEqual(['tea $3.50', 'total $3.50'])
  expect(rust.receipt(items, 'JPY')).toEqual(['tea ¥350', 'total ¥350'])
})

test("a callback's number isn't checked against the u32 Rust promised", () => {
  // The declaration says `number`, and a negative one goes in: the Rust
  // trusted its type, and a discount of -100 adds 100.
  const items = [{ name: 'tea', price: 350 }]
  expect(rust.discounted(items, () => -100)).toBe(450)
})
