// What TypeScript sees of maps and tuples, checked by `tsc` (bun run
// types). Each `@ts-expect-error` must be needed, or tsc fails.
import * as rust from './rust/src/lib.js'

// A `HashMap<String, u32>` is a `Map<string, number>`.
const counts: Map<string, number> = rust.wordCounts('the cat')
export const cats: number = counts.get('cat') ?? 0
// A tuple `(String, u32)` is a TypeScript tuple, `[string, number]`.
const best = rust.mostCommon('the cat and the hat')
export const word: string = best === undefined || best === null ? '' : best[0]
// @ts-expect-error the second is a number
export const wrong: string = best![1]
