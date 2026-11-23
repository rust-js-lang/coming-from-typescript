# 5. Everything is an expression

## Statements and expressions

TypeScript has two kinds of code. An *expression* has a value: `a + b`,
`f(x)`, `cond ? a : b`. A *statement* does something but has no value:
`if`, `switch`, `for`, a `{ block }`. You can't write
`const x = if (cond) { 1 } else { 2 }`, so TypeScript grew the ternary,
and when even that's not enough, you declare a `let` and assign it in
each branch, or wrap a block in an arrow you call at once:

```ts
// ts/expressions.ts
const size = (() => {
  const distance = Math.abs(n)
  return distance < 10 ? 'small' : 'large'
})()
```

## The Rust way: almost everything has a value

In Rust, `if`, `match`, `loop` and plain `{ }` blocks are expressions.
A block's value is its last line, *without* a semicolon:

```rust
// rust/src/lib.rs
let size = {
    let distance = n.unsigned_abs();
    if distance < 10 { "small" } else { "large" }
};
```

That's the whole trick, and it's why chapter 1's `mean` ended with
`Some(sum / xs.len() as f64)` and no `return`: a function's body is a
block, so its last expression is what it returns. A semicolon turns an
expression into a statement and throws the value away. `x + 1` is a
value; `x + 1;` is not.

### `if` is a value: no ternary needed

```rust
pub fn shipping(total: u32, express: bool) -> u32 {
    let base = if total >= 5000 { 0 } else { 499 };
    base + if express { 1000 } else { 0 }
}
```

Both branches must have the same type, and an `if` used as a value needs
an `else`, since otherwise what would it be when the condition is false?

### `match` is a value, and it matches ranges

```rust
pub fn grade(score: u32) -> &'static str {
    match score {
        90..=100 => "A",
        80..=89 => "B",
        70..=79 => "C",
        0..=69 => "F",
        _ => "not a score",
    }
}
```

TypeScript's `switch` compares with `===` only, so ranges need
`switch (true)` and a `return` in each case. A `match` arm can be a
range, a list of values (`1 | 2 | 3`), or a pattern with a guard
(`n if n < 0`), and the whole `match` is one value. It must also cover
every case; leave out `_` and Rust tells you which scores aren't
handled. Chapter 7 makes much more of that.

### Even a loop can have a value

```rust
pub fn first_negative(xs: &[i32]) -> Option<usize> {
    let mut i = 0;
    loop {
        if i == xs.len() {
            break None;
        }
        if xs[i] < 0 {
            break Some(i);
        }
        i += 1;
    }
}
```

`break value` leaves the loop and makes `value` the loop's value. (The
idiomatic version is `xs.iter().position(|&x| x < 0)`, chapter 10.)

## What rust-js writes

The JavaScript is what a careful TypeScript developer writes by hand: a
`match` of ranges becomes `if`s that return, an `if` value a ternary, a
block value straight-line code:

```js
// rust/src/lib.js (generated)
export function grade(score) {
  if (score >= 90 && score <= 100) {
    return "A";
  }
  // ..
  if (score <= 69) {
    return "F";
  }
  return "not a score";
}

export function describe(n) {
  const distance = Math.abs(n);
  const size = distance < 10 ? "small" : "large";
  const sign = n === 0 ? "zero" : n < 0 ? "negative" : "positive";
  return `${n} is ${size} and ${sign}`;
}
```

Note `score <= 69`, not `score >= 0 && score <= 69`. rust-js knows a
`u32` can't be negative, so half of the range check was free.

## Side by side

`bun chapters/05-everything-is-an-expression/compare.ts` agrees on every
case, including `describe(-2147483648)`, the most negative `i32`. Its
distance from zero doesn't fit in an `i32`, which is why the Rust uses
`unsigned_abs()`: a `u32` holds it.

## Where it's different

- **Watch the semicolons.** `fn f() -> u32 { 1; }` doesn't compile: with
  the semicolon, the body's value is `()` ("nothing"), not `1`. The
  error says exactly that and suggests removing the semicolon.
- **`return` still exists,** for leaving early. Style is to use it only
  for early exits and let the last line be the value.
- **TypeScript is fine here.** Ternaries and early returns say the same
  things. The gain in Rust is consistency: one way, everywhere, and the
  compiler checks each branch gives the same type.

## Try it

In `grade`, delete the `_ => "not a score",` line and run `cargo build`.
Rust refuses: `non-exhaustive patterns: 101_u32..=u32::MAX not covered`.
It worked out, from your ranges, exactly which numbers you forgot.
