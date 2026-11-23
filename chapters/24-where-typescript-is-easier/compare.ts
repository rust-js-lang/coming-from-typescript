// bun chapters/24-where-typescript-is-easier/compare.ts: the three, both ways.
import * as rust from './rust/src/lib.js'
import * as ts from './ts/easier.ts'

const ada = { name: 'Ada', email: 'ada@example.com', age: 36 }
const edges: [string, string][] = [
  ['src', 'repo'],
  ['lib.rs', 'src'],
]
console.log(`greet("Ada")            ts: ${ts.greet('Ada')}   rust: ${rust.greet('Ada')}`)
console.log(`update(ada, { age: 37 }) ts: ${ts.update(ada, { age: 37 }).age}   rust: ${rust.update(ada, { age: 37 }).age}`)
console.log(`pathToRoot("lib.rs")    ts: ${ts.pathToRoot(edges, 'lib.rs')}   rust: ${rust.pathToRoot(edges, 'lib.rs')}`)
