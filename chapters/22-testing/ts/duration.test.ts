// The TypeScript's unit tests, beside lib.rs's `mod tests`: a test file of
// its own, which can only reach what duration.ts exports.
import { expect, test } from 'bun:test'
import { parseDuration, share } from './duration.ts'

test('hours and minutes add up', () => {
  expect(parseDuration('1h30m')).toBe(5400)
})

test('a bad unit says which', () => {
  expect(() => parseDuration('5x')).toThrow("unknown unit 'x'")
})

test('2m5s', () => {
  expect(parseDuration('2m5s')).toBe(125)
})

test('sharing among nobody is Infinity, not an error', () => {
  expect(share(60, 0)).toBe(Infinity)
})
