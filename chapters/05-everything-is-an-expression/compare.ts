// bun chapters/05-everything-is-an-expression/compare.ts: each case, and
// what the TypeScript and the Rust (as rust-js compiled it) give.
import cases from './cases.json'
import * as rust from './rust/src/lib.js'
import * as ts from './ts/expressions.ts'

for (const [score] of cases.grade) console.log(`grade(${score})`.padEnd(30), `ts: ${ts.grade(score as number)}`.padEnd(20), `rust: ${rust.grade(score as number)}`)
for (const [total, express] of cases.shipping) console.log(`shipping(${total}, ${express})`.padEnd(30), `ts: ${ts.shipping(total as number, express as boolean)}`.padEnd(20), `rust: ${rust.shipping(total as number, express as boolean)}`)
for (const [n] of cases.describe) console.log(`describe(${n})`.padEnd(30), `ts: ${ts.describe(n as number)}`.padEnd(36), `rust: ${rust.describe(n as number)}`)
