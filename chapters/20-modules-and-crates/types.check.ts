// What TypeScript sees of a crate's modules, checked by `tsc` (bun run
// types). Each `@ts-expect-error` must be needed, or tsc fails.
import type { Money } from './rust/src/lib.js'
import * as rustMoney from './rust/src/money.js'
import * as rustShop from './rust/src/shop.js'

// The crate's front door: `pub use money::Money` is the root's re-export of
// the type, and the same type as money.js's.
const sum: Money = rustShop.total([{ name: 'Fancy Mug', cents: 1250 }])
export const same: rustMoney.Money = sum
// Each module is a file with its own declarations.
export const shown: string = rustMoney.Money.format(sum)
// A `pub(crate)` method is the crate's alone: not declared.
// @ts-expect-error `cents` is pub(crate)
rustMoney.Money.cents(sum)
