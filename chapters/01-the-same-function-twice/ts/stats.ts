// Chapter 1: the same function, twice. A little statistics module, as
// `rust/src/lib.rs` writes it in Rust.

// The mean of some numbers, or nothing if there are none.
export function mean(xs: number[]): number | undefined {
  if (xs.length === 0) {
    return undefined
  }
  let sum = 0
  for (const x of xs) {
    sum += x
  }
  return sum / xs.length
}

// The largest of some numbers, or nothing if there are none.
export function largest(xs: number[]): number | undefined {
  let largest: number | undefined = undefined
  for (const x of xs) {
    if (largest === undefined || x > largest) {
      largest = x
    }
  }
  return largest
}

// A sentence about some numbers.
export function describe(xs: number[]): string {
  const m = mean(xs)
  const l = largest(xs)
  if (m === undefined || l === undefined) {
    return 'no numbers'
  }
  return `${xs.length} numbers, mean ${m}, largest ${l}`
}
