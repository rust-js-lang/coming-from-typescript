# 23. Calling JS, called from TS

Every chapter so far has been TypeScript calling Rust: rust-js writes
JavaScript and a `.d.ts`, and TypeScript calls it like any module. This
chapter covers both directions, Rust calling your TypeScript, and
TypeScript handing Rust a function.

## Rust calls TypeScript: a binding

Formatting money well is hard: symbols, digit grouping, and currencies
like the yen that have no cents. JavaScript's `Intl.NumberFormat` already
knows all of it. So the TypeScript does the formatting:

```ts
// ts/currency.ts
export function formatMoney(minor: number, currency: string): string {
  const format = new Intl.NumberFormat('en-US', { style: 'currency', currency })
  const digits = format.resolvedOptions().maximumFractionDigits ?? 2
  return format.format(minor / 10 ** digits)
}
```

and the Rust *declares* it, a *binding*:

```rust
// rust/src/lib.rs
#[cfg_attr(rust_js, rust_js::link_name = "../../ts/currency.ts#formatMoney")]
fn format_money(minor: u32, currency: &str) -> String {
    unreachable!("{minor} {currency}: a binding runs only in JavaScript")
}
```

`link_name` says where it is: the module before the `#`, the export after
it. Then Rust calls it like any function:

```rust
pub fn receipt(items: &[Item], currency: &str) -> Vec<String> {
    let mut lines: Vec<String> =
        items.iter().map(|item| format!("{} {}", item.name, format_money(item.price, currency))).collect();
    lines.push(format!("total {}", format_money(total(items), currency)));
    lines
}
```

rust-js turns the binding into an `import`:

```js
// rust/src/lib.js (generated)
import { formatMoney } from "../../ts/currency.ts";

export function receipt(items, currency) {
  const lines = items.map((item) => `${item.name} ${formatMoney(item.price, currency)}`);
  lines.push(`total ${formatMoney(total(items), currency)}`);
  return lines;
}
```

```
USD: ["tea $3.50","cake $12.99","total $16.49"]
EUR: ["tea €3.50","cake €12.99","total €16.49"]
JPY: ["tea ¥350","cake ¥1,299","total ¥1,649"]
```

### A binding is a promise you make

rustc checks every *call* against the binding's Rust signature. Nothing
checks the signature against the TypeScript: `u32` and `&str` are your
word for what `formatMoney` takes. Misspell the export and both
compilers are satisfied; the program fails when it loads:

```
SyntaxError: Export named 'formatMony' not found in module '.../ts/currency.ts'.
```

And natively there's no JavaScript at all: the binding's body,
`unreachable!()`, panics if it's run (`native.rs` holds that). So keep
the logic in plain Rust, like `total` and `discounted`, which `cargo test`
runs, and keep bindings thin.

For the platform itself (`fetch`, the DOM, timers, Node's `fs`), rust-js
ships binding crates, `js`, `webapi` and `node`, so you write bindings
only for your own modules and npm packages.

## TypeScript calls Rust with a function

A Rust function that takes a closure takes a TypeScript function:

```rust
pub fn discounted(items: &[Item], rule: impl Fn(&Item) -> u32) -> u32 {
    items.iter().map(|item| item.price - rule(item).min(item.price)).sum()
}
```

```ts
// rust/src/lib.d.ts (generated)
export function discounted(items: readonly Item[], rule: (item: Item) => number): number;
```

```ts
rust.discounted(items, (item) => Math.floor(item.price / 10))
```

The closure's type becomes a function type, with its parameter named.
TypeScript checks the callback you pass against it.

### The boundary trusts its types

The `.d.ts` says the callback returns a `number`. Rust promised itself a
`u32`: never negative, never a fraction. Nothing checks it at run time:

```ts
rust.discounted([{ name: 'tea', price: 350 }], () => -100)   // 450: a discount that adds
```

Native Rust can't do that, since a `u32` closure can't return `-100`.
From TypeScript, a value outside its Rust type is wrong data that the
Rust trusts. Check values where they come in from outside, or take a
wider type (`f64`, `i64`) and check it in Rust. rust-js's tracking issue
for documenting this is
[rust-js#2391](https://github.com/rust-js-lang/rust-js/issues/2391).

## The whole boundary, in one table

What each chapter's `.d.ts` showed, together:

| Rust | TypeScript sees | Chapter |
|---|---|---|
| `f64`, `i32`, `u32` | `number` | 3 |
| `u64`, `i64` | `bigint` | 3 |
| `String`, `&str`, `char` | `string` | 4 |
| a struct with `pub` fields | an `interface`, methods on `Rect.area(rect)` | 6 |
| a struct with private fields | an opaque, branded type | 15 |
| an enum, `#[rust_js::tag]` | a discriminated union | 7 |
| `#[rust_js::untagged]` | a plain union | 14 |
| `Option<T>` | `T \| null \| undefined`; `#[rust_js::nullable]`, `T \| null` | 8 |
| `Result<T, E>` | `{ TAG: "Ok"; _0: T } \| { TAG: "Err"; _0: E }` | 9 |
| `&[T]` / `&mut [T]`, `Vec<T>` | `readonly T[]` / `T[]` | 2, 10 |
| `HashMap`, `HashSet` | `Map`, `Set` | 11 |
| a tuple | `[A, B]` | 11 |
| `&mut u32` | `{ value: number }` | 17 |
| `impl Fn(A) -> B` | `(a: A) => B` | 23 |
| `async fn` | a `Promise` | 21 |
| a trait `impl` | a dictionary, `Shape<Circle>` | 13 |

## Where it's different

- **wasm-bindgen is the other road.** It compiles Rust to WebAssembly and
  generates JavaScript glue: fast for heavy number crunching, but each
  string is copied across the boundary, JS objects are reached through
  handles, and the bundle carries a `.wasm` file. rust-js writes
  JavaScript itself, so strings and objects are JavaScript's own, and the
  output reads like the TypeScript you'd write. rust-js's guide has a page
  on when each fits.
- **Names change.** `format_money` is `formatMoney` in JavaScript, and a
  binding names the JavaScript side as JavaScript spells it.

## Try it

In `lib.rs`, change `#formatMoney` to `#formatMony` and run
`bun run rust`, then `bun chapters/23-calling-js/compare.ts`. The build
is happy; the run fails as the module loads, naming the export it can't
find. Change it back.
