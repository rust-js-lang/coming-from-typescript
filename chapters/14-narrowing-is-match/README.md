# 14. Narrowing is `match`

## Narrowing: test, and know more

TypeScript's control-flow analysis is clever. Test a value and, inside
the `if`, TypeScript knows more about it:

```ts
// ts/narrowing.ts
export type Value = number | string | Value[]

export function describe(value: Value): string {
  if (typeof value === 'number') { /* value: number */ }
  if (typeof value === 'string') { /* value: string */ }
  if (value.length === 0) return 'an empty list'          // value: Value[]
  if (value.length === 1) return `a list of just ${describe(value[0]!)}`
  // ..
}
```

The test and the use are separate steps. You test `value.length === 1`,
then reach for `value[0]` and add a `!`, because TypeScript can't tell
that the length test made the index safe.

## Patterns: test and take apart, in one step

Rust's `match` (chapter 7) does both at once. A *pattern* describes a
shape, and if the value has that shape, the pattern's names are bound to
its parts:

```rust
// rust/src/lib.rs
match value {
    Value::Number(n) if n.fract() == 0.0 => format!("the whole number {n}"),
    Value::Number(n) => format!("the number {n}"),
    Value::Text(text) if text.is_empty() => "no text".to_string(),
    Value::Text(text) => format!("the text {text:?}"),
    Value::List(items) => match items.as_slice() {
        [] => "an empty list".to_string(),
        [only] => format!("a list of just {}", describe(only)),
        [Value::Number(_), Value::Number(_)] => "a pair of numbers".to_string(),
        [first, .., last] => format!("a list from {} to {}", describe(first), describe(last)),
    },
}
```

`[only]` matches a list of exactly one item *and* names it. There's no
index to get wrong, and no `!`. Patterns nest:
`[Value::Number(_), Value::Number(_)]` is "two items, both numbers".

The toolbox:

| Pattern | Matches |
|---|---|
| `[]`, `[x]`, `[a, b]` | a slice of exactly that many |
| `[first, .., last]`, `[head, rest @ ..]` | at least that many, the rest skipped or named |
| `"north" \| "south"` | either |
| `1..=9` | a range |
| `digit @ 1..=9` | a range, keeping the value as `digit` |
| `Some(x)`, `Ok(v)`, `Point { x, .. }` | an enum's variant, a struct's fields |
| `_` | anything, unnamed |
| `pattern if condition` | the pattern, then a test (a *guard*) |

Reading a command by the shape of its words shows several at once:

```rust
match words.as_slice() {
    [] => "nothing to do".to_string(),
    ["go", direction @ ("north" | "south" | "east" | "west")] => format!("you walk {direction}"),
    ["go", elsewhere] => format!("you can't go {elsewhere}"),
    ["take", things @ ..] if !things.is_empty() => format!("you take {}", things.join(" ")),
    [verb, ..] => format!("you don't know how to {verb}"),
}
```

## Every case, checked

A `match` must cover every possible value, and that includes numbers and
slices, not just enums. Leave out `size`'s last arm, `_ => "lots"`, and
Rust names the values you forgot:

```
error[E0004]: non-exhaustive patterns: `100_u32..=u32::MAX` not covered
```

Leave out `describe`'s `[first, .., last]`, and it finds a list you didn't
think about:

```
error[E0004]: non-exhaustive patterns: `&[_, _, _, ..]` not covered
```

TypeScript's analysis only works on union types. For an `if` chain over
numbers or array lengths, it can't tell you a case is missing.

## `if let`, `let else`, `matches!`

When you care about one pattern, a whole `match` is a lot of typing:

- **`if let Some(x) = maybe { .. }`** runs the block if the pattern
  matches.
- **`let Some(x) = maybe else { return None; };`** takes the value apart
  or leaves. It's TypeScript's "return early if missing" guard, and
  afterwards `x` is just there:

  ```rust
  pub fn port(address: &str) -> Option<u16> {
      let Some((_, port)) = address.rsplit_once(':') else {
          return None;
      };
      port.parse().ok()
  }
  ```

- **`matches!(value, Value::List(_))`** is a `match` that answers
  `true` or `false`, Rust's version of a type guard (`value is Value[]`).

## What rust-js writes

The enum is `#[rust_js::untagged]`, so each variant is its payload:
a number, a string, an array. The `.d.ts` is TypeScript's own union,

```ts
export type Value = number | string | Value[];
```

and the `match` becomes the narrowing a TypeScript programmer writes:

```js
// rust/src/lib.js (generated)
export function describe(value) {
  if (typeof value === "number") {
    if (value - Math.trunc(value) === 0) {
      return `the whole number ${$displayF64(value)}`;
    }
    return `the number ${$displayF64(value)}`;
  }
  if (typeof value === "string") {
    // ..
  }
  if (value.length === 0) {
    return "an empty list";
  }
  if (value.length === 1) {
    const only = value[0];
    return `a list of just ${describe(only)}`;
  }
```

The safety was all at compile time. Once Rust has checked that every
case is covered and every index is safe, the JavaScript is the plain
version.

## Side by side

`bun chapters/14-narrowing-is-match/compare.ts`:

```
> go north
  ts:   you walk north
  rust: you walk north
> take the old lamp
  ts:   you take the old lamp
  rust: you take the old lamp
```

`compare.test.ts` runs every value, command, number and address through
both sides, with native Rust's answers.

## Where it's different

- **`typeof` is for the boundary.** Inside Rust, there's no asking what
  type a value is; its type is known. The `typeof` tests above are
  rust-js's, at the edge where a JavaScript value might be any of three.
- **Patterns go everywhere.** A `let`, a function's parameters and a
  `for` loop all take patterns: `let (x, y) = point;`,
  `fn f(&(a, b): &(i32, i32))`, `for (i, item) in list.iter().enumerate()`.
- **Order matters.** Arms are tried top to bottom, and Rust warns about
  an arm that can never be reached because an earlier one catches
  everything it would.

## Try it

Delete `size`'s last arm, `_ => "lots".to_string(),`, and run
`cargo build`. Rust tells you which numbers are left: `100_u32..=u32::MAX`.
Now try the same in `ts/narrowing.ts`: delete `return 'lots'`. TypeScript
complains only because the function must return a string; change the
return type to `string | undefined` and it's satisfied.
