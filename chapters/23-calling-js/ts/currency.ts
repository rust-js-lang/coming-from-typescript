// Chapter 23: TypeScript the Rust calls. `Intl.NumberFormat` knows every
// currency's symbol and its digits; the Rust uses it rather than redo it.

// An amount in a currency's smallest unit, as people write it: `$12.50`,
// `¥1,250`, `€3.00`.
export function formatMoney(minor: number, currency: string): string {
  const format = new Intl.NumberFormat('en-US', { style: 'currency', currency })
  const digits = format.resolvedOptions().maximumFractionDigits ?? 2
  return format.format(minor / 10 ** digits)
}
