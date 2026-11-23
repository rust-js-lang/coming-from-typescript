// Chapter 11: `Map` and `Set`, as TypeScript has them, beside
// `rust/src/lib.rs`'s `HashMap`, `BTreeMap` and `HashSet`.

// How many times each word appears.
export function wordCounts(text: string): Map<string, number> {
  const counts = new Map<string, number>()
  for (const word of text.split(/\s+/).filter(Boolean)) {
    const key = word.toLowerCase()
    counts.set(key, (counts.get(key) ?? 0) + 1)
  }
  return counts
}

// The same counts, in alphabetical order: a `Map` keeps the order keys
// were added in, so sort.
export function sortedCounts(text: string): [string, number][] {
  return [...wordCounts(text)].sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
}

// The word that appears most, the first in the alphabet of any tie.
export function mostCommon(text: string): [string, number] | undefined {
  let best: [string, number] | undefined
  for (const entry of sortedCounts(text)) {
    if (best === undefined || entry[1] > best[1]) best = entry
  }
  return best
}

// How many different places a walk visits, the way that looks right: a
// `Set` of `[x, y]` arrays. Each array is a new object, so each is new to
// the `Set`, even at a place it has seen.
export function placesVisitedNaive(steps: [number, number][]): number {
  const seen = new Set<[number, number]>()
  let at: [number, number] = [0, 0]
  seen.add(at)
  for (const [dx, dy] of steps) {
    at = [at[0] + dx, at[1] + dy]
    seen.add(at)
  }
  return seen.size
}

// The same, the way that works: a key made a string, `"x,y"`.
export function placesVisited(steps: [number, number][]): number {
  const seen = new Set<string>(['0,0'])
  let [x, y] = [0, 0]
  for (const [dx, dy] of steps) {
    x += dx
    y += dy
    seen.add(`${x},${y}`)
  }
  return seen.size
}

// The tags two posts share, in order.
export function sharedTags(a: string[], b: string[]): string[] {
  const other = new Set(b)
  return [...new Set(a)].filter((tag) => other.has(tag)).sort()
}
