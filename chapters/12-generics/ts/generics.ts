// Chapter 12: TypeScript's generics, beside `rust/src/lib.rs`'s. A type
// parameter here is erased: it says nothing about what a `T` can do.

// The largest item, if there are any. TypeScript lets `>` compare any two
// `T`s, objects too, where it's always false.
export function largest<T>(xs: readonly T[]): T | undefined {
  if (xs.length === 0) return undefined
  let best: T = xs[0]!
  for (const x of xs) if (x > best) best = x
  return best
}

export const highest = (scores: readonly number[]) => largest(scores)
export const lastLetter = (word: string) => largest([...word])

// Items grouped by a key.
export function groupBy<T, K>(items: readonly T[], key: (item: T) => K): Map<K, T[]> {
  const groups = new Map<K, T[]>()
  for (const item of items) {
    const k = key(item)
    const group = groups.get(k)
    if (group) group.push(item)
    else groups.set(k, [item])
  }
  return groups
}

// Words grouped by their length.
export const byLength = (words: readonly string[]) => groupBy(words, (word) => [...word].length)

// A stack of anything: a generic class.
export class Stack<T> {
  items: T[] = []
  push(item: T) {
    this.items.push(item)
  }
  pop(): T | undefined {
    return this.items.pop()
  }
  peek(): T | undefined {
    return this.items.at(-1)
  }
}

const partners: Record<string, string> = { ')': '(', ']': '[', '}': '{' }

// Whether every bracket in `text` is closed by its partner, in order.
export function balanced(text: string): boolean {
  const open = new Stack<string>()
  for (const c of text) {
    if ('([{'.includes(c)) open.push(c)
    else if (c in partners && open.pop() !== partners[c]) return false
  }
  return open.peek() === undefined
}
