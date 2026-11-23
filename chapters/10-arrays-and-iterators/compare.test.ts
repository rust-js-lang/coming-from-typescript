// The TypeScript and the Rust rust-js compiled give what cases.json records
// native Rust giving, list by list. rust/tests/native.rs holds native Rust
// to the same cases.
import { expect, test } from 'bun:test'
import cases from './cases.json'
import * as rust from './rust/src/lib.js'
import * as ts from './ts/arrays.ts'

for (const c of cases) {
  test(JSON.stringify(c.xs), () => {
    const { xs, n, i } = c
    expect(rust.top(xs, n)).toEqual(c.top)
    expect(ts.top(xs, n)).toEqual(c.top)
    expect(rust.runningTotals(xs)).toEqual(c.running_totals)
    expect(ts.runningTotals(xs)).toEqual(c.running_totals)
    expect(rust.changes(xs)).toEqual(c.changes)
    expect(ts.changes(xs)).toEqual(c.changes)
    expect(rust.item(xs, i) ?? null).toBe(c.item)
    expect(ts.item(xs, i) ?? null).toBe(c.item)
    const limit = xs[0] ?? 0
    expect(rust.squaresPast(limit, n)).toEqual(c.squares_past)
    expect(ts.squaresPast(limit, n)).toEqual(c.squares_past)
  })
}

const school = [
  { name: 'Ada', score: 91 },
  { name: 'Alan', score: 49 },
  { name: 'Grace', score: 50 },
  { name: 'Linus', score: 12 },
]

test('those who passed', () => {
  expect(rust.passing(school)).toEqual(['Ada', 'Grace'])
  expect(ts.passing(school)).toEqual(['Ada', 'Grace'])
})

test("top sorts a copy: the slice it's given is only read", () => {
  const scores = [3, 9, 4, 7]
  rust.top(scores, 2)
  expect(scores).toEqual([3, 9, 4, 7])
})
