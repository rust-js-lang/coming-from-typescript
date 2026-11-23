// The Rust rust-js compiled says what cases.json records native Rust saying
// of each text: lengths in bytes and in `char`s, and each operation done a
// `char` at a time. The TypeScript, a UTF-16 unit at a time, agrees on
// text that has none of two units, and these tests pin where it breaks
// one. rust/tests/native.rs holds native Rust to the same cases.
import { expect, test } from 'bun:test'
import cases from './cases.json'
import * as rust from './rust/src/lib.js'
import * as ts from './ts/strings.ts'

for (const { text, bytes, chars, initials, short, reversed, first } of cases) {
  test(JSON.stringify(text), () => {
    expect(rust.sizes(text)).toEqual([bytes, chars])
    expect(rust.initials(text)).toBe(initials)
    expect(rust.shorten(text, 4)).toBe(short)
    expect(rust.reverse(text)).toBe(reversed)
    expect(rust.firstWord(text)).toBe(first)
    // A code point count is the same in both: `[...text]` counts them too.
    expect(ts.sizes(text)[1]).toBe(chars)
  })
}

test('text of one UTF-16 unit a character: the TypeScript agrees', () => {
  for (const text of ['ada lovelace', 'naïve café']) {
    expect(ts.initials(text)).toBe(rust.initials(text))
    expect(ts.shorten(text, 4)).toBe(rust.shorten(text, 4))
    expect(ts.reverse(text)).toBe(rust.reverse(text))
  }
})

test("a character of two UTF-16 units: the TypeScript cuts it in half", () => {
  // `word[0]` is half of the emoji: a lone surrogate, not a character.
  expect(ts.initials('👋 hi there')).toBe('\ud83dHT')
  // `.length` counts the emoji as 2, so 4 "characters" are `👋 h`.
  expect(ts.shorten('👋 hi there', 4)).toBe('👋 h…')
  // `split('')` splits the emoji's two halves, and reversing swaps them.
  expect(ts.reverse('𝓐da')).toBe('ad\udcd0\ud835')
  expect(rust.reverse('𝓐da')).toBe('ad𝓐')
})

test('a letter and its accent are two chars, in both: neither knows graphemes', () => {
  // "école" written as `e` and a combining acute accent: reversed by code
  // point, the accent lands on the wrong letter, in Rust and in TypeScript.
  expect(rust.reverse('école')).toBe('eloće')
  expect(ts.reverse('école')).toBe('eloće')
})
