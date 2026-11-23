// Chapter 16: what TypeScript does where `rust/src/lib.rs` moves. Objects
// are shared by reference, so two names can see, and change, one value.

export interface Order {
  items: string[]
  count: number
}

// Turns a cart into an order. The order keeps the caller's array, so the
// caller can still change it.
export function checkout(cart: string[]): Order {
  return { items: cart, count: cart.length }
}

// Two orders from one cart: the first needs its own copy.
export function orderTwice(cart: string[]): [Order, Order] {
  return [checkout([...cart]), checkout(cart)]
}

export interface Point {
  x: number
  y: number
}

// A point and where it goes, both.
export function step(p: Point): [Point, Point] {
  return [p, { ...p, x: p.x + 1 }]
}

// Writes each line into a section, stopping at an empty one: `finally`
// closes the section, whichever way out it is.
function writeAll(log: string[], lines: string[]): void {
  log.push('open file')
  try {
    lines.forEach((line, i) => {
      if (line === '') throw new Error(`line ${i + 1} is empty`)
      log.push(`  ${line}`)
    })
  } finally {
    log.push('close file')
  }
}

// What `writeAll` did, in order, and how it ended.
export function save(lines: string[]): string[] {
  const log: string[] = []
  try {
    writeAll(log, lines)
    log.push('saved')
  } catch (error) {
    log.push(`failed: ${(error as Error).message}`)
  }
  return log
}
