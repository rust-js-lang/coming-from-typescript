// The TypeScript modules and the Rust crate rust-js compiled give what
// cases.json records native Rust giving. rust/tests/native.rs holds native
// Rust to the same cases.
import { expect, test } from 'bun:test'
import cases from './cases.json'
import * as rustMoney from './rust/src/money.js'
import * as rustShop from './rust/src/shop.js'
import { Money, shop } from './ts/index.ts'

for (const c of cases) {
  const items = c.items.map(([name, cents]) => ({ name: name as string, cents: cents as number }))
  test(`a receipt for ${JSON.stringify(c.items)}`, () => {
    expect(rustMoney.Money.format(rustShop.total(items))).toBe(c.total)
    expect(shop.total(items).format()).toBe(c.total)
    expect(rustShop.receipt(items)).toEqual(c.receipt)
    expect(shop.receipt(items)).toEqual(c.receipt)
  })
}

test("each module is its own file, the crate's dependency its own too", () => {
  expect(rustMoney.Money.format(rustMoney.Money.fromCents(5))).toBe('$0.05')
  expect(Money.fromCents(5).format()).toBe('$0.05')
})
