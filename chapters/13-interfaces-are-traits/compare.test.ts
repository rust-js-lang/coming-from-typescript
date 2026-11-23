// The TypeScript and the Rust rust-js compiled give what cases.json records
// native Rust giving. rust/tests/native.rs holds native Rust to the same
// cases.
import { expect, test } from 'bun:test'
import cases from './cases.json'
import * as rust from './rust/src/lib.js'
import * as ts from './ts/shapes.ts'

for (const c of cases) {
  test(`circles ${JSON.stringify(c.circles)}, squares ${JSON.stringify(c.squares)}`, () => {
    const circles = c.circles.map((radius) => ({ radius }))
    const squares = c.squares.map((side) => ({ side }))
    expect(rust.garden(circles, squares)).toEqual(c.garden)
    expect(ts.garden(c.circles, c.squares)).toEqual(c.garden)
    // An `impl Shape` is passed with its dictionary: `circleShape`, `squareShape`.
    const areas = [...circles.map((x) => rust.areaOf(x, rust.circleShape)), ...squares.map((x) => rust.areaOf(x, rust.squareShape))]
    expect(areas).toEqual(c.areas)
    expect(c.circles.map((r) => new ts.Circle(r).area()).concat(c.squares.map((s) => new ts.Square(s).area()))).toEqual(c.areas)
    expect(circles.map(rust.show)).toEqual(c.shown)
    expect(c.circles.map((r) => `${new ts.Circle(r)}`)).toEqual(c.shown)
  })
}

test('an impl is a dictionary of functions, the value passed in', () => {
  expect(rust.circleShape.name({ radius: 1 })).toBe('circle')
  expect(rust.squareShape.describe({ side: 2 })).toBe('a 2 by 2 square')
})

test('a structural interface takes an invoice as a shape', () => {
  expect(ts.describedInvoice).toBe('a invoice of area 0.00')
})

test('a newtype is a one-item array', () => {
  expect(rust.speed([100], [9.58])).toBe(100 / 9.58)
})
