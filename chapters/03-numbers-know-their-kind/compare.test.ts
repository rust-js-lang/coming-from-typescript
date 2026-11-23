// The Rust rust-js compiled says what cases.json records native Rust
// saying, `u64`s as `bigint`s. The TypeScript, with one `number`, agrees
// where the numbers are small and whole, and these tests pin where it
// doesn't. rust/tests/native.rs holds native Rust to the same cases.
import { expect, test } from 'bun:test'
import cases from './cases.json'
import * as rust from './rust/src/lib.js'
import * as ts from './ts/numbers.ts'

test('rust-js says what native Rust says', () => {
  for (const [n, said] of cases.share) expect(rust.share(n as number)).toEqual(said as unknown as [number, number])
  for (const [boxes, said] of cases.add_box) expect(rust.addBox(boxes as number) ?? null).toBe(said)
  for (const [text, said] of cases.parse_count) {
    const read = rust.parseCount(text as string)
    expect<object>(read.TAG === 'Ok' ? { Ok: read._0 } : { Err: read._0 }).toEqual(said as object)
  }
  for (const [text, said] of cases.parse_id) expect(rust.parseId(text as string)?.toString() ?? null).toBe(said)
  for (const [id, said] of cases.next_id) expect(rust.nextId(BigInt(id)).toString()).toBe(said)
  for (const [level, said] of cases.brightness) expect(rust.brightness(level as number)).toBe(said)
})

test('a u64 is a bigint in JS, so it keeps every digit', () => {
  expect(rust.parseId('9007199254740993')).toBe(9007199254740993n)
  expect(rust.nextId(9007199254740993n)).toBe(9007199254740994n)
})

test("TypeScript's one number agrees where numbers are small and whole", () => {
  expect(ts.share(7)).toEqual(rust.share(7))
  expect(ts.addBox(254)).toBe(rust.addBox(254)!)
  expect(ts.addBox(255)).toBe(undefined)
  for (const [level] of cases.brightness) expect(ts.brightness(level as number)).toBe(rust.brightness(level as number))
})

test("and where TypeScript's built-ins are looser, or round", () => {
  // `parseInt` reads what it can of the front and stops.
  expect(ts.parseCount('42abc')).toBe(42)
  expect(ts.parseCount('4.5')).toBe(4)
  expect(ts.parseCount('-3')).toBe(-3)
  expect(ts.parseCount('4294967296')).toBe(4294967296)
  // A number past 2^53 is rounded to the nearest one a double holds.
  expect(ts.parseId('9007199254740993')).toBe(9007199254740992)
  expect(ts.nextId(9007199254740992)).toBe(9007199254740992)
})
