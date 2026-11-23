# 16. Moves

This is the chapter where Rust stops looking like TypeScript with
different spelling. Chapters 16 to 19 are about one idea, *ownership*,
and it starts with a bug you've probably written.

## Two names, one array

```ts
// ts/moves.ts
export function checkout(cart: string[]): Order {
  return { items: cart, count: cart.length }
}

const cart = ['apple']
const order = checkout(cart)
cart.push('pear')
```

```
order is {"items":["apple","pear"],"count":1}: count says 1, items say 2
```

The order kept the caller's array, not a copy of it. JavaScript objects
are shared by reference, so `cart` and `order.items` are two names for
one array, and a push through either changes both. The order now
contradicts itself. Nothing in the types says this can happen.

## One owner

Rust's rule: **every value has exactly one owner.** When you pass a
`Vec` to a function that takes it by value, you give it away. The value
*moves*, and the old name is finished:

```rust
// rust/src/lib.rs
pub fn checkout(cart: Vec<String>) -> Order {
    let count = cart.len();
    Order { items: cart, count }
}
```

```rust
let mut cart = vec!["apple".to_string()];
let order = checkout(cart);
cart.push("pear".to_string());
```

```
error[E0382]: borrow of moved value: `cart`
  |         -------- move occurs because `cart` has type `Vec<String>`, which does not implement the `Copy` trait
  |                          ---- value moved here
  |     ^^^^ value borrowed here after move
help: consider cloning the value if the performance cost is acceptable
```

The bug can't be written. After `checkout(cart)`, only the order owns
those items, so only the order can change them.

## `clone`: a copy you ask for

When you really want two independent values, say so:

```rust
pub fn order_twice(cart: Vec<String>) -> (Order, Order) {
    let first = checkout(cart.clone());   // a copy goes in
    let second = checkout(cart);          // the cart itself goes in
    (first, second)
}
```

`clone` is the compiler's own suggestion above. It's never implicit:
copying a big `Vec` costs time and memory, so Rust makes you write it
where it happens, where you can see it.

## `Copy`: values too small to bother moving

Numbers, `bool`, `char`, and small structs that derive `Copy` are copied
when passed, and the old name stays usable:

```rust
#[derive(Debug, Clone, Copy, PartialEq)]
pub struct Point { pub x: f64, pub y: f64 }

pub fn step(p: Point) -> (Point, Point) {
    let moved = Point { x: p.x + 1.0, ..p };
    (p, moved)   // `p` is still here: it was copied, not moved
}
```

A type can be `Copy` only if all of its fields are. A `String` or a
`Vec` owns memory elsewhere, so they never are: copying one means
`clone`.

## Drop: cleanup when the owner is done

Because every value has one owner, Rust knows exactly when a value is no
longer needed: when its owner goes out of scope. Then it's *dropped*,
and if its type implements `Drop`, that code runs. This is chapter 9's
"no `finally`":

```rust
impl Drop for Section<'_> {
    fn drop(&mut self) {
        self.log.push(format!("close {}", self.name));
    }
}

fn write_all(log: &mut Vec<String>, lines: &[String]) -> Result<(), String> {
    let mut file = Section::open(log, "file");
    for (i, line) in lines.iter().enumerate() {
        if line.is_empty() {
            return Err(format!("line {} is empty", i + 1));
        }
        file.note(line);
    }
    Ok(())
}
```

There are two ways out of `write_all`: the early `return Err`, and the
end. The section closes on both, because `file` goes out of scope on
both. TypeScript needs `try { .. } finally { log.push('close file') }`
and you must remember to write it. In Rust the type remembers: a file,
a lock, a connection closes itself.

```
save ["title","","never written"]
  ts:   ["open file","  title","close file","failed: line 2 is empty"]
  rust: ["open file","  title","close file","failed: line 2 is empty"]
```

## What rust-js writes

A move costs nothing. Since Rust has proved nobody uses `cart` again,
there's nothing to copy:

```js
// rust/src/lib.js (generated)
export function checkout(cart) {
  const count = cart.length;
  return { items: cart, count };
}

export function orderTwice(cart) {
  const first = checkout(cart.slice());   // the clone
  const second = checkout(cart);
  return [first, second];
}
```

And `Drop` is written out at every exit, the `finally` by hand:

```js
    if (line === "") {
      result = { TAG: "Err", _0: `line ${i + 1} is empty` };
      file.log.push(`close ${file.name}`);
      return result;
    }
```

(with `$cleanup` calls for a panic on the way, too).

### At the boundary, you're the one who keeps the rule

`checkout`'s JavaScript keeps the array it was given, because Rust
promised no one else would use it. But a *TypeScript* caller isn't
checked by Rust:

```ts
const cart = ['apple']
const order = rust.checkout(cart)
cart.push('pear')   // compiles; order.items is now ['apple', 'pear']
```

The `.d.ts` says what it can: a by-value `Vec` is `string[]`, one the
function may change, where a borrowed `&[String]` is `readonly string[]`.
TypeScript has no way to say "and you can't use it after". So the rule
for calling rust-js from TypeScript: **what you pass to a by-value
parameter, you've given away.** Pass a copy (`[...cart]`) if you still
need it. `compare.test.ts` holds what happens if you don't.

## Where it's different

- **Assignment moves too.** `let a = vec![1]; let b = a;` moves the
  `Vec` into `b`, and `a` is finished. TypeScript's `const b = a` makes
  a second name for the same array.
- **Returning gives it back.** A function can take a value and return
  it, or something made from it, handing ownership back to the caller.
  That's `checkout`: the cart goes in, the order comes out.
- **Borrowing is the everyday tool.** Moving a value in just to read it
  would be clumsy. Most functions *borrow*, `&cart`, and the caller
  keeps it. That's the next chapter.

## Try it

In a test, write:

```rust
let mut cart = vec!["apple".to_string()];
let order = checkout(cart);
cart.push("pear".to_string());
```

and run `cargo test`: E0382, pointing at the move and the use after.
Then take the compiler's advice, `checkout(cart.clone())`, and it
compiles. The order and the cart are two values now, and the push only
changes the cart.
