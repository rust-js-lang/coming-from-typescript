# 22. Testing

## Tests in TypeScript

A TypeScript project picks a runner (bun's, vitest, jest), and keeps
tests in files of their own:

```ts
// ts/duration.test.ts
import { expect, test } from 'bun:test'
import { parseDuration } from './duration.ts'

test('hours and minutes add up', () => {
  expect(parseDuration('1h30m')).toBe(5400)
})
```

A test file is a module like any other, so it can only reach what
`duration.ts` exports.

## Tests in Rust: built in

Rust's test runner comes with the language. A test is a function marked
`#[test]`, and `cargo test` finds and runs them all. There's nothing to
install and nothing to configure.

### Unit tests live beside the code

```rust
// rust/src/lib.rs
fn unit_seconds(unit: char) -> Option<u32> { .. }   // private

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn hours_and_minutes_add_up() {
        assert_eq!(parse_duration("1h30m"), Ok(5400));
    }

    #[test]
    fn a_private_helper_is_tested_from_its_own_file() {
        assert_eq!(unit_seconds('m'), Some(60));
    }
}
```

- **`#[cfg(test)]`** compiles the module only for `cargo test`; it isn't
  in the real build at all.
- **`use super::*`** brings in everything from the file, private items
  too. A child module sees its parent's privates, so unit tests can test
  helpers that aren't part of the API, with no `export` just for testing.

### The assertions

| bun / jest | Rust |
|---|---|
| `expect(a).toBe(b)`, `.toEqual(b)` | `assert_eq!(a, b)` (compares with `==`, chapter 6) |
| `expect(a).not.toBe(b)` | `assert_ne!(a, b)` |
| `expect(ok).toBe(true)` | `assert!(ok)`, `assert!(ok, "message {x}")` |
| `expect(() => f()).toThrow('x')` | `#[should_panic(expected = "x")]` on the test |
| `test.skip` | `#[ignore]` |
| an `async` test that rejects | a test that returns `Result`, failing on `Err` |

A test can return a `Result`, so `?` works inside it:

```rust
#[test]
fn a_test_can_use_question_mark() -> Result<(), String> {
    let seconds = parse_duration("2m5s")?;
    assert_eq!(seconds, 125);
    Ok(())
}
```

And a test can require a panic, for the bugs that should crash (chapter 9):

```rust
#[test]
#[should_panic(expected = "divide by zero")]
fn sharing_among_nobody_panics() {
    share(60, 0);
}
```

In TypeScript, `share(60, 0)` is `Infinity`, quietly.

A failed `assert_eq!` shows both sides:

```
assertion `left == right` failed
  left: Ok(5400)
 right: Ok(5401)
```

### Integration tests see what a user sees

Files in `tests/` are *integration tests*. Each is a crate of its own
that uses the library as a user would, through its public API alone.
Every chapter's `rust/tests/native.rs` is one: it runs the chapter's
cases against native Rust.

### Doc tests

A code block in a `///` comment is compiled and run too, so examples in
documentation can't go stale. Chapter 7's `compile_fail` test and chapter
20's two use this to prove that something *doesn't* compile.

## What rust-js writes: the same tests, as JavaScript

`rust-js test` compiles a crate's tests into JavaScript test files and
runs them with the runner the crate names. This one names bun:

```toml
# rust/Cargo.toml
[package.metadata.rust-js.test]
runner = "bun"
```

```
$ bun vendor/rust-js/tooling/cli.js test --package chapter-22-testing
bun test v1.4.4

 6 pass
 0 fail
Ran 6 tests across 2 files.
```

That's the five unit tests from `lib.rs`, private helper and
`should_panic` included, and the integration test `native.rs`, run as
JavaScript. Each `#[test]` becomes a `test(..)` of `bun:test`, and a
failed assertion fails with the same message:

```
error: assertion `left == right` failed
  left: Ok(5400)
 right: Ok(5401)
(fail) tests::hours_and_minutes_add_up
```

`bun run test` runs this too, after `cargo test`, so the chapter's Rust
tests pass in both places. Testing natively is quick. Testing as
JavaScript checks the code you actually ship.

## Where it's different

- **No mocking library.** Rust has no monkey-patching: you can't replace
  a function at run time. Code that needs a fake takes it as a parameter,
  a trait (chapter 13) with a real `impl` and a test one.
- **Tests run in parallel by default**, each on its own thread, and tests
  that share state must say so (`--test-threads=1`, or a lock).
- **Snapshots and properties are crates.** `insta` for snapshot tests,
  `proptest` or `quickcheck` for property tests, as `fast-check` is for
  TypeScript.

## Try it

In `lib.rs`'s `hours_and_minutes_add_up`, change `Ok(5400)` to
`Ok(5401)`. Run `cargo test -p chapter-22-testing`, then
`bun vendor/rust-js/tooling/cli.js test --package chapter-22-testing`.
Both fail the same test, with the same `left` and `right`.
