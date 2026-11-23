# 20. Modules and crates

## The words

| TypeScript | Rust |
|---|---|
| a package (`package.json`) | a *crate* (`Cargo.toml`) |
| npm, `node_modules` | crates.io, Cargo's cache |
| `bun add heck` | `heck = "=0.5.0"` under `[dependencies]` |
| `bun.lock` | `Cargo.lock` |
| a monorepo's workspaces | a Cargo *workspace* (this repo is one) |
| a file is a module | a module is declared with `mod` |
| `export` | `pub` |
| `import { x } from './m'` | `use crate::m::x;` |
| `export { x } from './m'` | `pub use m::x;` |

Most of it maps one to one. Two things don't: a file isn't a module
until you say so, and Rust has a level of privacy TypeScript lacks.

## `mod`: a module is declared

In TypeScript, every file is a module, and it's found when something
imports it. In Rust, a crate starts from one file, `src/lib.rs`, and
every other module is declared from its parent:

```rust
// rust/src/lib.rs
mod money;      // the module in src/money.rs, private
pub mod shop;   // the module in src/shop.rs, public

pub use money::Money;
```

A file nothing declares with `mod` isn't part of the crate at all, even
if it sits in `src/`. The module tree is written down, in one place per
level.

Inside a module, `use` brings names in, as `import` does:

```rust
// rust/src/shop.rs
use crate::money::Money;   // from this crate's root
use heck::ToKebabCase;     // from the `heck` crate
```

`crate::` starts at this crate's root, `super::` at the parent module,
and a crate's name at that crate.

## Privacy: private, `pub`, and `pub(crate)`

Like a TypeScript file's unexported names, everything in Rust is private
unless marked: a function, a struct's field (chapter 15), a module.

Rust adds a middle level. `pub(crate)` means "anywhere in this crate, and
nowhere else":

```rust
// rust/src/money.rs
impl Money {
    pub fn from_cents(cents: u32) -> Money { .. }
    pub fn format(&self) -> String { .. }
    pub(crate) fn cents(&self) -> u32 { self.cents }   // for shop.rs, not for you
}
```

`shop.rs` calls `sum.cents()` for its receipt. A user of the crate
can't:

```
error[E0624]: method `cents` is private
```

TypeScript has no such level. `ts/money.ts` must `export` the class for
`shop.ts` to use it, and then any importer can call `cents()`. The usual
answer is a barrel file, `index.ts`, that re-exports only the public
names, and a hope that nobody imports past it.

Rust's module privacy holds that line. `mod money` is private, so
outside the crate, `chapter_20_modules_and_crates::money::Money` isn't a
path anyone can write (E0603). Both refusals are doc tests in `lib.rs`
that must fail to compile.

## `pub use`: the crate's front door

```rust
pub use money::Money;
```

This re-exports `Money` at the crate's root: users write
`chapter_20_modules_and_crates::Money`, and the crate can move `Money`
to any module later without breaking them. It's `index.ts`'s
`export { Money } from './money.ts'`, with one difference: the module it
comes from can stay private.

## Crates from crates.io

A dependency is a line in `Cargo.toml`:

```toml
[dependencies]
heck = "=0.5.0"
```

Cargo downloads it, builds it, and records the exact version in
`Cargo.lock`. `heck` converts names between cases; bringing its trait in
scope, `use heck::ToKebabCase`, gives every string a `.to_kebab_case()`
method (chapter 13: you can implement your trait for types you didn't
write, and that's what `heck` did for `str`).

The TypeScript side has no dependencies, so `ts/kebab.ts` writes the
conversion by hand. Both give `fancy-mug`, `usb-cable` and
`xml-http-request-book`:

```
ts:   ["fancy-mug $12.50","usb-cable $7.99","xml-http-request-book $30.00","total $50.49 (5049 cents)"]
rust: ["fancy-mug $12.50","usb-cable $7.99","xml-http-request-book $30.00","total $50.49 (5049 cents)"]
```

## What rust-js writes

Each module is its own JavaScript file, `money.js` and `shop.js`, with
its own `.d.ts`. A `use` is an `import`:

```js
// rust/src/shop.js (generated)
import { Money } from "./money.js";
import { strToKebabCase } from "../../../../rust-js/crates/heck-0.5.0/src/kebab.js";
```

A crate from crates.io is compiled too, into `rust-js/crates/` at the
workspace root, and committed like the rest of the generated JS. That's
why this repo keeps the compiler itself in `vendor/rust-js`: the app's
`rust-js/crates/` is rust-js's fixed place for dependencies.

A `pub(crate)` method is JavaScript like any other, `Money.cents`, since
`shop.js` calls it. But it isn't declared: the `.d.ts` has only the
crate's public API, so a TypeScript caller can't use it either
(`types.check.ts`).

One gap, found writing this chapter: `lib.rs` here holds nothing but its
`mod`s and a `pub use` of a type, which has no JavaScript, and rust-js
writes no `lib.d.ts` for it, so the re-export is lost. A TypeScript
caller imports `Money` from `money.js` and the rest from `shop.js`.
That's [rust-js#2399](https://github.com/rust-js-lang/rust-js/issues/2399).

## Where it's different

- **Compilation unit.** A crate compiles as a whole, so a change to one
  module can rebuild the crate. Big projects split into several crates in
  a workspace, as this repo has one crate per chapter.
- **Features.** A crate can offer optional parts, *features*, that you
  turn on in `Cargo.toml` (`serde = { features = ["derive"] }`). npm has
  no equivalent; it's closer to choosing which entry point to import.
- **One version per major.** Cargo will build two incompatible versions
  of a crate side by side if two dependencies need them, as npm does. But
  it unifies compatible ones (`1.2` and `1.4` become one `1.4`).

## Try it

Delete `pub use money::Money;` from `lib.rs` and run `cargo test`.
`native.rs`, outside the crate, can no longer import `Money`:
`E0432: unresolved import`. Inside the crate, `shop.rs` still compiles,
since it reaches `Money` through `crate::money`. The front door was the
only way in from outside.
