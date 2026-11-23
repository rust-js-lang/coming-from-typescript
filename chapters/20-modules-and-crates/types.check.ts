// What TypeScript sees of a crate's modules, checked by `tsc` (bun run
// types). Each `@ts-expect-error` must be needed, or tsc fails.
import * as rustMoney from './rust/src/money.js'
import * as rustShop from './rust/src/shop.js'

// Each module is a file with its own declarations.
const sum: rustMoney.Money = rustShop.total([{ name: 'Fancy Mug', cents: 1250 }])
export const shown: string = rustMoney.Money.format(sum)
// A `pub(crate)` method is the crate's alone: not declared.
// @ts-expect-error `cents` is pub(crate)
rustMoney.Money.cents(sum)
