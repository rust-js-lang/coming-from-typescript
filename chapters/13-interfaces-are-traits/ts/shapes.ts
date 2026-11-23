// Chapter 13: interfaces, as TypeScript has them, beside `rust/src/lib.rs`'s
// traits. An interface is structural: anything of the right shape is one.

export interface Shape {
  area(): number
  name(): string
}

export class Circle implements Shape {
  constructor(readonly radius: number) {}
  area() {
    return Math.PI * this.radius * this.radius
  }
  name() {
    return 'circle'
  }
  toString() {
    return `circle(r=${this.radius})`
  }
}

export class Square implements Shape {
  constructor(readonly side: number) {}
  area() {
    return this.side * this.side
  }
  name() {
    return 'square'
  }
}

// A shape in words. Square has its own, as Rust's overrides the default.
export function describe(shape: Shape): string {
  if (shape instanceof Square) return `a ${shape.side} by ${shape.side} square`
  return `a ${shape.name()} of area ${shape.area().toFixed(2)}`
}

// A garden's beds, round and square in one list.
export function garden(circles: number[], squares: number[]): string[] {
  const beds: Shape[] = [...circles.map((r) => new Circle(r)), ...squares.map((s) => new Square(s))]
  return beds.map(describe)
}

// Anything with `area` and `name` is a Shape, whether it meant to be or not.
export const invoice = { area: () => 0, name: () => 'invoice', total: 120 }
export const describedInvoice: string = describe(invoice)

// A distance, and a time: both just numbers, so either fits either.
export type Meters = number
export type Seconds = number
export function speed(distance: Meters, time: Seconds): number {
  return distance / time
}
