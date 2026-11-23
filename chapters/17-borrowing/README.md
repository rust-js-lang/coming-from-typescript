# 17. Borrowing

Chapter 16 gave values one owner. Moving a value into every function
that reads it would be clumsy, though, so most of the time you *lend*
it instead: a *reference* lets a function use a value without owning it.

## Two kinds of reference

- **`&T`, a shared reference**, lends a value to read. Any number of
  them can exist at once.
- **`&mut T`, a mutable reference**, lends a value to change. Only one can
  exist at a time, and while it does, there are no `&T`s either.

```rust
// rust/src/lib.rs
pub fn letters(words: &[String]) -> usize                // reads
pub fn capitalize_all(words: &mut [String])              // changes
pub fn remove_short(words: &mut Vec<String>, min: usize) // changes, and may shrink
```

The signatures say who touches what. A caller writes it too:
`letters(&words)`, `capitalize_all(&mut words)`. When you read
`&mut words` at a call, you know `words` may come back different.

The rule fits in one line: **many readers, or one writer, never both.**
It's the rule a database or a file lock uses, checked by the compiler
for every value in your program.

## The bug the rule stops

Remove the short words from a list. The TypeScript that looks right:

```ts
// ts/borrowing.ts
words.forEach((word, i) => {
  if ([...word].length < min) words.splice(i, 1)
})
```

```
remove the words shorter than 3 from ["a","b","long","is","ok","words"]
  ts, splice in forEach: ["b","long","ok","words"]
  ts, backwards:         ["long","words"]
  rust, retain:          ["long","words"]
```

`"b"` and `"ok"` survived. Removing `"a"` shifts everything left, `"b"`
moves into slot 0, and the loop moves on to slot 1. The loop is reading
the array while the `splice` changes it: a reader and a writer at once.

Rust refuses to compile the same thing:

```rust
for (i, word) in words.iter().enumerate() {   // a reader...
    if word.len() < 3 {
        words.remove(i);                      // ...and a writer
    }
}
```

```
error[E0502]: cannot borrow `words` as mutable because it is also borrowed as immutable
```

The `for` loop holds a shared borrow of `words` for as long as it runs, so
`words.remove` can't get a mutable one. What you write instead is
`retain`, which walks and removes in one careful step:

```rust
pub fn remove_short(words: &mut Vec<String>, min: usize) {
    words.retain(|word| word.chars().count() >= min);
}
```

The same rule stops two writers at once:

```rust
let a = &mut score;
let b = &mut score;
```

```
error[E0499]: cannot borrow `score` as mutable more than once at a time
```

When you really do need two parts of one thing changed together, ask for
parts that can't overlap: `split_at_mut` lends a slice's two halves,
each `&mut` (`swap_halves`).

## A reference to a number

`&mut u32` lends a number to change:

```rust
pub fn add_points(score: &mut u32, points: u32) {
    *score += points;
}

add_points(&mut score, 10);
```

`*score` is the number the reference points at. TypeScript can't do
this: a number is passed by value, so a function can't change the
caller's. You'd pass an object, `{ value: 0 }`, and change its field.

## What rust-js writes

That object is exactly what rust-js uses when a `&mut` to a number
crosses into JavaScript:

```ts
// rust/src/lib.d.ts (generated)
export function letters(words: readonly string[]): number;
export function capitalizeAll(words: string[]): void;
export function addPoints(score: {
    value: number;
}, points: number): void;
```

A shared borrow of a slice is `readonly string[]`, a mutable one
`string[]`, and a `&mut u32` a box, `{ value }`. Inside Rust code, the
box is made only around the call and read back after:

```js
// rust/src/lib.js (generated)
const score$1 = { value: score };
addPoints(score$1, 10);
score = score$1.value;
```

Arrays and objects are already shared by reference in JavaScript, so a
`&mut [String]` needs no box: it's the array.

## Where it's different

- **The checking is all at compile time.** There's no lock and no
  counter at run time: once Rust has proved no reader and writer overlap,
  the JavaScript is plain array code.
- **A borrow lasts until its last use.** Not until the end of the block:
  `let first = &words[0]; println!("{first}"); words.push(..)` is fine,
  because `first` is done before the push.
- **Methods borrow too.** `&self` and `&mut self` (chapter 6) are the same
  two kinds. Calling a `&mut self` method needs the value declared
  `let mut`, and no other borrow of it alive.

## Try it

In a test, write the `for` loop with `words.remove(i)` above and run
`cargo test`: E0502, pointing at the loop's borrow and the removal. Then
write the TypeScript version in a scratch file and run it with `bun`: no
error, and the wrong words left.
