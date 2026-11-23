// Chapter 7: a discriminated union, as `rust/src/lib.rs` has an enum.

export type Shape = { kind: 'circle'; radius: number } | { kind: 'square'; side: number } | { kind: 'point' }

// How much a shape covers. The `never` line makes TypeScript check that
// every kind is handled, if you remember to write it.
export function area(shape: Shape): number {
  switch (shape.kind) {
    case 'circle':
      return Math.PI * shape.radius * shape.radius
    case 'square':
      return shape.side * shape.side
    case 'point':
      return 0
    default: {
      const unhandled: never = shape
      return unhandled
    }
  }
}

// A shape twice as big, of the same kind.
export function doubled(shape: Shape): Shape {
  switch (shape.kind) {
    case 'circle':
      return { kind: 'circle', radius: shape.radius * 2 }
    case 'square':
      return { kind: 'square', side: shape.side * 2 }
    case 'point':
      return shape
  }
}

// A shape in words.
export function describe(shape: Shape): string {
  switch (shape.kind) {
    case 'circle':
      return shape.radius === 0 ? 'a circle of no size' : `a circle of radius ${shape.radius}`
    case 'square':
      return `a square of side ${shape.side}`
    case 'point':
      return 'a point'
  }
}
