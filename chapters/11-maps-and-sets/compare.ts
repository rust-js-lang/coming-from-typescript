// bun chapters/11-maps-and-sets/compare.ts: a walk's places, counted by a
// `Set` of arrays, by a `Set` of strings, and by Rust's `HashSet` of tuples.
import cases from './cases.json'
import * as rust from './rust/src/lib.js'
import * as ts from './ts/maps.ts'

for (const { steps } of cases.walks) {
  const walk = steps as [number, number][]
  console.log(`walk ${JSON.stringify(walk)}`)
  console.log(`  ts, Set of [x, y]:     ${ts.placesVisitedNaive(walk)}`)
  console.log(`  ts, Set of "x,y":      ${ts.placesVisited(walk)}`)
  console.log(`  rust, HashSet<(x, y)>: ${rust.placesVisited(walk)}`)
}
console.log(`word counts of "the cat and the hat":`, rust.wordCounts('the cat and the hat'))
