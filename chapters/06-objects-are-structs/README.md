# 6. Objects are structs

## A shape with a name

In TypeScript, an object type says what fields a value has:

```ts
// ts/shapes.ts
export interface Point { x: number; y: number }
export interface Rect { corner: Point; width: number; height: number }

export function area(rect: Rect): number {
  return rect.width * rect.height
}
```

Rust's version is a *struct*:

```rust
// rust/src/lib.rs
#[derive(Debug, Clone, PartialEq)]
pub struct Rect {
    pub corner: Point,
    pub width: f64,
    pub height: f64,
}
```

Same fields, same idea. Three things are new: methods live in an `impl`
block, each says whether it changes the struct, and a struct opts into
its abilities with `#[derive(..)]`.

## Methods: an `impl` block, and `&self` or `&mut self`

```rust
impl Rect {
    pub fn new(x: f64, y: f64, width: f64, height: f64) -> Rect {
        Rect { corner: Point { x, y }, width, height }
    }

    pub fn area(&self) -> f64 {
        self.width * self.height
    }

    pub fn moved(&self, dx: f64, dy: f64) -> Rect {
        Rect { corner: Point { x: self.corner.x + dx, y: self.corner.y + dy }, ..self.clone() }
    }

    pub fn grow(&mut self, by: f64) {
        self.width += by;
        self.height += by;
    }
}
```

- **`new` is just a function.** Rust has no constructors. `Rect::new` is
  a plain function that returns a `Rect`, named `new` by custom.
- **`&self` reads, `&mut self` changes.** Chapter 2's rule again:
  `area` and `moved` borrow the rectangle to read it, so you can call them
  on any rectangle; `grow` borrows it to change it, so you can only call
  it on one declared `let mut`. The signature tells you which methods
  touch your data.
- **`..self.clone()`** is Rust's spread: the rest of the fields, from
  this one, like TypeScript's `{ ...rect, corner }`.

## Abilities you ask for: `#[derive]`

A new struct can do almost nothing: it can't be compared, copied or
printed. `#[derive(..)]` asks the compiler to write those for you:

- **`PartialEq`** gives `==`, which compares *what's in* two structs,
  field by field.
- **`Clone`** gives `.clone()`, a copy.
- **`Debug`** gives `{:?}` in `format!`, a printout for developers:
  `Rect { corner: Point { x: 0.0, y: 0.0 }, width: 2.0, height: 3.0 }`.

That `==` is the biggest difference from TypeScript:

```
two rectangles of the same corner and size
  ts:   same(a, b) is false   (=== asks: the same object?)
  rust: same(a, b) is true    (== asks: the same contents?)
```

TypeScript's `===` on objects asks whether they're the *same object*.
Rust's `==` asks whether they *hold the same values*, which is usually
what you meant.

## What rust-js writes

The struct is a plain JavaScript object, exactly the shape the
TypeScript interface describes, and the `.d.ts` says so:

```ts
// rust/src/lib.d.ts (generated)
export interface Rect {
    corner: Point;
    width: number;
    height: number;
}

export const Rect: {
    "new"(x: number, y: number, width: number, height: number): Rect;
    area(rect: Rect): number;
    grow(rect: Rect, by: number): void;
    // ..
};
```

The methods are functions on an exported `Rect` object, the rectangle
passed first: `Rect.area(rect)`, not `rect.area()`. The data stays plain,
with no class and no prototype, so a `Rect` from TypeScript works in
Rust's code and back again; `compare.test.ts` passes each side's
rectangles to the other's functions. `==` is `$eq(a, b)`, a field-by-field
comparison.

## Where it's different

- **Nominal, not structural.** In TypeScript, *any* object with the right
  fields is a `Rect`. In Rust, only a value built as a `Rect` is one: two
  structs with identical fields are different types. Chapter 13 says why
  that's a feature.
- **No methods on the object.** TypeScript code calls `rect.area()` on a
  class. rust-js's JavaScript calls `Rect.area(rect)`, which surprises at
  first and keeps the data plain.
- **No `null` fields by accident.** Every field of a Rust struct must be
  given when it's made. A field that may be missing is an `Option`
  (chapter 8), and says so.

## Try it

Remove `PartialEq` from `Rect`'s `#[derive(..)]` and run `cargo build`.
`a == b` in `same` no longer compiles: `binary operation == cannot be
applied to type &Rect`. In Rust, even equality is something a type asks
for.
