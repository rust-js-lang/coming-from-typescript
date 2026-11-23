# 3. Numbers that know their kind

## One `number`, and what it hides

TypeScript has one number type, and it's a 64-bit float. That one type
plays every part: a count, a price, a byte, an id. It mostly works, and
when it doesn't, it fails quietly:

```ts
Number.parseInt('42abc', 10)      // 42: it read what it could
Number('9007199254740993')        // 9007199254740992: rounded
9007199254740992 + 1              // 9007199254740992: past 2^53, + 1 does nothing
```

None of those is an error. A float holds every whole number up to 2^53
exactly, and past that it rounds, with no sign that it did.

## The Rust way: say what kind of number it is

Rust has a number type for each job, and you pick one:

| Rust | What it holds | In JS (rust-js) |
|---|---|---|
| `u8`, `u16`, `u32` | whole numbers from 0, up to 255, 65,535, 4,294,967,295 | `number` |
| `i8`, `i16`, `i32` | whole numbers, negative too | `number` |
| `usize` | a length or an index | `number` |
| `u64`, `i64`, `u128`, `i128` | big whole numbers | `bigint` |
| `f64` | a float, exactly TypeScript's `number` | `number` |
| `f32` | a smaller float | `number`, rounded to 32 bits |

And Rust never changes one kind into another behind your back. You saw
that in chapter 1, where adding a float to a whole number didn't compile
until we wrote `as f64`. Each difference below falls out of that.

## Whole numbers divide into whole numbers

```rust
pub fn share(n: u32) -> (u32, u32) {
    (n / 2, n % 2)      // share(7) is (3, 1)
}
```

`7 / 2` is `3` for whole numbers, because a `u32` can't hold `3.5`.
TypeScript gets the same only with `Math.floor(n / 2)`, and you have to
remember it.

## A number that can't hold the answer says so

A `u8` holds 0 to 255. What's `255 + 1`? Rust makes you choose:

```rust
pub fn add_box(boxes: u8) -> Option<u8> {
    boxes.checked_add(1)        // add_box(255) is None
}
```

`checked_add` gives `None` when the answer doesn't fit. There's also
`wrapping_add` (255 + 1 is 0, like a car's odometer) and
`saturating_add` (it stays at 255). A plain `+` that overflows is a
crash in a native debug build, and wraps in a release build and in
rust-js. Rust's way of saying: decide what you want.

## Parsing means all of it

```rust
pub fn parse_count(text: &str) -> Result<u32, String> {
    text.trim().parse::<u32>().map_err(|error| error.to_string())
}
```

`parse` succeeds only if *the whole string* is that kind of number:

```
  "42"           ts: 42           rust: Ok(42)
  "42abc"        ts: 42           rust: Err("invalid digit found in string")
  "4.5"          ts: 4            rust: Err("invalid digit found in string")
  "-3"           ts: -3           rust: Err("invalid digit found in string")
  "4294967296"   ts: 4294967296   rust: Err("number too large to fit in target type")
```

The TypeScript side uses `parseInt`, the way it's usually written. It
reads what it can and stops, so `"42abc"` is 42, `"4.5"` is 4, and a
negative count is fine. Rust's `u32` can't be negative and can't be
4,294,967,296, so those are errors too, each with its reason. It returns a
`Result`: the number, or why not (chapter 9).

## Big numbers stay exact

```rust
pub fn parse_id(text: &str) -> Option<u64> {
    text.parse().ok()
}

pub fn next_id(id: u64) -> u64 {
    id + 1
}
```

A `u64` is a `bigint` in the JavaScript rust-js writes, so it keeps every
digit:

```
  "9007199254740993"       ts: 9007199254740992       rust: 9007199254740993n
  "18446744073709551615"   ts: 18446744073709552000   rust: 18446744073709551615n
the id after 9007199254740993
  ts: 9007199254740992   rust: 9007199254740994n
```

Database ids are often 64-bit. In TypeScript, the fix is to remember to
use `bigint`. In Rust you can't forget: a `u64` is one, and the `.d.ts`
says `bigint`, so TypeScript won't let you pass a `number`
(`types.check.ts`).

## `as`: changing kind, on purpose

```rust
pub fn brightness(level: f64) -> u8 {
    level as u8         // 127.9 → 127, -5.0 → 0, 300.0 → 255
}
```

`as` is how you say "change the kind". From a float to a whole number,
it drops the fraction and holds anything past either end at that end.
TypeScript's version needs `Math.trunc`, `Math.max` and `Math.min` to do
the same.

## What rust-js writes

```js
// rust/src/lib.js (generated)
export function share(n) {
  return [(n / 2) >>> 0, n % 2];
}

export function addBox(boxes) {
  return $checked(boxes + 1, 0, 255);
}

export function nextId(id) {
  return BigInt.asUintN(64, id + 1n);
}
```

Each kind's rule, written out in JavaScript: `>>> 0` makes a division
whole, `$checked` checks the range, and `bigint` math stays 64 bits.

## Where it's different

- **More types to choose.** Picking `u8` or `u32` or `u64` is a decision
  TypeScript never asks for. Most code uses `u32` or `usize` for counts,
  `i64` or `u64` for ids, and `f64` for measurements.
- **`bigint` at the edge.** A `u64` from Rust is a `bigint` in
  TypeScript, which doesn't mix with `number` (`1n + 1` is a type error).
  That's correct, but a TypeScript caller has to deal with it.
- **Overflow differs between builds.** A native debug build panics on
  overflow; rust-js wraps, as a release build does (rust-js's guide says
  so). Code that cares uses `checked_`, `wrapping_` or `saturating_`, and
  then every build agrees.

## Try it

Change `boxes.checked_add(1)` to `Some(boxes + 1)` and run `cargo test`.
The test for 255 panics: `attempt to add with overflow`. That's a debug
build catching what TypeScript would have silently allowed.
