# 7. Unions are enums

## The best part of TypeScript

Discriminated unions are TypeScript at its best. A value is one of a few
kinds, a field says which, and after a check TypeScript knows which
fields exist:

```ts
// ts/shapes.ts
export type Shape =
  | { kind: 'circle'; radius: number }
  | { kind: 'square'; side: number }
  | { kind: 'point' }

export function area(shape: Shape): number {
  switch (shape.kind) {
    case 'circle': return Math.PI * shape.radius * shape.radius
    case 'square': return shape.side * shape.side
    case 'point':  return 0
    default: {
      const unhandled: never = shape   // a reminder to handle every kind
      return unhandled
    }
  }
}
```

The `never` line is a trick: it makes TypeScript complain when a new kind
is added and this `switch` doesn't handle it. It only works if you
remember to write it, in every `switch`.

## The Rust way: an enum

Rust builds that idea into the language. An `enum` lists the kinds,
*variants*, and each carries its own fields:

```rust
// rust/src/lib.rs
pub enum Shape {
    Circle { radius: f64 },
    Square { side: f64 },
    Point,
}

pub fn area(shape: &Shape) -> f64 {
    match shape {
        Shape::Circle { radius } => std::f64::consts::PI * radius * radius,
        Shape::Square { side } => side * side,
        Shape::Point => 0.0,
    }
}
```

The `match` does two jobs at once: it checks which variant `shape` is,
and it pulls that variant's fields out into variables (`radius`, `side`).
You can't reach a `radius` without first matching a `Circle`, so there's
no "check the kind, then trust the field" step to get wrong.

And a `match` must handle **every** variant, always, with no trick to
remember. Leave out `Point` and the program doesn't compile. That's held
by a test that must fail to compile, in `lib.rs`:

```
error[E0004]: non-exhaustive patterns: `&Shape::Point` not covered
```

Add a `Triangle` next year, and every `match` that doesn't handle it is
an error, pointing at the exact line. TypeScript catches it only where
the code happens to be set up to: a `never` line, or a function that
must return a value and would fall off the end of its `switch`. A
`switch` with a `default` branch, or one in a function that returns
nothing, keeps compiling and quietly does the default thing.

A match arm can also have a guard, a condition after the pattern:

```rust
Shape::Circle { radius } if *radius == 0.0 => "a circle of no size".to_string(),
```

## What rust-js writes

Two attributes make the JavaScript the same objects as the TypeScript
union: `#[rust_js::tag = "kind"]` names the field that says the kind,
and `#[rust_js::name = "circle"]` each variant's value. The `.d.ts` is
the TypeScript type, word for word:

```ts
// rust/src/lib.d.ts (generated)
export type Shape = {
    kind: "circle";
    radius: number;
} | {
    kind: "square";
    side: number;
} | {
    kind: "point";
};
```

And the `match` becomes the checks you'd write:

```js
// rust/src/lib.js (generated)
export function area(shape) {
  if (shape.kind === "circle") {
    return Math.PI * shape.radius * shape.radius;
  }
  if (shape.kind === "square") {
    return shape.side * shape.side;
  }
  return 0;
}
```

The last arm needs no check: it's the only kind left. Without the two
attributes, rust-js's own shape for an enum is `{ TAG: "Circle", radius }`.
That's fine for code that only Rust reads; the attributes are for when
TypeScript shares the values.

## Side by side

`compare.test.ts` hands the same objects to both sides, and every answer
matches native Rust's: area, the doubled shape, the description.

## Where it's different

- **Variants are not types of their own.** In TypeScript, `{ kind:
  'circle'; radius: number }` is a type you can name and pass around. A
  Rust `Shape::Circle` is a variant of `Shape`, not a type. To pass "just
  a circle", make a `struct Circle` and a variant `Circle(Circle)` that
  holds it.
- **Fieldless variants are the same thing.** `Shape::Point` has no
  fields, and an enum of only those is chapter 7's cousin in
  coming-from-zod: a list of names, a string union in TypeScript.
- **`Option` and `Result` are enums too.** `Option<T>` is `Some(T)` or
  `None`, and `Result` is `Ok` or `Err`. Chapters 8 and 9 are about them,
  and everything here applies.

## Try it

Add `Triangle { base: f64, height: f64 }` to `Shape`, with its
`#[cfg_attr(rust_js, rust_js::name = "triangle")]`, and run
`cargo build`. Rust lists every `match` that doesn't handle it: `area`,
`doubled` and `describe`, each `non-exhaustive patterns`. Then add the
same kind to the TypeScript union and run `bun run types`: `area`
complains through its `never` line, and `doubled` because it must return
a `Shape` (TS2366). Now add a `default:` branch to `doubled` and look
again: TypeScript is satisfied, and a triangle would be doubled by
whatever the default does. Rust has no way to quietly skip a variant.
