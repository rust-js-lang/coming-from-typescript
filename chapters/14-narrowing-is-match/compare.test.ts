// The TypeScript and the Rust rust-js compiled give what cases.json records
// native Rust giving. rust/tests/native.rs holds native Rust to the same
// cases.
import { expect, test } from 'bun:test'
import cases from './cases.json'
import * as rust from './rust/src/lib.js'
import * as ts from './ts/narrowing.ts'

for (const [json, described, list] of cases.values as [ts.Value, string, boolean][]) {
  test(described, () => {
    // The same JSON value is a `Value` to both: `number | string | Value[]`.
    expect(rust.describe(json)).toBe(described)
    expect(ts.describe(json)).toBe(described)
    expect(rust.isList(json)).toBe(list)
    expect(ts.isList(json)).toBe(list)
  })
}

for (const [line, said] of cases.commands as [string, string][]) {
  test(`the command ${JSON.stringify(line)}`, () => {
    expect(rust.command(line)).toBe(said)
    expect(ts.command(line)).toBe(said)
  })
}

for (const [n, said] of cases.sizes as [number, string][]) {
  test(`the size of ${n}`, () => {
    expect(rust.size(n)).toBe(said)
    expect(ts.size(n)).toBe(said)
  })
}

for (const [address, p] of cases.ports as [string, number | null][]) {
  test(`the port of ${address}`, () => {
    expect(rust.port(address) ?? null).toBe(p)
    expect(ts.port(address) ?? null).toBe(p)
  })
}
