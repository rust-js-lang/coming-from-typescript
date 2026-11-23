// The TypeScript and the Rust rust-js compiled give what cases.json records
// native Rust giving. rust/tests/native.rs holds native Rust to the same
// cases.
import { expect, test } from 'bun:test'
import cases from './cases.json'
import * as rust from './rust/src/lib.js'
import * as ts from './ts/shared.ts'

for (const [lines, log] of cases.chats as [[string, string][], string[]][]) {
  test(`a chat of ${lines.length} lines`, () => {
    expect(rust.chat(lines)).toEqual(log)
    expect(ts.chat(lines)).toEqual(log)
  })
}

for (const [n, gone, count] of cases.owners) {
  test(`${n} join and ${gone} leave: ${count} own the room`, () => {
    expect(rust.owners(n!, gone!)).toBe(count!)
  })
}

test('a RefCell refuses a writer while it lends a reader, as native Rust does', () => {
  expect(() => rust.readWhileWriting()).toThrow('RefCell already borrowed')
  expect(ts.readWhileWriting()).toBe(2)
})
