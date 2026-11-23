# 19. `Rc` and `RefCell`

## When one owner isn't enough

Chapters 16 to 18 built a strict world: one owner, and many readers or
one writer. Most programs fit it well. Some shapes don't:

- a chat room that every member holds, and any of them can write to;
- a tree whose nodes point at their parents;
- a cache several parts of a program share.

In TypeScript these are ordinary: every object is shared and changeable,
and the garbage collector cleans up. Rust gives you the same, by asking,
with two tools from its standard library.

## `Rc`: count the owners

`Rc<T>` (*reference counted*) lets a value have many owners. Each
`Rc::clone` doesn't copy the value. It makes one more owner and adds one
to a count. Each owner dropped takes one away, and when the count reaches
zero, the value is dropped.

```rust
// rust/src/lib.rs
struct Member {
    name: String,
    room: Rc<Room>,
}

impl Member {
    fn join(name: &str, room: &Rc<Room>) -> Member {
        Member { name: name.to_string(), room: Rc::clone(room) }
    }
}
```

The count is there to read, `Rc::strong_count(&room)`. After three
members join and two leave, the room has two owners: the one that made
it, and the member left (`owners` and its cases).

This is what a garbage collector does for every object, done for the
values you choose, at the moment the last owner goes.

## `RefCell`: borrow rules, checked as it runs

`Rc` shares a value for reading only: with several owners, which of
them would be "the one writer"? Try to change the room's log through an
`Rc` and Rust refuses:

```
error[E0596]: cannot borrow data in an `Rc` as mutable
```

`RefCell<T>` moves chapter 17's rule from compile time to run time. You
ask it to lend, with `.borrow()` to read and `.borrow_mut()` to change,
and it counts the borrows as the program runs:

```rust
struct Room {
    log: RefCell<Vec<String>>,
    said: Cell<u32>,
}

fn say(&self, text: &str) {
    self.room.log.borrow_mut().push(format!("{}: {text}", self.name));
    self.room.said.set(self.room.said.get() + 1);
}
```

`say` takes `&self`, a shared reference, and still changes the log. This
is called *interior mutability*: the change goes through the `RefCell`,
which is allowed to lend mutably because it checks for itself.

`Cell<T>` is the light version for small `Copy` values like a counter:
no borrows, just `get` and `set` of the whole value.

## The rule still holds

`RefCell` doesn't turn the rule off. It checks it later. Read and write
at once:

```rust
pub fn read_while_writing() -> usize {
    let log = RefCell::new(vec!["hello".to_string()]);
    let reading = log.borrow();
    log.borrow_mut().push("again".to_string());
    reading.len()
}
```

```
read while writing
  ts:   2
  rust: panicked: RefCell already borrowed
```

TypeScript lets the reader and the writer share the array, and the
reader sees the change. Rust's `RefCell` panics instead, at the line of
the second borrow. You trade a compile error for a run-time one, so keep
each borrow short: borrow, use, let go.

## What rust-js writes

An `Rc` keeps its count, `{ value, strong, weak }`, because Rust code can
read it and because dropping the last owner runs the value's `Drop`:

```js
// rust/src/lib.js (generated)
const Member = {
  join(name, room) {
    return { name, room: $rcClone(room) };
  },

  say(member, text) {
    member.room.value.log.push(`${member.name}: ${text}`);
    member.room.value.said = (member.room.value.said + 1) >>> 0;
  },
};
```

`say`'s `borrow_mut` is written as a plain push here. Where a borrow
can clash, the check is kept, and it panics with native Rust's own
words:

```js
export function readWhileWriting() {
  const log = ["hello"];
  const reading = $borrow(log, "chapters/19-rc-and-refcell/rust/src/lib.rs:64:23", true);
  try {
    if (log.borrows) {
      $alreadyBorrowed("chapters/19-rc-and-refcell/rust/src/lib.rs:65:9");
    }
```

None of it crosses the boundary here: `chat` takes and returns plain
arrays.

## Where it's different

- **Reach for it last.** `Rc<RefCell<T>>` everywhere is TypeScript's
  model with extra steps and run-time panics. Most Rust code is shaped so
  one owner works: pass references down, return values up.
- **Cycles leak.** Two `Rc`s that point at each other never reach zero.
  A parent pointer is `Weak<T>`, an owner that doesn't count, and you
  `upgrade()` it to an `Option<Rc<T>>` when you need it.
- **Threads need other tools.** `Rc` and `RefCell` are for one thread.
  Their thread-safe versions are `Arc` and `Mutex`.

## Try it

In `Room`, change `log: RefCell<Vec<String>>` to `log: Vec<String>`, and
`say`'s `self.room.log.borrow_mut().push(..)` to `self.room.log.push(..)`.
Run `cargo build`: E0596, "cannot borrow data in an `Rc` as mutable". The
`Rc` shares the room for reading; the `RefCell` is what lets its owners
write.
