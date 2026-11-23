# 8. `null` is `Option`

## The billion-dollar mistake, and TypeScript's fix

Tony Hoare, who invented `null`, called it his billion-dollar mistake: any
value might secretly be missing, and using a missing one crashes.
TypeScript's `strictNullChecks` fixes most of it. `string | undefined` is
a different type from `string`, and you must check before using it. Then
`?.` and `??` make checking short:

```ts
// ts/team.ts
export function callThem(person: Person): string {
  return person.nickname ?? person.name
}

export function managersName(team: Person[], name: string): string | undefined {
  const manager = find(team, name)?.manager
  // ..
}
```

## The Rust way: there is no `null`

Rust goes one step further: there's no `null` and no `undefined` at all.
A value that may be missing has its own type, `Option<T>`, an ordinary
enum (chapter 7) with two variants:

```rust
enum Option<T> {
    Some(T),
    None,
}
```

A `String` is always a string. An `Option<String>` is maybe one, and you
can't use it as a string until you've said what happens when it isn't
there. The tools map closely onto TypeScript's:

| TypeScript | Rust |
|---|---|
| `x ?? fallback` | `x.unwrap_or(fallback)` |
| `x?.length` | `x.map(\|s\| s.len())` |
| `const y = x?.y` inside a function that returns early | `let y = x?;` |
| `x!` (trust me) | `x.unwrap()` (checked: panics if `None`) |
| `if (x !== undefined) { .. }` | `if let Some(x) = x { .. }` or a `match` |

```rust
// rust/src/lib.rs
pub fn call_them(person: &Person) -> &str {
    person.nickname.as_deref().unwrap_or(&person.name)
}
```

## `?` is optional chaining for a whole function

The `?` after an `Option` means: if this is `None`, return `None` from
the function right now; otherwise, here's what's inside.

```rust
pub fn managers_name(team: &[Person], name: &str) -> Option<String> {
    let person = find(team, name)?;
    let manager = find(team, person.manager.as_deref()?)?;
    Some(call_them(manager).to_string())
}
```

Three things might be missing: the person, their manager's name, the
manager on the team. Each `?` handles one, and the code reads as if
nothing could go wrong. It's `?.`, applied to a whole function body
instead of one expression.

## `!` and `unwrap()`: the difference

TypeScript's `x!` tells the type checker "trust me, it's there", and if
you're wrong you find out later, as an `undefined` somewhere else. Rust's
`x.unwrap()` checks: if it's `None`, the program panics *right there*,
with the line number. Use it only where `None` really can't happen, or in
tests; `expect("why it can't be None")` is the same with a message.

## What rust-js writes

`Some(x)` is just `x`, and `None` is `undefined`, so the JavaScript is the
TypeScript you'd write:

```js
// rust/src/lib.js (generated)
export function callThem(person) {
  return person.nickname ?? person.name;
}

export function managersName(team, name) {
  const person = find(team, name);
  if (person == null) {
    return;
  }
  // ..
}
```

### Why the `.d.ts` says `T | null | undefined`

Chapter 1 promised this. rust-js reads `None` from TypeScript as either
`null` or `undefined` (it tests `== null`, which matches both), so you
may pass in either. Its declarations keep to a looser promise for what
comes out, `T | null | undefined`, so a TypeScript caller tests with
`??` or `== null` and is right either way.

When a caller needs exactly `null`, because that's what an API or a JSON
format expects, mark the function `#[rust_js::nullable]`:

```rust
#[cfg_attr(rust_js, rust_js::nullable)]
pub fn managers_name_or_null(team: &[Person], name: &str) -> Option<String> {
    managers_name(team, name)
}
```

Its `None` is `null`, and its declaration is the stricter `string | null`:

```
Ada
  manager's name  ts: undefined  rust: undefined  rust, nullable: null
Grace
  manager's name  ts: Countess   rust: Countess   rust, nullable: Countess
```

## Where it's different

- **No accidental `undefined`.** In TypeScript, `undefined` is also what
  a missing property, a missing argument or an out-of-range index gives
  you. In Rust each of those is a compile error, or an `Option` you can
  see (`v.get(i)`, chapter 10).
- **Struct fields.** An `Option` field is declared `nickname?: string |
  undefined`: optional, exactly the TypeScript you'd write.
- **`Option<Option<T>>` exists.** "Maybe a maybe" is a real type in Rust
  (a setting that's unset, or set to nothing). JavaScript has no way to
  nest `undefined`, so rust-js boxes the inner one. It's rare, and
  rust-js's guide has the details.

## Try it

In `call_them`, replace `.unwrap_or(&person.name)` with `.unwrap()` and
run `cargo test`. It compiles, since you told Rust you're sure, and then
the test panics on Grace, who has no nickname: `called Option::unwrap()
on a None value`, with the line. That's `!` with the check left in.
