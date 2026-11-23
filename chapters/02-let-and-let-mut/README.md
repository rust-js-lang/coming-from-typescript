# 2. `let` and `let mut`

## What `const` really promises

TypeScript has `const` and `let`. `const` means the *name* can't be
pointed somewhere else. It says nothing about the thing the name points
at:

```ts
const cart = ['apple']
cart.push('fig')        // fine: the array changed, the name didn't
cart = []               // error: the name can't change
```

So when you call a function and hand it your array, can it change it?
You have to read the function to find out:

```ts
// ts/cart.ts
export function addItem(cart: string[], item: string): void {
  cart.push(item)       // your array changes
}

export function withItem(cart: readonly string[], item: string): string[] {
  return [...cart, item]   // yours doesn't
}
```

`readonly` helps, if the author remembered to write it.

## The Rust way: nothing changes unless you say so

Rust's rule is simpler and stricter: **a value can't change unless it's
declared `mut`**, the variable and everything you reach through it.

```rust
let cart = vec!["apple".to_string()];
cart.push("fig".to_string());   // error: cannot borrow `cart` as mutable

let mut cart = vec!["apple".to_string()];
cart.push("fig".to_string());   // fine: you said it may change
```

And it goes through function calls. A function that changes what you give
it must say so in its signature, with `&mut`. And so must you, when you
call it:

```rust
// rust/src/lib.rs
pub fn add_item(cart: &mut Vec<String>, item: &str) {
    cart.push(item.to_string());
}

pub fn with_item(cart: &[String], item: &str) -> Vec<String> {
    let mut more = cart.to_vec();
    more.push(item.to_string());
    more
}
```

```rust
// rust/tests/native.rs
let more = with_item(&cart, "pear");   // `&`: lend it, to be read
add_item(&mut cart, "fig");            // `&mut`: lend it, to be changed
```

Reading the call is enough to know: `&cart` can't change your cart,
`&mut cart` might. TypeScript's `readonly` is opt-in; Rust's is the
default, and opting out is visible at both ends.

## Shadowing: the same name, step by step

One more thing `let` does in Rust: you may declare the same name again,
and the new one hides the old. It's handy for a value you refine in
steps:

```rust
pub fn slug(name: &str) -> String {
    let name = name.trim();
    let name = name.to_lowercase();
    let name = name.replace(' ', "-");
    name
}
```

Each `name` is a new variable; nothing was mutated. TypeScript won't
declare `name` twice, so the TS version needs `trimmed`, `lower` and
`dashed`. Shadowing can even change the type: `let age = age.trim();`
then `let age: u32 = age.parse()?;`. You'll see it in later chapters.

## What rust-js writes

```js
// rust/src/lib.js (generated)
export function slug(name) {
  name = $trim(name);
  name = $toLowercase(name);
  name = name.replaceAll(" ", "-");
  return name;
}

export function addItem(cart, item) {
  cart.push(item);
}

export function withItem(cart, item) {
  const more = cart.slice();
  more.push(item);
  return more;
}
```

Shadowing becomes plain reassignment, since JavaScript doesn't need the
distinction once the checks are done. A `&mut Vec` is your array itself,
so `addItem` pushes onto it, as the TypeScript does. `compare.ts` shows
both:

```
ts: withItem(cart, 'pear') gives ["apple","pear"]; your cart is ["apple"]
ts: addItem(cart, 'fig');            your cart is ["apple","fig"]
rust: withItem(cart, 'pear') gives ["apple","pear"]; your cart is ["apple"]
rust: addItem(cart, 'fig');            your cart is ["apple","fig"]
```

## Where it's different

- **The promise reaches the `.d.ts`, as `readonly`.** rust-js declares a
  `&[String]` parameter `readonly string[]`, so a TypeScript caller can
  pass a frozen array where Rust only reads, and a `&mut Vec<String>` one
  `string[]`, which refuses a frozen array (`types.check.ts`). This
  chapter found that rust-js used to write `string[]` for both, and fixed
  it: [rust-js#2392](https://github.com/rust-js-lang/rust-js/issues/2392).
- **But `string[]` doesn't say "changes it".** A `string[]` parameter
  might be changed or might not; TypeScript has no word for `&mut`. Only
  the `readonly` side is a promise TypeScript can check.
- **Deep, not shallow.** TypeScript's `readonly string[]` stops at the
  array: the objects in it can still change. Rust's `&` reaches all the
  way down. Nothing you can reach through a `&` can change, unless it's
  built for sharing (chapter 19).

## Try it

In `native.rs`, change `add_item(&mut cart, "fig")` to
`add_item(&cart, "fig")` and run `cargo test`. Rust refuses: `mismatched
types`, `types differ in mutability`. You can't hand over for changing what you only
meant to lend for reading.
