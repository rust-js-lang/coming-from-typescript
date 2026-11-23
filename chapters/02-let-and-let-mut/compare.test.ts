// The TypeScript and the Rust rust-js compiled say the same of each case,
// what cases.json records native Rust saying; and each changes your cart
// only where its Rust says `&mut`. rust/tests/native.rs holds native Rust to
// the same.
import { expect, test } from 'bun:test'
import cases from './cases.json'
import * as rust from './rust/src/lib.js'
import * as ts from './ts/cart.ts'

for (const { name, slug, prices, total } of cases) {
  test(`${JSON.stringify(name)}, ${JSON.stringify(prices)}`, () => {
    expect(ts.slug(name)).toBe(slug)
    expect(rust.slug(name)).toBe(slug)
    expect(ts.total(prices)).toBe(total)
    expect(rust.total(prices)).toBe(total)
  })
}

test('withItem leaves your cart as it was, in both', () => {
  for (const side of [ts, rust]) {
    const cart = ['apple']
    expect(side.withItem(cart, 'pear')).toEqual(['apple', 'pear'])
    expect(cart).toEqual(['apple'])
  }
})

test("addItem changes your cart, in both: it's the same array", () => {
  for (const side of [ts, rust]) {
    const cart = ['apple']
    side.addItem(cart, 'fig')
    expect(cart).toEqual(['apple', 'fig'])
  }
})
