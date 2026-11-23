// bun chapters/07-unions-are-enums/compare.ts: each shape, and what the
// TypeScript and the Rust (as rust-js compiled it) say of it.
import cases from './cases.json'
import * as rust from './rust/src/lib.js'
import * as ts from './ts/shapes.ts'

const shapeOf = (kind: string, size: number): ts.Shape =>
  kind === 'circle' ? { kind, radius: size } : kind === 'square' ? { kind, side: size } : { kind: 'point' }

for (const { kind, size } of cases) {
  const shape = shapeOf(kind, size)
  console.log(JSON.stringify(shape))
  console.log(`  ts:   ${ts.describe(shape)}, area ${ts.area(shape)}, doubled ${JSON.stringify(ts.doubled(shape))}`)
  console.log(`  rust: ${rust.describe(shape)}, area ${rust.area(shape)}, doubled ${JSON.stringify(rust.doubled(shape))}`)
}
