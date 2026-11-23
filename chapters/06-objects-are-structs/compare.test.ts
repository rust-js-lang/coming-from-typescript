// The TypeScript and the Rust rust-js compiled give what cases.json records
// native Rust giving, case by case. A struct is a plain JS object, the
// same shape the interface describes, so each side's functions take the
// other's rectangles. rust/tests/native.rs holds native Rust to the same.
import { expect, test } from 'bun:test'
import cases from './cases.json'
import * as rust from './rust/src/lib.js'
import * as ts from './ts/shapes.ts'

const flat = (r: ts.Rect) => [r.corner.x, r.corner.y, r.width, r.height]

for (const { rect: [x, y, w, h], point: [px, py], area, contains, moved, grown, debug } of cases) {
  test(`a rectangle at ${x},${y}, ${w} by ${h}`, () => {
    const r = rust.Rect.new(x!, y!, w!, h!)
    const t = ts.newRect(x!, y!, w!, h!)
    // The same plain object, made either way.
    expect(r).toEqual(t)
    expect(rust.Rect.area(r)).toBe(area)
    expect(ts.area(r)).toBe(area)
    expect(rust.Rect.contains(t, { x: px!, y: py! })).toBe(contains)
    expect(ts.contains(r, { x: px!, y: py! })).toBe(contains)
    expect(flat(rust.Rect.moved(r, 1, 2))).toEqual(moved)
    expect(flat(ts.moved(t, 1, 2))).toEqual(moved)
    // `grow` changes the rectangle it's given, on both sides.
    rust.Rect.grow(r, 1)
    ts.grow(t, 1)
    expect(flat(r)).toEqual(grown)
    expect(flat(t)).toEqual(grown)
    expect(rust.debug(rust.Rect.new(x!, y!, w!, h!))).toBe(debug)
  })
}

test('== compares contents; === which object it is', () => {
  const a = rust.Rect.new(0, 0, 2, 3)
  const b = rust.Rect.new(0, 0, 2, 3)
  expect(rust.same(a, b)).toBe(true)
  expect(ts.same(a, b)).toBe(false)
  expect(ts.same(a, a)).toBe(true)
  expect(rust.same(a, rust.Rect.moved(a, 1, 0))).toBe(false)
})
