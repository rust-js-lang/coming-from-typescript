// What TypeScript sees across the boundary, checked by `tsc` (bun run
// types). Each `@ts-expect-error` must be needed, or tsc fails.
import * as rust from './rust/src/lib.js'

const items: rust.Item[] = [{ name: 'tea', price: 350 }]
// A closure parameter is a function type, its parameter named and typed.
export const off: number = rust.discounted(items, (item) => item.price / 10)
// @ts-expect-error the rule gives a number, not a string
rust.discounted(items, () => 'ten')
// The binding is the crate's own: it isn't exported.
// @ts-expect-error `formatMoney` is a private binding
rust.formatMoney(350, 'USD')
