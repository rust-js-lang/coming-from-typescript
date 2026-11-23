// The TypeScript and the Rust rust-js compiled give what cases.json records
// native Rust giving. rust/tests/native.rs holds native Rust to the same
// cases, and holds that a Rust future never awaited never runs.
import { expect, test } from 'bun:test'
import cases from './cases.json'
import * as rust from './rust/src/lib.js'
import * as ts from './ts/shop.ts'

for (const { items, total, receipt } of cases) {
  test(`the basket ${JSON.stringify(items)}`, async () => {
    // rust-js's async fn is an async function: a promise of its result.
    const result = await rust.total(items)
    expect<object>(result.TAG === 'Ok' ? { Ok: result._0 } : { Err: result._0 }).toEqual(total)
    if ('Ok' in total) expect(await ts.total(items)).toBe(total.Ok as number)
    else await expect(ts.total(items)).rejects.toThrow(total.Err as string)
    expect(await rust.receipt(items)).toBe(receipt)
    expect(await ts.receipt(items)).toBe(receipt)
  })
}

test('a promise starts as it is made, awaited or not', async () => {
  // Native Rust's are ["made"] and ["made", "step started"]: native.rs.
  expect(ts.madeNotAwaited()).toEqual(['step started', 'made'])
  expect(await ts.madeThenAwaited()).toEqual(['step started', 'made'])
})
