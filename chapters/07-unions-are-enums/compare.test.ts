// The TypeScript and the Rust rust-js compiled give what cases.json records
// native Rust giving, of the very same objects: rust-js's enum is
// TypeScript's discriminated union, `{ kind: "circle", radius }`.
// rust/tests/native.rs holds native Rust to the same cases.
import { expect, test } from 'bun:test'
import cases from './cases.json'
import * as rust from './rust/src/lib.js'
import * as ts from './ts/shapes.ts'

const shapeOf = (kind: string, size: number): ts.Shape =>
  kind === 'circle' ? { kind, radius: size } : kind === 'square' ? { kind, side: size } : { kind: 'point' }

for (const { kind, size, area, doubled, describe } of cases) {
  test(describe, () => {
    const shape = shapeOf(kind, size)
    expect(rust.area(shape)).toBe(area)
    expect(ts.area(shape)).toBe(area)
    expect(rust.doubled(shape)).toEqual(shapeOf(kind, doubled))
    expect(ts.doubled(shape)).toEqual(shapeOf(kind, doubled))
    expect(rust.describe(shape)).toBe(describe)
    expect(ts.describe(shape)).toBe(describe)
  })
}
