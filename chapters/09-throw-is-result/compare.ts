// bun chapters/09-throw-is-result/compare.ts: each payment, and how each
// side says it failed: TypeScript throws, Rust returns a `Result`.
import cases from './cases.json'
import * as rust from './rust/src/lib.js'
import * as ts from './ts/bank.ts'

const fresh = () => [{ name: 'ada', cents: 5000 }, { name: 'grace', cents: 1000 }]

for (const { from, to, amount } of cases) {
  let said: string
  try {
    said = `paid ${ts.pay(fresh(), from, to, amount)}`
  } catch (error) {
    said = `threw: ${(error as Error).message}`
  }
  const result = rust.pay(fresh(), from, to, amount)
  console.log(`pay ${amount} from ${from} to ${to}`)
  console.log(`  ts:   ${said}`)
  console.log(`  rust: ${result.TAG === 'Ok' ? `Ok(${result._0})` : `Err(${result._0})`}`)
}
