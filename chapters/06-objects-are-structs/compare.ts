// bun chapters/06-objects-are-structs/compare.ts: equality, and Debug.
import * as rust from './rust/src/lib.js'
import * as ts from './ts/shapes.ts'

const a = rust.Rect.new(0, 0, 2, 3)
const b = rust.Rect.new(0, 0, 2, 3)
console.log(`two rectangles of the same corner and size`)
console.log(`  ts:   same(a, b) is ${ts.same(a, b)}   (=== asks: the same object?)`)
console.log(`  rust: same(a, b) is ${rust.same(a, b)}    (== asks: the same contents?)`)
console.log(`debug(a): ${rust.debug(a)}`)
