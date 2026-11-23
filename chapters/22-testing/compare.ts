// bun chapters/22-testing/compare.ts: each duration, both ways.
import cases from './cases.json'
import * as rust from './rust/src/lib.js'
import * as ts from './ts/duration.ts'

for (const { text } of cases) {
  let said: string
  try {
    said = String(ts.parseDuration(text))
  } catch (error) {
    said = `threw: ${(error as Error).message}`
  }
  const parsed = rust.parseDuration(text)
  console.log(`${JSON.stringify(text).padEnd(8)} ts: ${said.padEnd(36)} rust: ${parsed.TAG === 'Ok' ? parsed._0 : `Err(${parsed._0})`}`)
}
