# 11. Maps and sets

## Familiar, mostly

TypeScript has `Map` and `Set`. Rust has `HashMap` and `HashSet`, and
they do the same jobs:

```rust
// rust/src/lib.rs
pub fn word_counts(text: &str) -> HashMap<String, u32> {
    let mut counts = HashMap::new();
    for word in text.split_whitespace() {
        *counts.entry(word.to_lowercase()).or_insert(0) += 1;
    }
    counts
}
```

`entry` is the one new tool. It finds a key's slot, filled or not, and
`or_insert(0)` fills an empty one, so counting is one line. TypeScript
writes `counts.set(key, (counts.get(key) ?? 0) + 1)`.

rust-js writes a `HashMap` as a JavaScript `Map`, declared
`Map<string, number>`, so a TypeScript caller uses it as one:

```
word counts of "the cat and the hat": Map(4) {
  "the": 2,
  "cat": 1,
  "and": 1,
  "hat": 1,
}
```

Two differences are worth a chapter: what makes two keys the same, and
what order the keys come in.

## A key is equal by what's in it

Count the places a walk visits, a point being `[x, y]`. The TypeScript
that looks right is wrong:

```ts
// ts/maps.ts
const seen = new Set<[number, number]>()
// ..
at = [at[0] + dx, at[1] + dy]
seen.add(at)
```

A JavaScript `Set` compares objects by *which object* they are, like
`===` (chapter 6). Every step makes a new array, so every step is a new
place, even back where it started. The usual fix is to make the key a
string, `` `${x},${y}` ``, and hope every place builds it the same way.

Rust's `HashSet` compares keys with `==`, which compares what's in them:

```rust
pub fn places_visited(steps: &[(i32, i32)]) -> usize {
    let mut seen = HashSet::new();
    let mut at = (0, 0);
    seen.insert(at);
    for (dx, dy) in steps {
        at = (at.0 + dx, at.1 + dy);
        seen.insert(at);
    }
    seen.len()
}
```

`(1, 0)` is `(1, 0)`, whichever value it is. Any type that derives `Eq`
and `Hash` can be a key the same way, structs included:

```
walk [[1,0],[0,1],[-1,0],[0,-1]]
  ts, Set of [x, y]:     5
  ts, Set of "x,y":      4
  rust, HashSet<(x, y)>: 4
```

rust-js keeps that meaning in JavaScript. The `HashSet<(i32, i32)>`
becomes a `$KeySet`, a set of rust-js's runtime that compares keys by
value. A `HashMap<String, u32>` needs nothing special, since JavaScript
already compares strings by value, so it's a plain `Map`.

## A `HashMap` has no order

A JavaScript `Map` remembers the order keys were added. A Rust `HashMap`
doesn't, on purpose: its order is whatever its hashing gives, and it
changes from run to run. Counting the same text three times, then
listing the counts:

```
[("cat", 1), ("hat", 1), ("the", 2), ("and", 1)]
[("cat", 1), ("the", 2), ("and", 1), ("hat", 1)]
[("the", 2), ("and", 1), ("hat", 1), ("cat", 1)]
```

When order matters, ask for one:

- **`BTreeMap` and `BTreeSet`** keep their keys sorted, always.
  `sorted_counts` uses one, and its counts come out in alphabetical
  order.
- **Sort when you're done**: collect into a `Vec` and `.sort()`.
- **The `indexmap` crate** keeps the order keys were added, like
  JavaScript's `Map`.

rust-js's `HashMap` is a JavaScript `Map`, so it happens to keep the
order keys were added. Don't count on it: the same Rust code compiled
natively won't. `compare.test.ts` sorts before it compares.

## Sets do set things

```rust
pub fn shared_tags(a: &[String], b: &[String]) -> Vec<String> {
    let a: BTreeSet<&String> = a.iter().collect();
    let b: BTreeSet<&String> = b.iter().collect();
    a.intersection(&b).map(|tag| tag.to_string()).collect()
}
```

`intersection`, `union`, `difference` and `is_subset` are built in.
JavaScript only gained these in 2024 (`Set.prototype.intersection`), and
TypeScript code mostly still writes the `filter` by hand.

## Where it's different

- **Tuples.** `(String, u32)` is a value of two things, declared
  `[string, number]` in TypeScript. `sorted_counts` returns a `Vec` of
  them, and `most_common` an `Option` of one.
- **Getting a value.** `map.get(&key)` returns an `Option<&V>` (chapter
  8), and `map[&key]` panics if it's missing, the same pair as a
  `Vec`'s `get` and `[i]`.
- **Objects as maps.** TypeScript code often uses a plain object,
  `Record<string, number>`, as a map. In Rust, a struct's fields are
  fixed when you write it (chapter 6); for keys you don't know ahead, a
  map is the only choice.

## Try it

In `sorted_counts`, change `BTreeMap::new()` to `HashMap::new()` and run
`cargo test` a few times. It fails, and the list it got comes in a
different order each run. Then change it back: the sorted map is the
promise; the `HashMap` was a coincidence waiting to break.
