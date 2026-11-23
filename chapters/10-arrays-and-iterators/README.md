# 10. Arrays and iterators

## Two kinds of array

TypeScript has one array, `T[]`. Rust has two you'll meet every day:

- **`Vec<T>`** owns its items. It can grow, shrink, and is dropped when
  its owner is done with it. It's what you return when you make a new
  list.
- **`&[T]`**, a *slice*, borrows a run of items someone else owns. It's
  what you take when you only need to read: a `Vec`, a fixed array
  `[T; N]`, or part of either, all lend you one.

```rust
// rust/src/lib.rs
pub fn top(scores: &[u32], n: usize) -> Vec<u32> {
    let mut sorted = scores.to_vec();          // our own copy, to sort
    sorted.sort_unstable_by(|a, b| b.cmp(a));  // best first
    sorted.truncate(n);
    sorted
}
```

`top` reads the scores it's given and returns a new list. The signature
says that much: borrowed in, owned out. rust-js's `.d.ts` says it too:

```ts
export function top(scores: readonly number[], n: number): number[];
```

A slice is `readonly`, so a frozen array may go in, and the `Vec` that
comes out is the caller's own, to push to (`types.check.ts`).

A gotcha you won't miss: `[10, 9, 1].sort()` in JavaScript is
`[1, 10, 9]`, sorted as strings. Rust's `sort()` on numbers sorts
numbers.

## Iterators: the chain is lazy

TypeScript's array methods each build a whole new array:

```ts
// ts/arrays.ts
students.filter((s) => s.score >= 50).map((s) => s.name)
```

Rust's version looks the same:

```rust
students.iter().filter(|s| s.score >= 50).map(|s| s.name.clone()).collect()
```

but works differently. `.iter()` makes an *iterator*: something that
hands out one item at a time when asked. `filter` and `map` don't run
yet; they wrap the iterator in another. Nothing happens until something
at the end pulls, here `collect()`, which pulls every item through the
whole chain, one at a time, and builds the one `Vec` at the end.

Because nothing runs until it's pulled, a chain can start from something
endless:

```rust
pub fn squares_past(limit: u32, n: usize) -> Vec<u32> {
    (1u32..).map(|x| x * x).filter(|&square| square > limit).take(n).collect()
}
```

`1u32..` is every number from 1 up, with no end. `take(n)` stops pulling
after `n`, so the chain only ever looks at as many numbers as it needs.
In TypeScript, an array can't be endless, so `ts/arrays.ts` writes it as
a loop.

A few more from the toolbox, each with a TypeScript cousin:

| Rust | What it does | In TypeScript |
|---|---|---|
| `.scan(0, ..)` | carries a value along, giving each step's | a `map` with an outer `let` |
| `.windows(2)` | each run of 2 side by side | `xs.slice(1).map((x, i) => ..xs[i])` |
| `.take(n)`, `.skip(n)` | the first `n`, or all but | `.slice(0, n)`, `.slice(n)` |
| `.enumerate()` | each item with its index | `map`'s second argument |
| `.zip(other)` | pairs from two | by index, by hand |
| `.sum()`, `.count()`, `.max()` | one answer from all | `reduce` |

## `get` and `[i]`: the end of the array

```ts
const xs = [1, 2, 3]
const past: number = xs[9]   // undefined, typed number
```

TypeScript types `xs[9]` as `number` (unless you turn on
`noUncheckedIndexedAccess`), and you get `undefined` at run time. Rust
gives you two honest choices:

- `xs[9]` panics, right there: `index out of bounds: the len is 3 but
  the index is 9`. Use it where a bad index is a bug.
- `xs.get(9)` returns an `Option` (chapter 8): `None` past the end. Use it
  where a bad index can happen.

## What rust-js writes

Where the JavaScript you'd write does the same, rust-js writes it:

```js
// rust/src/lib.js (generated)
export function passing(students) {
  return students.filter((s) => s.score >= 50).map((s) => s.name);
}

export function item(xs, i) {
  return xs[i];
}
```

`filter` then `map` into a whole array gives the same answer as Rust's
one-at-a-time chain, so it's written as the array methods. Where the
laziness matters, an endless range cut by `take`, it uses JavaScript's
own lazy iterators (`Iterator.prototype.map`, `.filter`, `.take`):

```js
export function squaresPast(limit, n) {
  return Array.from(
    $iterator({ start: 1 }, $rangeFromStep(0, 4294967295))
      .map((x) => Math.imul(x, x) >>> 0)
      .filter((square) => square > limit)
      .take(n),
  );
}
```

And an index that Rust checks is checked: `windows(2)`'s `pair[1]` goes
through `$index`, which panics past the end as Rust does.

## Side by side

`bun chapters/10-arrays-and-iterators/compare.ts`:

```
[3,9,4,7]
  top 2           ts: [9,7]          rust: [9,7]
  running totals  ts: [3,12,16,23]   rust: [3,12,16,23]
  changes         ts: [6,-5,3]       rust: [6,-5,3]
```

`compare.test.ts` checks every function on every list, empty and short
ones too, against native Rust's answers.

## Where it's different

- **`.iter()` borrows; `.into_iter()` takes.** `.iter()` hands out
  references to the items and leaves the `Vec` as it was.
  `.into_iter()` hands out the items themselves, using the `Vec` up.
  Chapter 16 is about that "using up".
- **`collect` needs to know what to build.** It can make a `Vec`, a
  `String`, a `HashMap` (chapter 11), even a `Result<Vec<_>, _>` that
  stops at the first error. The type you ask for decides, from the
  function's return type or `collect::<Vec<_>>()`.
- **Closures look different.** `|s| s.score >= 50` is
  `(s) => s.score >= 50`. A closure that needs a block is
  `|s| { .. }`.

## Try it

In `item`, replace `xs.get(i).copied()` with `Some(xs[i])` and run
`cargo test`. It compiles, and then panics on the list `[1]` asked for
item 1: `index out of bounds: the len is 1 but the index is 1`. That's
the difference between "past the end is a bug" and "past the end is an
answer".
