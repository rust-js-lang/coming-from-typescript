# 21. `async`

## The same words

```ts
// ts/shop.ts
export async function total(items: readonly string[]): Promise<number> {
  let sum = 0
  for (const item of items) sum += await price(item)
  return sum
}
```

```rust
// rust/src/lib.rs
pub async fn total(items: &[String]) -> Result<u32, String> {
    let mut sum = 0;
    for item in items {
        sum += price(item).await?;
    }
    Ok(sum)
}
```

`async fn` and `.await` read the same. Two small differences show at
once. `.await` goes after the expression, so it chains:
`price(item).await?`, where TypeScript writes `await` first and needs
parentheses to keep going. And failure is a `Result` (chapter 9), so the
first unknown item's error comes back through `?`, not a rejected promise.

The big difference is underneath.

## A promise starts; a future waits

In JavaScript, calling an async function *starts* it. It runs up to its
first `await` right away, and keeps going later whether or not anyone
awaits the promise.

In Rust, calling an `async fn` starts *nothing*. It returns a *future*: a
plan for the work, which does nothing until something *polls* it. The
`.await` is what polls it. Drop a future without awaiting it, and its
body never runs:

```rust
let future = step(&log, "step");   // nothing happens
log.borrow_mut().push("made".to_string());
drop(future);                      // never ran
```

```
made, never awaited
  ts:   ["step started","made"]
  rust: ["made"]   (native Rust, rust/tests/native.rs)
```

Being lazy is what lets Rust choose *how* to run futures. A future
doesn't belong to an event loop. It's a value, and you pick a *runtime*
to drive it: tokio for servers, a browser's event loop for the web, or,
for this chapter's tests, a ten-line `block_on` in `native.rs` that polls
until done. Rust's standard library defines futures but ships no
runtime.

## Doing things at once

`await` in a loop does one at a time, in both languages. To wait for
several at once, TypeScript has `Promise.all`. Rust's runtimes give the
same: `tokio::join!` or `futures::future::join_all`, and in rust-js,
`js::promise::all`, which *is* `Promise.all`.

## What rust-js writes

An `async fn` is an `async function`, and `.await` is `await`:

```js
// rust/src/lib.js (generated)
export async function total(items) {
  let sum = 0;
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const result = await price(item);
    if (result.TAG === "Err") {
      return result;
    }
    sum = (sum + result._0) >>> 0;
  }
  return { TAG: "Ok", _0: sum };
}
```

```ts
// rust/src/lib.d.ts (generated)
export function total(items: readonly string[]): Promise<{ TAG: "Ok"; _0: number } | { TAG: "Err"; _0: string }>;
export function receipt(items: readonly string[]): Promise<string>;
```

A TypeScript caller gets an ordinary `Promise`, and the JavaScript event
loop is the runtime. No Rust executor is shipped.

### Where lazy and eager would differ, rust-js refuses

A rust-js future is a JavaScript promise, so it starts when it's made.
For most code that changes nothing: `price(item).await` makes the future
and awaits it in one step. But code that *depends* on Rust's laziness
would run differently, and rust-js won't compile it. It doesn't quietly
change what it means. Both functions in `lib.rs`'s `lazy` module are
refused:

```
error: rust-js: this future runs as it's made, as a JS promise does, but it's dropped unawaited, where Rust's never runs (ADR 0029)
  --> chapters/21-async/rust/src/lib.rs:50:22
   |
50 |         let future = step(&log, "step");
   |                      ^^^^^^^^^^^^^^^^^^
51 |         log.borrow_mut().push("made".to_string());
52 |         drop(future);
   |         ------------ dropped here: await it, or don't make it
```

```
error: rust-js: this future runs as it's made, as a JS promise does, but code that may be seen runs before it's awaited, where Rust's runs only then (ADR 0029)
  --> chapters/21-async/rust/src/lib.rs:59:22
   |
59 |         let future = step(&log, "step");
   |                      ^^^^^^^^^^^^^^^^^^
60 |         log.borrow_mut().push("made".to_string());
   |         ---------------- this may be seen: await the future where it's made, or make it after this
```

So the module is `#[cfg(not(rust_js))]`: native Rust compiles it, and its
tests show the laziness; rust-js leaves it out.

## Where it's different

- **Nothing runs by itself.** Forgetting `.await` in TypeScript still
  runs the work, with its errors lost. In Rust, the work doesn't happen
  at all, and the compiler warns: `unused implementer of Future that must
  be used`.
- **Threads.** A Rust runtime like tokio may move futures between
  threads, so what they hold must be safe to share (`Send`): no `Rc`, no
  `RefCell` across an `.await`; `Arc` and `Mutex` instead. JavaScript has
  one thread, and rust-js's futures stay on it.
- **Cancelling is dropping.** A future you stop polling and drop is
  cancelled, its `Drop`s run (chapter 16). JavaScript promises can't be
  cancelled; that's what `AbortController` is for.

## Try it

Delete the `#[cfg(not(rust_js))]` line above `pub mod lazy` and run
`bun run rust`. rust-js refuses both functions, pointing at the future
that's made and where it's dropped or seen. Put the line back: the rest
of the chapter compiles, because nothing else relies on a future
waiting.
