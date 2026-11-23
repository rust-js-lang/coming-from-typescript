// The TypeScript and the Rust rust-js compiled give what cases.json records
// native Rust giving. rust/tests/native.rs holds native Rust to the same
// cases.
import { expect, test } from 'bun:test'
import cases from './cases.json'
import * as rust from './rust/src/lib.js'
import * as ts from './ts/generics.ts'

const byKey = <V>(map: Map<number, V>) => [...map].sort(([a], [b]) => a - b)

for (const { scores, highest } of cases.scores) {
  test(`the highest of ${JSON.stringify(scores)}`, () => {
    expect(rust.highest(scores) ?? null).toBe(highest)
    expect(ts.highest(scores) ?? null).toBe(highest)
  })
}

for (const { words, by_length, last_letters } of cases.words) {
  test(`the words ${JSON.stringify(words)}`, () => {
    expect<unknown>(byKey(rust.byLength(words))).toEqual(by_length)
    expect<unknown>(byKey(ts.byLength(words))).toEqual(by_length)
    expect(words.map((w) => rust.lastLetter(w) ?? null)).toEqual(last_letters)
    expect(words.map((w) => ts.lastLetter(w) ?? null)).toEqual(last_letters)
  })
}

for (const { text, balanced } of cases.brackets) {
  test(`${JSON.stringify(text)} is ${balanced ? '' : 'not '}balanced`, () => {
    expect(rust.balanced(text)).toBe(balanced)
    expect(ts.balanced(text)).toBe(balanced)
  })
}

test("TypeScript's `>` on objects is always false: the first one wins", () => {
  expect(ts.largest([{ cents: 300 }, { cents: 900 }])).toEqual({ cents: 300 })
})

test("a generic struct is a plain object, its methods on `Stack`", () => {
  const stack = rust.Stack.new<string>()
  rust.Stack.push(stack, 'a')
  rust.Stack.push(stack, 'b')
  expect(stack).toEqual({ items: ['a', 'b'] })
  expect(rust.Stack.pop(stack)).toBe('b')
  expect(rust.Stack.peek(stack)).toBe('a')
})
