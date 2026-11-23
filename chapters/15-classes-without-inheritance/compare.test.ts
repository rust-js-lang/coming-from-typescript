// The TypeScript classes and the Rust rust-js compiled give what cases.json
// records native Rust giving. rust/tests/native.rs holds native Rust to the
// same cases.
import { expect, test } from 'bun:test'
import cases from './cases.json'
import * as rust from './rust/src/lib.js'
import { rustStaff, tsStaff } from './staff.ts'
import * as ts from './ts/classes.ts'

type Made = { Ok: [number, number] } | { Err: string }

const fromRust = (made: ReturnType<typeof rust.Temperature.fromCelsius>): Made =>
  made.TAG === 'Ok' ? { Ok: [rust.Temperature.celsius(made._0), rust.Temperature.fahrenheit(made._0)] } : { Err: made._0 }

const fromTs = (make: () => ts.Temperature): Made => {
  try {
    const t = make()
    return { Ok: [t.celsius, t.fahrenheit] }
  } catch (error) {
    return { Err: (error as Error).message }
  }
}

for (const [c, said] of cases.celsius as [number, Made][]) {
  test(`${c}°C`, () => {
    expect(fromRust(rust.Temperature.fromCelsius(c))).toEqual(said)
    expect(fromTs(() => ts.Temperature.fromCelsius(c))).toEqual(said)
  })
}

for (const [f, said] of cases.fahrenheit as [number, Made][]) {
  test(`${f}°F`, () => {
    expect(fromRust(rust.Temperature.fromFahrenheit(f))).toEqual(said)
    expect(fromTs(() => ts.Temperature.fromFahrenheit(f))).toEqual(said)
  })
}

test("each one's pay and job, and the payroll", () => {
  expect(rustStaff.map((s) => [rust.Staff.monthlyPay(s), rust.Staff.describe(s)])).toEqual(cases.staff)
  expect(tsStaff.map((e) => [e.monthlyPay(), e.describe()])).toEqual(cases.staff)
  expect(rust.payroll(rustStaff)).toBe(cases.payroll)
  expect(ts.payroll(tsStaff)).toBe(cases.payroll)
})

test('an associated const is on the type', () => {
  expect(rust.Temperature.ABSOLUTE_ZERO).toBe(-273.15)
  expect(ts.Temperature.ABSOLUTE_ZERO).toBe(-273.15)
})
