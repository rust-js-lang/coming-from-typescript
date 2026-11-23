// The TypeScript, which throws, and the Rust rust-js compiled, which
// returns a `Result`, take and refuse the same payments with the same
// words, and change the accounts only when a payment is made, as
// cases.json records native Rust doing. rust/tests/native.rs holds native
// Rust to the same cases.
import { expect, test } from 'bun:test'
import cases from './cases.json'
import * as rust from './rust/src/lib.js'
import * as ts from './ts/bank.ts'

const fresh = () => [{ name: 'ada', cents: 5000 }, { name: 'grace', cents: 1000 }]

for (const { from, to, amount, result, after } of cases) {
  test(`pay ${JSON.stringify(amount)} from ${from} to ${to}`, () => {
    const accounts = fresh()
    const paid = rust.pay(accounts, from, to, amount)
    expect<object>(paid.TAG === 'Ok' ? { Ok: paid._0 } : { Err: paid._0 }).toEqual(result)
    expect(accounts.map((a) => a.cents)).toEqual(after)
    const tsAccounts = fresh()
    if ('Ok' in result) expect(ts.pay(tsAccounts, from, to, amount)).toBe(result.Ok as number)
    else expect(() => ts.pay(tsAccounts, from, to, amount)).toThrow(result.Err as string)
    expect(tsAccounts.map((a) => a.cents)).toEqual(after)
  })
}

test("transfer's error is a value to match on, not a message to parse", () => {
  const failed = rust.transfer(fresh(), 'ada', 'grace', 100000)
  expect(failed).toEqual({ TAG: 'Err', _0: { kind: 'short', needed: 100000, has: 5000 } })
  if (failed.TAG === 'Err' && failed._0.kind === 'short') expect(failed._0.has).toBe(5000)
  expect(rust.transfer(fresh(), 'ada', 'nobody', 1)).toEqual({ TAG: 'Err', _0: { kind: 'unknown', name: 'nobody' } })
})
