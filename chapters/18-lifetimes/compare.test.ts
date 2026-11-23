// The TypeScript and the Rust rust-js compiled give what cases.json records
// native Rust giving. rust/tests/native.rs holds native Rust to the same
// cases.
import { expect, test } from 'bun:test'
import cases from './cases.json'
import * as rust from './rust/src/lib.js'
import * as ts from './ts/lifetimes.ts'

for (const [text, word] of cases.words) {
  test(`the first word of ${JSON.stringify(text)}`, () => {
    expect(rust.firstWord(text!)).toBe(word!)
    expect(ts.firstWord(text!)).toBe(word!)
  })
}

for (const [a, b, longer] of cases.longest) {
  test(`the longer of ${a} and ${b}`, () => {
    expect(rust.longest(a!, b!)).toBe(longer!)
    expect(ts.longest(a!, b!)).toBe(longer!)
  })
}

for (const [text, word, found] of cases.mentions as [string, string, string[]][]) {
  test(`the sentences of ${JSON.stringify(text)} that mention ${word}`, () => {
    expect(rust.mentions(text, word)).toEqual(found)
    expect(ts.mentions(text, word)).toEqual(found)
  })
}

for (const [config, found] of cases.pairs as [string, [string, string][]][]) {
  test(`the pairs of ${JSON.stringify(config)}`, () => {
    expect(rust.pairs(config)).toEqual(found)
    expect(ts.pairs(config)).toEqual(found)
  })
}

test("'static is just a string", () => {
  expect(rust.version()).toBe('1.0')
})
