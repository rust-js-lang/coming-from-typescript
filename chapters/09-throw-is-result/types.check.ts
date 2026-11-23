// What TypeScript sees of a `Result`, checked by `tsc` (bun run types). Each
// `@ts-expect-error` must be needed, or tsc fails.
import * as rust from './rust/src/lib.js'
import * as ts from './ts/bank.ts'

const accounts: rust.Account[] = [{ name: 'ada', cents: 5000 }]

// The TypeScript's type says nothing of failing: `number`.
export const paid: number = ts.pay(accounts, 'ada', 'grace', '1.00')

// Rust's says it: a `Result`, which must be looked at before the number is used.
const result = rust.pay(accounts, 'ada', 'grace', '1.00')
// @ts-expect-error a Result isn't a number
export const unchecked: number = result
export const cents: number = result.TAG === 'Ok' ? result._0 : 0

// And its error is a union TypeScript narrows, every kind of failure named.
const transferred = rust.transfer(accounts, 'ada', 'grace', 1)
export const why: string =
  transferred.TAG === 'Ok' ? 'done' : transferred._0.kind === 'short' ? `short by ${transferred._0.needed - transferred._0.has}` : transferred._0.kind
