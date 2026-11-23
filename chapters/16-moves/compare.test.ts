// The TypeScript and the Rust rust-js compiled give what cases.json records
// native Rust giving. rust/tests/native.rs holds native Rust to the same
// cases.
import { expect, test } from 'bun:test'
import cases from './cases.json'
import * as rust from './rust/src/lib.js'
import * as ts from './ts/moves.ts'

for (const cart of cases.carts) {
  test(`checking out ${JSON.stringify(cart)}`, () => {
    const order = { items: cart, count: cart.length }
    expect(rust.checkout([...cart])).toEqual(order)
    expect(ts.checkout([...cart])).toEqual(order)
    expect(rust.orderTwice([...cart])).toEqual([order, order])
    expect(ts.orderTwice([...cart])).toEqual([order, order])
  })
}

for (const [lines, log] of cases.saves as [string[], string[]][]) {
  test(`saving ${JSON.stringify(lines)}`, () => {
    // The section closes on the way out either way: Drop in Rust, `finally` in TypeScript.
    expect(rust.save(lines)).toEqual(log)
    expect(ts.save(lines)).toEqual(log)
  })
}

test('the first of two orders is its own copy; the second is the cart', () => {
  const cart = ['apple']
  const [first, second] = rust.orderTwice(cart)
  expect(first.items).not.toBe(cart)
  expect(second.items).toBe(cart)
})

test("from TypeScript, what's passed by value is given away: change it after, and the order sees", () => {
  // Rust code can't use `cart` after `checkout(cart)`. A TypeScript caller
  // can, and the order, which holds that very array, changes with it.
  const cart = ['apple']
  const order = rust.checkout(cart)
  cart.push('pear')
  expect(order).toEqual({ items: ['apple', 'pear'], count: 1 })
})
