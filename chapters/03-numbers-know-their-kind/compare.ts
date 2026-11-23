// bun chapters/03-numbers-know-their-kind/compare.ts: where one `number`
// and Rust's kinds of number part ways.
import cases from './cases.json'
import * as rust from './rust/src/lib.js'
import * as ts from './ts/numbers.ts'

const shown = (value: unknown): string => {
  if (typeof value === 'bigint') return `${value}n`
  if (value === undefined) return 'undefined'
  if (typeof value === 'object' && value !== null && 'TAG' in value) {
    const { TAG, _0 } = value as { TAG: string; _0: unknown }
    return `${TAG}(${JSON.stringify(_0)})`
  }
  return JSON.stringify(value)
}

console.log('parse a count')
for (const [text] of cases.parse_count) console.log(`  ${JSON.stringify(text).padEnd(14)} ts: ${shown(ts.parseCount(text as string)).padEnd(12)} rust: ${shown(rust.parseCount(text as string))}`)
console.log('parse an id')
for (const [text] of cases.parse_id) console.log(`  ${JSON.stringify(text).padEnd(24)} ts: ${shown(ts.parseId(text as string)).padEnd(22)} rust: ${shown(rust.parseId(text as string))}`)
console.log('the id after 9007199254740993')
console.log(`  ts: ${ts.nextId(Number('9007199254740993'))}   rust: ${rust.nextId(9007199254740993n)}n`)
