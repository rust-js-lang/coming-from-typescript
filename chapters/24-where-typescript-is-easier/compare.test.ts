// The TypeScript and the Rust rust-js compiled give what cases.json records
// native Rust giving. rust/tests/native.rs holds native Rust to the same
// cases.
import { expect, test } from 'bun:test'
import cases from './cases.json'
import * as rust from './rust/src/lib.js'
import * as ts from './ts/easier.ts'

const ada = { name: 'Ada', email: 'ada@example.com', age: 36 }
const edges: [string, string][] = [
  ['src', 'repo'],
  ['lib.rs', 'src'],
  ['tests', 'repo'],
  ['native.rs', 'tests'],
]

for (const [name, greeting, said] of cases.greetings as [string, string | null, string][]) {
  test(`greeting ${name}`, () => {
    // A trailing `Option` is an optional parameter: left out, or given.
    expect(greeting === null ? rust.greet(name) : rust.greet(name, greeting)).toBe(said)
    expect(greeting === null ? ts.greet(name) : ts.greet(name, greeting)).toBe(said)
  })
}

for (const [name, email, age, [n, e, a]] of cases.patches as [string | null, string | null, number | null, [string, string, number]][]) {
  test(`patching ${JSON.stringify({ name, email, age })}`, () => {
    // The same object literal is a `UserPatch` and a `Partial<User>`.
    const patch = { ...(name !== null && { name }), ...(email !== null && { email }), ...(age !== null && { age }) }
    expect(rust.update(ada, patch)).toEqual({ name: n, email: e, age: a })
    expect(ts.update(ada, patch)).toEqual({ name: n, email: e, age: a })
  })
}

for (const [start, path] of cases.paths as [string, string[]][]) {
  test(`from ${start} to the root`, () => {
    expect(rust.pathToRoot(edges, start)).toEqual(path)
    expect(ts.pathToRoot(edges, start)).toEqual(path)
  })
}
