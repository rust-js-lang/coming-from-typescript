// bun chapters/19-rc-and-refcell/compare.ts: a chat both ways, and a read
// while writing that only Rust refuses.
import cases from './cases.json'
import * as rust from './rust/src/lib.js'
import * as ts from './ts/shared.ts'

const [lines] = cases.chats[0]! as [[string, string][], string[]]
console.log(`ts:   ${JSON.stringify(ts.chat(lines))}`)
console.log(`rust: ${JSON.stringify(rust.chat(lines))}`)
console.log(`read while writing`)
console.log(`  ts:   ${ts.readWhileWriting()}`)
try {
  rust.readWhileWriting()
} catch (error) {
  console.log(`  rust: panicked: ${(error as Error).message}`)
}
