// The TypeScript and the Rust rust-js compiled give what cases.json records
// native Rust giving. rust/tests/native.rs holds native Rust to the same
// cases.
import { expect, test } from 'bun:test'
import cases from './cases.json'
import * as rust from './rust/src/lib.js'
import * as ts from './ts/maps.ts'

const byKey = (entries: Iterable<[string, number]>) => [...entries].sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))

for (const { text, sorted_counts, most_common } of cases.texts) {
  test(`the words of ${JSON.stringify(text)}`, () => {
    // A HashMap is a Map: its order is no promise, so sorted to compare.
    expect(rust.wordCounts(text)).toBeInstanceOf(Map)
    expect(byKey(rust.wordCounts(text))).toEqual(sorted_counts as [string, number][])
    expect(byKey(ts.wordCounts(text))).toEqual(sorted_counts as [string, number][])
    expect(rust.sortedCounts(text)).toEqual(sorted_counts as [string, number][])
    expect(ts.sortedCounts(text)).toEqual(sorted_counts as [string, number][])
    expect<unknown>(rust.mostCommon(text) ?? null).toEqual(most_common)
    expect<unknown>(ts.mostCommon(text) ?? null).toEqual(most_common)
  })
}

for (const { steps, places_visited } of cases.walks) {
  test(`the walk ${JSON.stringify(steps)}`, () => {
    const walk = steps as [number, number][]
    expect(rust.placesVisited(walk)).toBe(places_visited)
    expect(ts.placesVisited(walk)).toBe(places_visited)
    // A Set of arrays counts every step's array as a new place.
    expect(ts.placesVisitedNaive(walk)).toBe(walk.length + 1)
  })
}

for (const { a, b, shared } of cases.tags) {
  test(`the tags ${JSON.stringify(a)} and ${JSON.stringify(b)} share`, () => {
    expect(rust.sharedTags(a, b)).toEqual(shared)
    expect(ts.sharedTags(a, b)).toEqual(shared)
  })
}
