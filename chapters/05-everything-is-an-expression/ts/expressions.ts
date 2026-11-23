// Chapter 5: statements, and the ternary, as TypeScript has them, beside
// `rust/src/lib.rs`.

// A letter grade: a `switch` can't be a value, so each case returns.
export function grade(score: number): string {
  switch (true) {
    case score >= 90 && score <= 100:
      return 'A'
    case score >= 80 && score <= 89:
      return 'B'
    case score >= 70 && score <= 79:
      return 'C'
    case score >= 0 && score <= 69:
      return 'F'
    default:
      return 'not a score'
  }
}

// Shipping, in cents: an `if` can't be a value, so it's the ternary.
export function shipping(total: number, express: boolean): number {
  const base = total >= 5000 ? 0 : 499
  return base + (express ? 1000 : 0)
}

// Where the first number below zero is.
export function firstNegative(xs: number[]): number | undefined {
  for (let i = 0; i < xs.length; i++) {
    if (xs[i]! < 0) return i
  }
  return undefined
}

// A sentence about a number: a block isn't a value, so `size` is a `let`
// assigned in branches, or an arrow called at once.
export function describe(n: number): string {
  const size = (() => {
    const distance = Math.abs(n)
    return distance < 10 ? 'small' : 'large'
  })()
  const sign = n === 0 ? 'zero' : n < 0 ? 'negative' : 'positive'
  return `${n} is ${size} and ${sign}`
}
