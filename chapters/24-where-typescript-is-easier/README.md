# 24. Where TypeScript is easier

Twenty-three chapters have shown what Rust checks that TypeScript
doesn't. A fair guide ends with the other side: what TypeScript makes
easy that Rust makes you work for. None of it is a flaw in either. Each
is a price paid for something. It's worth knowing the prices before you
choose.

## Three things you write without thinking

### 1. A default argument

```ts
// ts/easier.ts
export const greet = (name: string, greeting = 'Hello') => `${greeting}, ${name}!`

greet('Ada')
```

Rust has no default arguments and no overloading. A parameter that may be
left out is an `Option`, and every caller writes it:

```rust
// rust/src/lib.rs
pub fn greet(name: &str, greeting: Option<&str>) -> String {
    format!("{}, {name}!", greeting.unwrap_or("Hello"))
}

greet("Ada", None)
```

For a function with many settings, Rust code uses a struct of options
with `Default` (`Options { verbose: true, ..Default::default() }`) or a
builder. Both are more to write than `= 'Hello'`.

### 2. `Partial<User>`

```ts
export const update = (user: User, patch: Partial<User>): User => ({ ...user, ...patch })
```

One line. `Partial` makes the patch type from `User`, and the spread
merges. TypeScript's type system can compute types from types:
`Partial`, `Pick`, `Omit`, `keyof`, mapped and conditional types.

Rust can't. The patch is a second struct, written by hand:

```rust
pub struct UserPatch {
    pub name: Option<String>,
    pub email: Option<String>,
    pub age: Option<u32>,
}

pub fn update(user: &User, patch: &UserPatch) -> User {
    User {
        name: patch.name.clone().unwrap_or_else(|| user.name.clone()),
        email: patch.email.clone().unwrap_or_else(|| user.email.clone()),
        age: patch.age.unwrap_or(user.age),
    }
}
```

and kept in step by hand. Add a `phone` to `User` and Rust stops you:
`E0063: missing field phone in initializer of User`. That's useful, but
`UserPatch` gets no `phone` until you write one. (Macros can generate
it, and crates do, at the cost of a dependency and a macro to understand.)

### 3. Objects that point at each other

A tree whose nodes know their parents:

```ts
interface Node {
  name: string
  parent?: Node
}

for (const [child, parent] of edges) node(child).parent = node(parent)
```

In TypeScript, objects hold references to each other freely, cycles
included, and the garbage collector sorts it out. In Rust, a value has
one owner (chapter 16), so a parent that owns its children *and* children
that point at their parent is a fight. You can have it with `Rc` and
`Weak` (chapter 19). The usual answer is an *arena*: every node in one
`Vec`, and a "pointer" is an index:

```rust
struct Node {
    name: String,
    parent: Option<usize>,
}
```

It works well and it's fast. It's also a design you have to choose, where
TypeScript lets you just write the obvious thing.

## And the rest of the list

- **Iteration speed.** `bun` runs a TypeScript file in milliseconds.
  `cargo build` compiles a crate and its dependencies, and a large
  project takes seconds or minutes to rebuild. Rust's checks happen at
  compile time, and that's where you wait.
- **Prototyping.** `JSON.parse` gives you a value to poke at at once. In
  Rust, you describe the shape first (serde, a struct), or work with
  `serde_json::Value` and `match` your way down. TypeScript's `any` lets
  you defer the question; Rust doesn't.
- **Closures and callbacks.** A TypeScript callback captures whatever it
  likes. A Rust closure that outlives its function must own what it
  captures (`move`), and one that changes shared state needs `Rc<RefCell>`
  or a channel. Event-heavy UI code feels this most.
- **Strings.** `s[0]`, `s.slice(1, 3)` and `a + b` just work in
  TypeScript. Rust's `String` and `&str`, byte offsets that must land on
  characters (chapter 4), and `format!` take getting used to.
- **The ecosystem for the web.** npm has a package for everything a
  browser app needs. Rust's web crates are good and fewer, which is part
  of why rust-js binds JavaScript's instead (chapter 23).

## What rust-js gives back

At the boundary, rust-js hands TypeScript callers two of the three
conveniences:

```ts
// rust/src/lib.d.ts (generated)
export function greet(name: string, greeting?: string | null | undefined): string;
export interface UserPatch {
    name?: string | undefined;
    email?: string | undefined;
    age?: number | undefined;
}
```

A trailing `Option` parameter is an optional one: TypeScript calls
`rust.greet('Ada')`. And `UserPatch`, a struct of `Option` fields, *is*
`Partial<User>` to TypeScript, so the same object literal fits both
(`types.check.ts`). Rust callers still write `None` and `UserPatch`, but
TypeScript callers don't notice.

## So, when?

Choose TypeScript when you'd mostly pay these prices and rarely collect
on the checks: a UI that changes weekly, a script, a prototype. Choose
Rust, here with rust-js, for code where the checks pay for themselves:
logic that must be right (money, parsing, permissions), code shared with
a native server, anything where a `null`, an unhandled variant, an
aliased array or a swapped argument would be expensive. Mixing them is
the point of this whole guide. The `.d.ts` lets TypeScript call Rust
where it matters, and leaves the rest in TypeScript.

## Try it

Add `pub phone: String,` to `User` in `lib.rs` and run `cargo build`:
E0063, `update` is missing `phone`. Add `phone: string` to the
TypeScript `User`: `update` still compiles, and `Partial<User>` already
has `phone?`. Neither is wrong. Rust told you about every place the new
field matters; TypeScript adapted without asking.
