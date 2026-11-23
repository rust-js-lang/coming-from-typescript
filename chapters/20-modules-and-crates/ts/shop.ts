// A shop's items, their total, and a receipt.
import { toKebabCase } from './kebab.ts'
import { Money } from './money.ts'

export interface Item {
  name: string
  cents: number
}

// What the items cost together.
export const total = (items: readonly Item[]) => Money.fromCents(items.reduce((sum, item) => sum + item.cents, 0))

// A line for each item, its code made from its name, and the total.
export function receipt(items: readonly Item[]): string[] {
  const sum = total(items)
  return [
    ...items.map((item) => `${toKebabCase(item.name)} ${Money.fromCents(item.cents).format()}`),
    `total ${sum.format()} (${sum.cents()} cents)`,
  ]
}
