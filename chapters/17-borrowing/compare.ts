// bun chapters/17-borrowing/compare.ts: removing short words, three ways.
import * as rust from './rust/src/lib.js'
import * as ts from './ts/borrowing.ts'

const words = () => ['a', 'b', 'long', 'is', 'ok', 'words']
const spliced = words()
ts.removeShortWithSplice(spliced, 3)
const backwards = words()
ts.removeShort(backwards, 3)
const retained = words()
rust.removeShort(retained, 3)
console.log(`remove the words shorter than 3 from ${JSON.stringify(words())}`)
console.log(`  ts, splice in forEach: ${JSON.stringify(spliced)}`)
console.log(`  ts, backwards:         ${JSON.stringify(backwards)}`)
console.log(`  rust, retain:          ${JSON.stringify(retained)}`)
