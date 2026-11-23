// Chapter 10: array methods, as TypeScript has them, beside
// `rust/src/lib.rs`'s iterators.

export interface Student {
  name: string
  score: number
}

// The names of those who passed: `filter` builds one array, `map` another.
export function passing(students: Student[]): string[] {
  return students.filter((s) => s.score >= 50).map((s) => s.name)
}

// The `n` best scores, best first.
export function top(scores: number[], n: number): number[] {
  return [...scores].sort((a, b) => b - a).slice(0, n)
}

// The first `n` squares past `limit`. An array can't be endless, so it's a loop.
export function squaresPast(limit: number, n: number): number[] {
  const found: number[] = []
  for (let x = 1; found.length < n; x++) {
    if (x * x > limit) found.push(x * x)
  }
  return found
}

// Each total so far.
export function runningTotals(xs: number[]): number[] {
  let total = 0
  return xs.map((x) => (total += x))
}

// How much each step went up or down.
export function changes(xs: number[]): number[] {
  return xs.slice(1).map((x, i) => x - xs[i]!)
}

// The item at `i`: `undefined` past the end, typed `number` unless
// `noUncheckedIndexedAccess` is on.
export function item(xs: number[], i: number): number | undefined {
  return xs[i]
}
