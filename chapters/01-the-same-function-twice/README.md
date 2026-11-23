# 1. The same function, twice

## Start from what you know

Here's a little TypeScript: the mean of some numbers, and the largest.
Nothing clever, so that we can look at the language around it.

```ts
// ts/stats.ts
export function mean(xs: number[]): number | undefined {
  if (xs.length === 0) {
    return undefined
  }
  let sum = 0
  for (const x of xs) {
    sum += x
  }
  return sum / xs.length
}
```

And here it is in Rust:

```rust
// rust/src/lib.rs
pub fn mean(xs: &[f64]) -> Option<f64> {
    if xs.is_empty() {
        return None;
    }
    let mut sum = 0.0;
    for x in xs {
        sum += x;
    }
    Some(sum / xs.len() as f64)
}
```

Read them side by side. It's the same function: the same `if`, the same
loop, the same division. The differences are small, and each one is a
door into a chapter of this guide.

## Line by line

| TypeScript | Rust | What's going on |
|---|---|---|
| `export function` | `pub fn` | Public, so other code can call it. Rust's functions are private unless you say `pub` (chapter 20). |
| `xs: number[]` | `xs: &[f64]` | A list of numbers. `f64` is a 64-bit float, what a JavaScript `number` is; Rust has other number types too (chapter 3). The `&` means the function *borrows* the list: it reads it, and gives it back to the caller untouched (chapter 17). |
| `number \| undefined` | `Option<f64>` | Maybe a number. Rust has no `undefined`; "maybe" is a type of its own, which you must open before using what's inside (chapter 8). |
| `return undefined` | `return None` | The "nothing" case. |
| `let sum = 0` | `let mut sum = 0.0` | In Rust, a variable can't change unless you say `mut` (chapter 2). And `0.0` is a float; `0` would be an integer, and Rust won't add a float to an integer without being asked. |
| `return sum / xs.length` | `Some(sum / xs.len() as f64)` | `Some(..)` wraps the number in the "maybe". `xs.len()` is a whole number, so `as f64` turns it into a float before dividing (chapter 3). The last line has no `;` and no `return`: it's the value the function gives back (chapter 5). |

Two things are missing from the Rust, and you won't miss them: there's
no `!== undefined` check before using `sum`, and no runtime type check
anywhere. The compiler checked it all before the program ran.

## What rust-js writes

Now compile the Rust with rust-js (`bun run rust`) and look at the
JavaScript it writes:

```js
// rust/src/lib.js (generated)
export function mean(xs) {
  if (xs.length === 0) {
    return;
  }
  let sum = 0;
  for (let i = 0; i < xs.length; i++) {
    const x = xs[i];
    sum += x;
  }
  return sum / xs.length;
}
```

That's your TypeScript, with the types taken off. `None` is `undefined`
(`return;`), `Some(x)` is just `x`, and the borrowed list is the same
JavaScript array you passed in. rust-js also writes the types back out,
for TypeScript callers:

```ts
// rust/src/lib.d.ts (generated)
export function mean(xs: number[]): number | null | undefined;
```

(Why `| null` too? Chapter 8 has the story.)

## Side by side

`bun chapters/01-the-same-function-twice/compare.ts` runs both on the
same inputs:

```
[0.1,0.2]   (two that don't add up exactly)
  ts:   2 numbers, mean 0.15000000000000002, largest 0.2
  rust: 2 numbers, mean 0.15000000000000002, largest 0.2
[]   (no numbers at all)
  ts:   no numbers
  rust: no numbers
```

Even the float that doesn't come out exactly, `0.15000000000000002`,
comes out the same, because both are IEEE 754 doubles, printed the
shortest way that reads back exactly.

## How every chapter works

Each chapter has the same parts, so you always know where to look:

- `ts/`: the TypeScript way.
- `rust/src/lib.rs`: the Rust way. Beside it, `lib.js` and `lib.d.ts`,
  what rust-js wrote. They're committed, so you can read them without
  building anything.
- `cases.json`: inputs, and what native Rust says of each.
- `compare.ts`: run it to see both side by side.
- `compare.test.ts`: checks the TypeScript and the compiled Rust against
  `cases.json`. `rust/tests/native.rs` checks native Rust against it too,
  so the JavaScript rust-js writes must say what real Rust says.
- `types.check.ts`: what TypeScript itself sees of the compiled Rust,
  checked by `tsc`.

## Try it

In `lib.rs`, delete `mut` from `let mut sum` and run `cargo build`. Rust
refuses: `cannot borrow sum as mutable, as it is not declared as
mutable`. Then put it back, and change `0.0` to `0`. Rust refuses again,
twice: `cannot add-assign &f64 to {integer}`, and `cannot divide
{integer} by f64`. Two things TypeScript never asks of you: saying a
variable will change, and saying what kind of number it is. That's
chapter 2 and chapter 3.
