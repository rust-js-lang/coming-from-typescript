// The TypeScript and the Rust rust-js compiled give what cases.json records
// native Rust giving. rust/tests/native.rs holds native Rust to the same
// cases.
import { expect, test } from 'bun:test'
import cases from './cases.json'
import * as rust from './rust/src/lib.js'
import * as ts from './ts/borrowing.ts'

for (const c of cases.words) {
  test(JSON.stringify(c.words), () => {
    expect(rust.letters(c.words)).toBe(c.letters)
    expect(ts.letters(c.words)).toBe(c.letters)
    for (const capitalizeAll of [rust.capitalizeAll, ts.capitalizeAll]) {
      const words = [...c.words]
      capitalizeAll(words)
      expect(words).toEqual(c.capitalized)
    }
    for (const removeShort of [rust.removeShort, ts.removeShort]) {
      const words = [...c.words]
      removeShort(words, 3)
      expect(words).toEqual(c.long)
    }
  })
}

for (const [answers, score] of cases.games as [boolean[], number][]) {
  test(`a game of ${JSON.stringify(answers)}`, () => {
    expect(rust.play(answers)).toBe(score)
    expect(ts.play(answers)).toBe(score)
  })
}

for (const [xs, swapped] of cases.swaps) {
  test(`swapping the halves of ${JSON.stringify(xs)}`, () => {
    for (const swapHalves of [rust.swapHalves, ts.swapHalves]) {
      const copy = [...xs]
      swapHalves(copy)
      expect(copy).toEqual(swapped)
    }
  })
}

test('splice inside forEach skips the word after each one it removes', () => {
  const words = ['a', 'b', 'long', 'is', 'ok', 'words']
  ts.removeShortWithSplice(words, 3)
  expect(words).toEqual(['b', 'long', 'ok', 'words'])
})

test('a &mut to a number is a box from TypeScript', () => {
  const score = { value: 5 }
  rust.addPoints(score, 10)
  expect(score).toEqual({ value: 15 })
})
