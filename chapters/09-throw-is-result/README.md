# 9. `throw` is `Result`

## The error you can't see

Here's TypeScript's whole story about this function:

```ts
export function pay(accounts: Account[], from: string, to: string, amount: string): number
```

It returns a number. Nothing says it might not. In fact it throws in
five different ways: a bad amount, missing cents, an unknown account, the
same account twice, not enough money. You find that out by reading the
body, or in production. And when you catch it, TypeScript gives you
`catch (e: unknown)`: it doesn't know what was thrown either.

## The Rust way: failing is part of the return type

Rust has no exceptions for expected failures. A function that can fail
returns a `Result`, an enum (chapter 7):

```rust
enum Result<T, E> {
    Ok(T),     // it worked, and here's the value
    Err(E),    // it didn't, and here's why
}
```

```rust
// rust/src/lib.rs
pub fn transfer(accounts: &mut [Account], from: &str, to: &str, cents: u32) -> Result<(), TransferError>
```

The signature now says all of it: this changes the accounts (`&mut`),
and it either works, giving nothing, `()`, or fails with a
`TransferError`. And `TransferError` lists every way it can fail:

```rust
pub enum TransferError {
    UnknownAccount { name: String },
    NotEnough { needed: u32, has: u32 },
    SameAccount,
}
```

A caller can't use the `Ok` value without opening the `Result`, so it
can't forget the failure. And a `match` on the error must handle every
kind, so adding a fourth kind next year shows every place to update.

## `?`: pass the error up

Checking every `Result` by hand would be noisy. The `?` from chapter 8
works on `Result` too: if it's an `Err`, return it from this function
now; if it's `Ok`, here's the value.

```rust
pub fn transfer(accounts: &mut [Account], from: &str, to: &str, cents: u32) -> Result<(), TransferError> {
    let from = position(accounts, from)?;
    let to = position(accounts, to)?;
    if from == to {
        return Err(TransferError::SameAccount);
    }
    // ..
    Ok(())
}
```

That's what `throw` gives you, an early exit on failure, but visible:
each `?` marks exactly where this function can stop early. A function can
also turn one error into another on the way up: `pay` makes each error a
message with `.map_err(|error| error.to_string())?`.

## And panics?

Rust does have something like `throw`: `panic!`, which unwinds and, by
default, ends the program. It's for *bugs*, things that should never
happen: an index past the end, an `unwrap()` on `None`. Failures that are
part of normal life (bad input, a missing account) are `Result`s. That
split is the heart of it: if a caller should handle it, it's in the type.

## What rust-js writes

A `Result` is an object with a `TAG`, and `?` is the check you'd write by
hand:

```js
// rust/src/lib.js (generated)
export function transfer(accounts, from, to, cents) {
  const result = position(accounts, from);
  if (result.TAG === "Err") {
    return result;
  }
  from = result._0;
  // ..
  if (from === to) {
    return { TAG: "Err", _0: { kind: "same" } };
  }
```

And the `.d.ts` gives TypeScript callers the whole story:

```ts
// rust/src/lib.d.ts (generated)
export type TransferError = { kind: "unknown"; name: string } | { kind: "short"; needed: number; has: number } | { kind: "same" };

export function transfer(accounts: Account[], from: string, to: string, cents: number):
    { TAG: "Ok"; _0?: undefined } | { TAG: "Err"; _0: TransferError };
```

A TypeScript caller has to check `TAG` before it uses the value
(`types.check.ts`), and can `switch` on the error's `kind`: the failure
is a value to match, not a message to parse.

## Side by side

`bun chapters/09-throw-is-result/compare.ts`:

```
pay 10.00 from ada to grace
  ts:   paid 1000
  rust: Ok(1000)
pay 1000.00 from ada to grace
  ts:   threw: needs 100000 cents, has 5000
  rust: Err(needs 100000 cents, has 5000)
```

The same payments, the same words. The difference is where the failure
is: thrown past the signature on one side, returned in the type on the
other. `compare.test.ts` also checks that a failed payment leaves both
accounts untouched, on both sides.

## Where it's different

- **More typing at each call.** Every fallible call is a `?` or a
  `match`. That's the point, and `?` keeps it to one character.
- **No `finally`.** Cleanup in Rust happens when a value goes out of
  scope (chapter 16), so there's nothing to `finally`.
- **Libraries help.** Real Rust code often uses the `thiserror` crate to
  write the `Display` impl and the error enum for you, and `anyhow` for
  "any error, with context" in applications.

## Try it

In `pay`, delete the `?` after `parse_cents(amount)` and run
`cargo build`. Rust refuses: `cents` is now a `Result<u32, String>`, and
`transfer` wants a `u32`. You can't use the amount without saying what
happens when it isn't one.
