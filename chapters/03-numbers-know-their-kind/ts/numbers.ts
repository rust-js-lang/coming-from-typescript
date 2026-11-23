// Chapter 3: one `number` does it all, as a TypeScript developer would write
// these, beside `rust/src/lib.rs`.

// Splits `n` things between two: how many each gets, and what's left.
export function share(n: number): [number, number] {
  return [Math.floor(n / 2), n % 2]
}

// One more box on a shelf that holds at most 255: undefined if it's full.
export function addBox(boxes: number): number | undefined {
  return boxes < 255 ? boxes + 1 : undefined
}

// A count typed into a form: `parseInt`, as it's usually written.
export function parseCount(text: string): number | undefined {
  const n = Number.parseInt(text, 10)
  return Number.isNaN(n) ? undefined : n
}

// An order's id, as the database gives it.
export function parseId(text: string): number | undefined {
  const n = Number(text)
  return Number.isNaN(n) ? undefined : n
}

// The id after it.
export function nextId(id: number): number {
  return id + 1
}

// A brightness from 0 to 255, of a float.
export function brightness(level: number): number {
  return Math.min(255, Math.max(0, Math.trunc(level)))
}
