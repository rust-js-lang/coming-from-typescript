// Chapter 2: `const` and `let`, as `rust/src/lib.rs` has `let` and `let mut`.

// A name made into a URL slug. Each step needs a name of its own: TypeScript
// won't declare `name` twice.
export function slug(name: string): string {
  const trimmed = name.trim()
  const lower = trimmed.toLowerCase()
  const dashed = lower.replaceAll(' ', '-')
  return dashed
}

// The total of some prices, in cents: `total` changes, so it's `let`.
export function total(prices: number[]): number {
  let total = 0
  for (const price of prices) {
    total += price
  }
  return total
}

// Adds an item to the cart it's given: the caller's array changes, and
// nothing in the signature says so.
export function addItem(cart: string[], item: string): void {
  cart.push(item)
}

// A new cart: the one it's given, and an item. `readonly` says the caller's
// is only read, if you remember to write it.
export function withItem(cart: readonly string[], item: string): string[] {
  return [...cart, item]
}
