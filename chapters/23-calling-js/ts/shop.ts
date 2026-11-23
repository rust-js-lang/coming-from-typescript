// The same shop in TypeScript, beside `rust/src/lib.rs`, using the same
// `formatMoney`.
import { formatMoney } from './currency.ts'

export interface Item {
  name: string
  price: number
}

export const total = (items: readonly Item[]) => items.reduce((sum, item) => sum + item.price, 0)

export const discounted = (items: readonly Item[], rule: (item: Item) => number) =>
  items.reduce((sum, item) => sum + item.price - Math.min(rule(item), item.price), 0)

export const receipt = (items: readonly Item[], currency: string) => [
  ...items.map((item) => `${item.name} ${formatMoney(item.price, currency)}`),
  `total ${formatMoney(total(items), currency)}`,
]
