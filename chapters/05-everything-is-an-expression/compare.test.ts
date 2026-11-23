// The TypeScript and the Rust rust-js compiled give what cases.json records
// native Rust giving, case by case. rust/tests/native.rs holds native Rust to
// the same cases.
import { expect, test } from 'bun:test'
import cases from './cases.json'
import * as rust from './rust/src/lib.js'
import * as ts from './ts/expressions.ts'

test('grade', () => {
  for (const [score, said] of cases.grade) {
    expect(rust.grade(score as number)).toBe(said as string)
    expect(ts.grade(score as number)).toBe(said as string)
  }
})

test('shipping', () => {
  for (const [total, express, said] of cases.shipping) {
    expect(rust.shipping(total as number, express as boolean)).toBe(said as number)
    expect(ts.shipping(total as number, express as boolean)).toBe(said as number)
  }
})

test('first negative', () => {
  for (const [xs, said] of cases.first_negative) {
    expect(rust.firstNegative(xs as number[]) ?? null).toBe(said as number | null)
    expect(ts.firstNegative(xs as number[]) ?? null).toBe(said as number | null)
  }
})

test('describe', () => {
  for (const [n, said] of cases.describe) {
    expect(rust.describe(n as number)).toBe(said as string)
    expect(ts.describe(n as number)).toBe(said as string)
  }
})
