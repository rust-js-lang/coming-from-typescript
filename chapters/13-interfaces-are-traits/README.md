# 13. Interfaces are traits

## Structural: anything of the right shape

A TypeScript interface describes a shape, and any value of that shape
fits, whether it meant to or not:

```ts
// ts/shapes.ts
export interface Shape {
  area(): number
  name(): string
}

export const invoice = { area: () => 0, name: () => 'invoice', total: 120 }
describe(invoice)   // "a invoice of area 0.00"
```

The invoice was never meant to be a shape. It has an `area` and a
`name`, so TypeScript takes it. This is *structural* typing, and most
of the time it's convenient. Sometimes it's an accident.

## Nominal: what an `impl` says

A Rust *trait* also names what a type can do:

```rust
// rust/src/lib.rs
pub trait Shape {
    fn area(&self) -> f64;
    fn name(&self) -> String;
    fn describe(&self) -> String {
        format!("a {} of area {:.2}", self.name(), self.area())
    }
}
```

But having the methods isn't enough. A type implements a trait only
where an `impl` says so:

```rust
impl Shape for Circle {
    fn area(&self) -> f64 { std::f64::consts::PI * self.radius * self.radius }
    fn name(&self) -> String { "circle".to_string() }
}
```

An `Invoice` with its own `area` and `name` methods is not a `Shape`:

```
error[E0277]: the trait bound `Invoice: Shape` is not satisfied
```

This is *nominal* typing: a type has a trait because someone said it
does, by name. Being a `Shape` is a decision, not a coincidence.

Two more things a trait does that an interface doesn't:

- **Default methods.** `describe` has a body, so every `Shape` gets it
  for free. `Square` writes its own, which takes its place.
- **Implemented anywhere.** You can implement your trait for a type you
  didn't write, even `i32` or `String`, and your type for a trait you
  didn't write. `impl fmt::Display for Circle` makes a circle printable
  with `{}` and gives it `.to_string()`.

## The same number, different meanings

The plainest case of structural typing is a type alias:

```ts
type Meters = number
type Seconds = number
speed(9.58, 100)   // seconds and meters, swapped: 0.0958, no error
```

Both are `number`, so either fits either. Rust's *newtype* is a struct
with one field, a new type of its own:

```rust
pub struct Meters(pub f64);
pub struct Seconds(pub f64);

pub fn speed(distance: Meters, time: Seconds) -> f64
```

Swap the arguments and Rust refuses, and says how to fix it:

```
error[E0308]: arguments to this function are incorrect
help: swap these arguments
```

Compiled natively, a newtype costs nothing at run time: it's the number.
TypeScript can get
close with a "brand", `number & { __brand: 'Meters' }`, which is a
trick the language doesn't know about.

## One kind of shape, or any kind: `impl` and `dyn`

```rust
pub fn area_of(shape: &impl Shape) -> f64 {
    shape.area()
}
```

`&impl Shape` is a generic (chapter 12) written short: "a reference to
some one type that implements `Shape`". Rust knows the type at each call
and calls its `area` directly.

A list that holds circles *and* squares needs something else, since a
`Vec` holds one type:

```rust
let mut beds: Vec<Box<dyn Shape>> = Vec::new();
beds.push(Box::new(circle.clone()));
beds.push(Box::new(square.clone()));
beds.iter().map(|bed| bed.describe()).collect()
```

`dyn Shape` is "some value that implements `Shape`, I'll find out which
when I call it". It's what TypeScript's `Shape[]` always is. The `Box`
puts each value behind a pointer, since a circle and a square aren't the
same size.

## What rust-js writes

An `impl` becomes an object of functions, a *dictionary*, exported and
declared:

```js
// rust/src/lib.js (generated)
export const circleShape = {
  area: circleShape_area,
  name: circleShape_name,
  describe: (circle) =>
    `a ${circleShape_name(circle)} of area ${$toFixed(circleShape_area(circle), 2)}`,
};

export function areaOf(shape, Shape) {
  return Shape.area(shape);
}
```

```ts
// rust/src/lib.d.ts (generated)
export interface Shape<Self> {
    area(self: Self): number;
    name(self: Self): string;
    describe(self: Self): string;
}
export const circleShape: Shape<Circle>;
export function areaOf(shape: unknown, Shape: Shape<unknown>): number;
```

The default `describe` was filled in for `circleShape`. A TypeScript
caller of `areaOf` passes the shape and its dictionary:
`areaOf({ radius: 1 }, circleShape)`. Unlike chapter 12's `largest`,
whose `PartialOrd` is std's, this trait is the crate's own, so its
dictionaries are exported and the function is declared.

A `dyn Shape` is the pair, `{ value: circle, impl: circleShape }`, and
calling it is `bed.impl.describe(bed.value)`.

A newtype is a one-item array, `Meters` declared `[number]`. Notice what
that means at the boundary: `Meters` and `Seconds` are both `[number]` to
TypeScript, so a TypeScript caller can swap them and type-check
(`types.check.ts` does). The nominal check is Rust's, and it holds
inside Rust; across the boundary, TypeScript's structural rules apply.

## Where it's different

- **No inheritance.** A trait can require another (`trait Pet: Animal`),
  but there's no `extends` of a class, no `super`, no protected fields.
  Chapter 15 is about living without it.
- **`instanceof` isn't how you ask.** `ts/shapes.ts` checks
  `instanceof Square` to pick a description. In Rust, the type's own
  `impl` decides, which is the override `Square` writes.
- **Traits power operators.** `==` is `PartialEq`, `<` is `PartialOrd`,
  `+` is `Add`, `{}` is `Display`, `for` loops are `IntoIterator`.
  Implement the trait and the operator works for your type.

## Try it

In `native.rs` (or any test), call `speed(Seconds(9.58), Meters(100.0))`
and run `cargo test`. Rust points at both arguments, says which type it
expected at each, and ends with `help: swap these arguments`. Then call
`ts.speed(9.58, 100)` in TypeScript: `0.0958`, a sprinter at a tenth of a
meter a second, and no complaint.
