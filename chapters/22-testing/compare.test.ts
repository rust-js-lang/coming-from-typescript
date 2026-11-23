// The TypeScript and the Rust rust-js compiled give what cases.json records
// native Rust giving. rust/tests/native.rs holds native Rust to the same
// cases, and `rust-js test` runs it, and lib.rs's unit tests, as JS.
import { expect, test } from 'bun:test'
import cases from './cases.json'
import * as rust from './rust/src/lib.js'
import * as ts from './ts/duration.ts'

for (const { text, seconds } of cases) {
  test(`the duration ${JSON.stringify(text)}`, () => {
    const parsed = rust.parseDuration(text)
    expect<object>(parsed.TAG === 'Ok' ? { Ok: parsed._0 } : { Err: parsed._0 }).toEqual(seconds)
    if ('Ok' in seconds) expect(ts.parseDuration(text)).toBe(seconds.Ok as number)
    else expect(() => ts.parseDuration(text)).toThrow(seconds.Err as string)
  })
}

test('dividing by zero panics in Rust, as JS it is Infinity', () => {
  expect(() => rust.share(60, 0)).toThrow('attempt to divide by zero')
  expect(ts.share(60, 0)).toBe(Infinity)
})
