// bun chapters/13-interfaces-are-traits/compare.ts: a garden, both ways,
// and what each side accepts as a shape.
import * as rust from './rust/src/lib.js'
import * as ts from './ts/shapes.ts'

console.log(`garden of a circle r=1 and a square of side 3`)
console.log(`  ts:   ${JSON.stringify(ts.garden([1], [3]))}`)
console.log(`  rust: ${JSON.stringify(rust.garden([{ radius: 1 }], [{ side: 3 }]))}`)
console.log(`an invoice with area() and name(), described as a shape`)
console.log(`  ts:   ${ts.describedInvoice}`)
console.log(`  rust: won't compile: the trait bound Invoice: Shape is not satisfied`)
console.log(`speed of 100 m in 9.58 s, arguments swapped`)
console.log(`  ts:   ${ts.speed(9.58, 100)}  (both are numbers)`)
console.log(`  rust: won't compile: arguments to this function are incorrect`)
