// The TypeScript and the Rust rust-js compiled say the same of each case,
// what cases.json records native Rust saying. "Nothing" is `undefined` from
// both, and `null` in the JSON.
import { expect, test } from 'bun:test'
import cases from './cases.json'
import * as rust from './rust/src/lib.js'
import * as ts from './ts/stats.ts'

for (const { xs, why, mean, largest, describe } of cases) {
  test(why, () => {
    expect(ts.mean(xs) ?? null).toBe(mean)
    expect(rust.mean(xs) ?? null).toBe(mean)
    expect(ts.largest(xs) ?? null).toBe(largest)
    expect(rust.largest(xs) ?? null).toBe(largest)
    expect(ts.describe(xs)).toBe(describe)
    expect(rust.describe(xs)).toBe(describe)
  })
}
