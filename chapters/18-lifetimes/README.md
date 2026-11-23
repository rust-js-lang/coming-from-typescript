# 18. Lifetimes

## The problem TypeScript never has

In TypeScript, a value lives as long as anything can reach it. The
garbage collector watches, and frees it only when nothing points at it.
You never ask "is this still alive?": if you can name it, it is.

Rust has no garbage collector. A value is freed when its owner is done
with it (chapter 16), at a moment the compiler knows exactly. So
borrowing (chapter 17) needs one more rule: **a reference must not
outlive the value it refers to.** Otherwise it would point at freed
memory, a *dangling* reference, the bug behind many security holes in C.

Rust checks this at compile time. Most of the time it's invisible. This
chapter is about when it shows up in a signature, as a *lifetime*.

## A reference that would dangle

```rust
fn dangling() -> &'static str {
    let name = String::from("temporary");
    &name
}
```

```
error[E0515]: cannot return reference to local variable `name`
  |     ^^^^^ returns a reference to data owned by the current function
```

`name` is dropped when `dangling` returns, so a reference to it can't
leave. In TypeScript this is fine: the garbage collector keeps `name`
alive as long as the caller holds it. In Rust you return the `String`
itself, moving it out, and the caller owns it.

## A lifetime is a name for "as long as"

Most functions that return a reference borrow it from their one input,
and Rust works that out alone:

```rust
// rust/src/lib.rs
pub fn first_word(text: &str) -> &str {
    text.split_whitespace().next().unwrap_or("")
}
```

The result is a slice of `text`, part of the same string, not a copy. So
it can't outlive `text`, and Rust knows that because `text` is the only
place it could come from.

With two inputs, Rust can't guess:

```rust
pub fn longest(a: &str, b: &str) -> &str   // which one does it borrow from?
```

```
error[E0106]: missing lifetime specifier
  = help: this function's return type contains a borrowed value, but the signature does not say whether it is borrowed from `a` or `b`
```

You say it with a lifetime, a name with a quote, `'a`:

```rust
pub fn longest<'a>(a: &'a str, b: &'a str) -> &'a str {
    if a.chars().count() >= b.chars().count() { a } else { b }
}
```

Read `'a` as "some stretch of the program". This says: there's a
stretch in which both `a` and `b` are alive, and the result is good for
that long. A lifetime doesn't change how long anything lives. It's a
label that lets the compiler check each caller:

```rust
let a = String::from("apple");
let result;
{
    let b = String::from("banana");
    result = longest(&a, &b);
}
println!("{result}");
```

```
error[E0597]: `b` does not live long enough
   |     - `b` dropped here while still borrowed
```

`result` might be `b`, and `b` is gone by the `println!`.

A signature can also say what a result *doesn't* borrow from:

```rust
pub fn mentions<'a>(text: &'a str, word: &str) -> Vec<&'a str>
```

The sentences found are slices of `text`, so only `text` gets `'a`. The
caller can drop `word` the moment `mentions` returns.

## A struct that borrows

A struct that holds a reference says how long, with the same notation:

```rust
struct Lines<'a> {
    rest: &'a str,
}

impl<'a> Lines<'a> {
    fn next_pair(&mut self) -> Option<(&'a str, &'a str)> { .. }
}
```

`Lines` reads `key=value` pairs from a config and hands out slices of the
original text, without copying a byte. The `'a` promises each slice is
good as long as the *text* is, even after the `Lines` reader is gone.

And `'static` is the longest lifetime there is, the whole program. A
string literal is `&'static str`: it's baked into the program, so it never
goes away.

## What rust-js writes

Nothing. Lifetimes are only for the compiler's checks, and they leave
no trace:

```ts
// rust/src/lib.d.ts (generated)
export function longest(a: string, b: string): string;
export function mentions(text: string, word: string): string[];
```

```js
// rust/src/lib.js (generated)
export function longest(a, b) {
  return Array.from(a).length >= Array.from(b).length ? a : b;
}
```

JavaScript has a garbage collector, so a reference can't dangle there
anyway. Once Rust has checked every borrow, there's nothing left to
check. A slice of a string becomes a JavaScript string; JavaScript
strings can't change, so whether it shares the original's memory or not
is invisible. Even the `Lines` struct is gone: rust-js turned it into a
local variable of `pairs`.

## Side by side

`compare.test.ts` runs every first word, longer string, mention and
config through both sides, with native Rust's answers. Native Rust also
holds that `first_word` gives a slice of the same bytes, not a copy
(`a_slice_is_part_of_its_text`).

## Where it's different

- **You'll write few of them.** The rules that let `first_word` go
  without one cover most functions. Lifetimes show up with two
  reference inputs and a reference out, and in structs that hold
  references.
- **When in doubt, own it.** A struct that holds a `String` instead of a
  `&str` has no lifetime to write. Borrowing saves copies; owning saves
  thinking. Start owned, and borrow where it matters.
- **The error points at a real bug.** "Does not live long enough" in
  Rust is a crash or a corrupt value in C. In TypeScript, the same
  design is safe but keeps memory alive longer than you might expect.

## Try it

Remove `'a` from `longest`, leaving `pub fn longest(a: &str, b: &str)
-> &str`, and run `cargo build`. Rust says the signature doesn't say
whether the result is borrowed from `a` or `b`, and suggests adding a
named lifetime. Put it back, and add the `{ let b = .. }` block above to
a test: now it's the caller that's wrong, and Rust points at the line
where `b` is dropped.
