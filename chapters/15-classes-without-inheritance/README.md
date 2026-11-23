# 15. Classes without inheritance

Rust has no classes. Everything a class does is still there, though,
in pieces you've met:

| A class's job | In Rust |
|---|---|
| fields | a struct (chapter 6) |
| methods | an `impl` block (chapter 6) |
| `private` | a field without `pub` |
| `constructor` | a plain function, often returning a `Result` |
| `static` | an associated function or `const` |
| `implements` | a trait `impl` (chapter 13) |
| `extends` | composition, an enum, or a trait |

This chapter is about the last three rows: keeping a value valid,
building without `extends`, and what to use where a hierarchy was.

## Private fields keep a value valid

A temperature can't be below absolute zero. In TypeScript, a private
constructor and a static function that checks:

```ts
// ts/classes.ts
export class Temperature {
  static readonly ABSOLUTE_ZERO = -273.15
  private constructor(private readonly celsiusValue: number) {}

  static fromCelsius(celsius: number): Temperature {
    if (Number.isNaN(celsius) || celsius < Temperature.ABSOLUTE_ZERO) {
      throw new Error(`${celsius}°C is below absolute zero`)
    }
    return new Temperature(celsius)
  }
}
```

In Rust, a field without `pub` can only be touched by code in its own
module. So outside, the only way to get a `Temperature` is through the
functions that check:

```rust
// rust/src/lib.rs
pub struct Temperature {
    celsius: f64,
}

impl Temperature {
    pub const ABSOLUTE_ZERO: f64 = -273.15;

    pub fn from_celsius(celsius: f64) -> Result<Temperature, String> {
        if celsius.is_nan() || celsius < Self::ABSOLUTE_ZERO {
            return Err(format!("{celsius}°C is below absolute zero"));
        }
        Ok(Temperature { celsius })
    }
}
```

Building one by hand, outside the module, doesn't compile:

```
error[E0451]: field `celsius` of struct `Temperature` is private
```

This is a big idea in Rust: *make invalid values impossible to build*.
If a function takes a `Temperature`, it never has to check for -500°C;
the type says it was checked already. The constructor returns a `Result`
(chapter 9) instead of throwing, so the caller sees it can fail.

## Composition, not `extends`

TypeScript models staff as a hierarchy: an `Employee` base, a `Manager`
and a `Contractor` that extend it and override `monthlyPay`, calling
`super`. One crack shows at once: a contractor has no salary, but an
`Employee` must, so `Contractor` inherits a `salary` it fills with `0`.

Rust has no `extends`. You put one thing *inside* another, and describe
what differs with an enum (chapter 7):

```rust
pub struct Person {
    pub name: String,
    pub salary: u32,
}

pub enum Role {
    Engineer,
    Manager { reports: u32 },
    Contractor { hours: u32, rate: u32 },
}

pub struct Staff {
    pub person: Person,
    pub role: Role,
}
```

A staff member *has* a person and a role, where the TypeScript says an
employee *is* a person with extra steps. Each role carries just its own
data: the manager's `reports`, the contractor's `hours` and `rate`.

Every override becomes an arm of a `match`:

```rust
pub fn monthly_pay(&self) -> u32 {
    let base = self.person.salary / 12;
    match self.role {
        Role::Engineer => base,
        Role::Manager { reports } => base + 100 * reports,
        Role::Contractor { hours, rate } => hours * rate,
    }
}
```

All the pay rules are in one place, and adding a role is a compile error
in every `match` that forgets it (chapter 7). The trade: adding a
*method* is easy (one new `match`), and adding a *role* touches every
method. With classes, it's the other way round.

## When the list is open: traits

An enum is the right tool when you know every kind, as with a company's
roles. When other people should be able to add kinds (plugins, a
library's users), use a trait (chapter 13): each type writes its own
`impl`, and a `Vec<Box<dyn Trait>>` holds any of them. Default methods
give you what a base class's shared methods gave.

## What rust-js writes

The private field shows up in the `.d.ts` as an *opaque* type:

```ts
// rust/src/lib.d.ts (generated)
declare const $temperatureBrand: unique symbol;
export interface Temperature {
    readonly [$temperatureBrand]: never;
}
export const Temperature: {
    readonly ABSOLUTE_ZERO: number;
    fromCelsius(celsius: number): { TAG: "Ok"; _0: Temperature } | { TAG: "Err"; _0: string };
    celsius(temperature: Temperature): number;
    // ..
};
```

TypeScript can't build a `Temperature` from an object literal, or read
its field: it can only ask `Temperature.fromCelsius` for one, and
`Temperature.celsius` what's in it (`types.check.ts`). The Rust rule,
kept at the boundary. At run time it's still a plain object,
`{ celsius: 20 }`, as TypeScript's `private` is still a readable
property. Neither stops JavaScript that ignores the types.

`Role` uses rust-js's own shape for an enum, since it has no
`#[rust_js::tag]`: a fieldless variant is its name, one with fields has a
`TAG`:

```ts
export type Role = "Engineer" | { TAG: "Manager"; reports: number } | { TAG: "Contractor"; hours: number; rate: number };
```

## Side by side

`bun chapters/15-classes-without-inheritance/compare.ts`:

```
Ada is an engineer
  ts:   10000   rust: 10000
Grace is a manager of 4
  ts:   12900   rust: 12900
Linus is a contractor for 80 hours
  ts:   7600   rust: 7600
```

The same pay, from a hierarchy and from a struct with an enum inside.
`compare.test.ts` also checks every temperature both sides make or
refuse, against native Rust's answers.

## Where it's different

- **No `this` puzzles.** A method's `self` is an ordinary parameter.
  There's no losing `this` when a method is passed as a callback:
  `staff.iter().map(Staff::monthly_pay)` just works.
- **No `protected`.** Privacy is by module: code in the same module sees
  everything, code outside sees only `pub`. `pub(crate)` means "anywhere
  in this crate" (chapter 20).
- **Getters are methods.** `t.celsius()` with parentheses. There's no
  `get` syntax, and by custom a getter is named for the field, not
  `get_celsius`.

## Try it

In `native.rs`, write `let t = Temperature { celsius: -500.0 };` and run
`cargo test`. Rust refuses with E0451: the field is private. Then try the
same in `types.check.ts` with `const t: rust.Temperature = { celsius:
-500 }`: TypeScript refuses too, because rust-js declared the type
opaque.
