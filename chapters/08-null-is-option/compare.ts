// bun chapters/08-null-is-option/compare.ts: each person, and what the
// TypeScript and the Rust (as rust-js compiled it) say of them.
import cases from './cases.json'
import * as rust from './rust/src/lib.js'
import * as ts from './ts/team.ts'
import { team } from './team.ts'

for (const { name } of cases) {
  console.log(name)
  console.log(`  manager's name  ts: ${String(ts.managersName(team, name)).padEnd(10)} rust: ${String(rust.managersName(team, name)).padEnd(10)} rust, nullable: ${rust.managersNameOrNull(team, name)}`)
}
