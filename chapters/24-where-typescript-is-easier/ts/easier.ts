// Chapter 24: the same three things in TypeScript, each a line or two.

// 1. A default argument.
export const greet = (name: string, greeting = 'Hello') => `${greeting}, ${name}!`

export interface User {
  name: string
  email: string
  age: number
}

// 2. `Partial<User>`, made from `User` by the type system, and a spread.
export const update = (user: User, patch: Partial<User>): User => ({ ...user, ...patch })

// 3. Objects that point at each other: each node holds its parent.
interface Node {
  name: string
  parent?: Node
}

// From `start` up to the root, given each `[child, parent]` pair.
export function pathToRoot(edges: readonly [string, string][], start: string): string[] {
  const nodes = new Map<string, Node>()
  const node = (name: string) => nodes.get(name) ?? nodes.set(name, { name }).get(name)!
  for (const [child, parent] of edges) node(child).parent = node(parent)
  const path: string[] = []
  for (let at = nodes.get(start); at; at = at.parent) path.push(at.name)
  return path
}
