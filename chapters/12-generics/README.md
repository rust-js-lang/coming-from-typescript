# 12. Generics

## The same angle brackets

Generics look the same in both languages. One function, any type:

```ts
// ts/generics.ts
export function largest<T>(xs: readonly T[]): T | undefined
```

```rust
// rust/src/lib.rs
pub fn largest<T: PartialOrd + Copy>(xs: &[T]) -> Option<T>
```

The difference is after the `T`.

## A bound says what a `T` can do

TypeScript's `largest<T>` compares two `T`s with `>`, and TypeScript
lets it, for any `T` at all. Ask it about objects, which have no order:

```
largest of [3, 9, 4]       ts: 9  rust: 9
last letter of "zebra"     ts: z  rust: z
largest of three prices    ts: {"cents":300}  rust: won't compile without a PartialOrd
```

`{ cents: 900 } > { cents: 300 }` is `false` in JavaScript (both become
the string `"[object Object]"`), so the first price "wins". No error, no
warning, a wrong answer.

In Rust, a generic body may only do to a `T` what its *bounds* promise.
`T: PartialOrd` promises `>`; `T: Copy` promises a `T` can be copied out
of the slice. Leave out `PartialOrd` and the body doesn't compile:

```
error[E0369]: binary operation `>` cannot be applied to type `T`
help: consider further restricting type parameter `T` with trait `PartialOrd`
```

The bound works in both directions. The body can rely on it, and every
*caller* must meet it: `largest(&prices)` with a price struct that
doesn't implement `PartialOrd` is a compile error at the call. Chapter 13
is about those traits, and how a type gets one.

TypeScript's nearest tool is `extends`: `<T extends { length: number }>`
promises a `length`. It covers fields and methods, but there's no way to
say "has `>`", and TypeScript doesn't ask for one.

## Generic structs

A struct can take a type parameter too, as a TypeScript class or
interface can:

```rust
pub struct Stack<T> {
    pub items: Vec<T>,
}

impl<T: Clone> Stack<T> {
    pub fn push(&mut self, item: T) { .. }
    pub fn pop(&mut self) -> Option<T> { .. }
    pub fn peek(&self) -> Option<T> { .. }
}
```

`balanced` uses a `Stack<char>` to check brackets. When Rust can see the
type from the code (here, the `char`s pushed in), you don't write it.
When it can't, you say it with the *turbofish*: `largest::<u8>(&[])`,
`"5".parse::<u32>()`, `collect::<Vec<_>>()`.

## Two bounds, a closure, a map

```rust
pub fn group_by<T: Clone, K: Eq + Hash>(items: &[T], key: impl Fn(&T) -> K) -> HashMap<K, Vec<T>>
```

Read it as: any items that can be cloned, and any key that can be
compared and hashed, which a `HashMap` key must be (chapter 11).
`impl Fn(&T) -> K` is "a function from a `&T` to a `K`", the closure.

## What rust-js writes

TypeScript erases its type parameters: the JavaScript of `largest<T>`
has no `T` in it, which is exactly why it can't know how to compare two
of them. Native Rust goes the other way: it compiles a copy of `largest`
for each type it's used with, each copy knowing its type's `>`.

rust-js does a third thing, and passes the bound as a value. The bound's
methods come in as an extra argument, a *dictionary*:

```js
// rust/src/lib.js (generated)
export function largest(xs, TPartialOrd) {
  // ..
      if (TPartialOrd.gt(x, best)) {
}

export function highest(scores) {
  return largest(scores, $partiallyOrdered) ?? undefined;
}
```

Rust code calling `largest` gives the dictionary without you seeing it.
A TypeScript caller has no dictionary to give, so rust-js leaves
`largest` out of the `.d.ts` and says why:

```ts
// rust/src/lib.d.ts (generated)
// `largest` isn't declared: its JS takes `T`'s `PartialOrd` dictionary after its arguments, which a JS caller can't give (ADR 1077).
export function highest(scores: readonly number[]): number | null | undefined;
```

To share a generic function with TypeScript, export a version for a
type, as `highest` (`i32`) and `last_letter` (`char`) do. A generic with
no bounds needs no dictionary, and is declared as is: the `Stack`
methods are `push<T>(stack: Stack<T>, item: T): void`.

## Side by side

`compare.test.ts` runs both sides over the same scores, words and
brackets, with native Rust's answers. It also holds the TypeScript
`largest`'s quiet wrong answer for objects.

## Where it's different

- **Rust checks the body once, against the bounds.** TypeScript checks a
  generic body against what `T` might be, and lets operators through.
  Rust's rule is simpler: if the bounds don't promise it, you can't do
  it.
- **No `any` escape.** There's no type that turns the checking off. The
  nearest thing, `dyn Any`, has to be asked what it is before it can be
  used.
- **Bounds can say a lot.** `T: Display` (can be printed with `{}`),
  `T: Default` (has a starting value), `T: Send` (can move to another
  thread). Each is a trait, and the next chapter is about traits.

## Try it

Remove `PartialOrd` from `largest`'s bound, leaving `<T: Copy>`, and run
`cargo build`. The `>` in the body is refused, and the compiler says
which bound to add. That's TypeScript's `largest<T>` with the check it
never makes.
