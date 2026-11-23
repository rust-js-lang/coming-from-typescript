# coming-from-typescript

You know TypeScript. This is Rust, taught from there, and compiled to
JavaScript with [rust-js](https://github.com/rust-js-lang/rust-js), so
everything you write still runs where your TypeScript does.

Each chapter takes one idea, writes it in TypeScript and in Rust, compiles
the Rust to JavaScript, and runs both on the same inputs, so you can see
where they agree and where they don't. Native Rust runs the same inputs
too: the JavaScript rust-js writes must say what native Rust says.

rust-js's guide has [a reference for JavaScript
developers](https://github.com/rust-js-lang/rust-js/tree/main/docs/guide/for-js-developers),
every construct and what it compiles to. This is the other kind of book:
fewer things, each explained, with the why.

## Chapters

1. [The same function, twice](chapters/01-the-same-function-twice/README.md):
   a TypeScript function and a Rust one, and the JavaScript rust-js writes,
   which reads like the TypeScript.
2. [`let` and `let mut`](chapters/02-let-and-let-mut/README.md): nothing
   changes unless it says `mut`, and a function that changes what you give
   it says `&mut`, as you must when you call it.
3. [Numbers that know their kind](chapters/03-numbers-know-their-kind/README.md):
   whole numbers that divide whole, overflow you must decide on, parsing
   that means all of it, and `u64` as a `bigint` that keeps every digit.
4. [Strings are UTF-8](chapters/04-strings-are-utf-8/README.md): bytes
   that are always valid text, `chars()` for characters, and why
   TypeScript's `word[0]` can be half an emoji.
5. [Everything is an expression](chapters/05-everything-is-an-expression/README.md):
   `if`, `match`, blocks and loops have values, a block's last line is its
   value, and a semicolon throws it away.
6. [Objects are structs](chapters/06-objects-are-structs/README.md):
   methods in an `impl` block, `&self` or `&mut self` saying which change
   it, and `==` that compares what's in two structs.
7. [Unions are enums](chapters/07-unions-are-enums/README.md): a
   discriminated union as an enum, a `match` that must handle every kind,
   and the same JavaScript objects TypeScript's union describes.
8. [`null` is `Option`](chapters/08-null-is-option/README.md): no `null`
   at all, `Option` instead, `?` as optional chaining for a whole
   function, and why the `.d.ts` says `T | null | undefined`.
9. [`throw` is `Result`](chapters/09-throw-is-result/README.md): failing
   is part of the return type, an error enum names every way, `?` passes
   it up, and `panic!` is for bugs.
10. [Arrays and iterators](chapters/10-arrays-and-iterators/README.md):
    `Vec` owns and a slice borrows, iterator chains are lazy enough to
    start from forever, and `get` answers where `[i]` panics.
11. [Maps and sets](chapters/11-maps-and-sets/README.md): `entry` for
    counting, keys equal by what's in them where a JS `Set` compares
    arrays by identity, and a `HashMap` with no order to count on.
12. [Generics](chapters/12-generics/README.md): a bound says what a `T`
    can do, where TypeScript lets `>` compare objects; generic structs,
    the turbofish, and rust-js passing a bound as a value.
13. [Interfaces are traits](chapters/13-interfaces-are-traits/README.md):
    a type has a trait where an `impl` says so, newtypes that can't be
    swapped, `impl` and `dyn`, and each `impl` as a dictionary in JS.
14. [Narrowing is `match`](chapters/14-narrowing-is-match/README.md):
    patterns that test and take apart at once, slices, ranges, `@`,
    guards, `let else`, and a `match` compiled to TypeScript's `typeof`.
15. [Classes without inheritance](chapters/15-classes-without-inheritance/README.md):
    private fields that keep a value valid, composition and an enum in
    place of `extends`, and an opaque type at the boundary.
16. [Moves](chapters/16-moves/README.md): one owner, a use after a move
    that won't compile, `clone` and `Copy`, `Drop` in place of `finally`,
    and the rule a TypeScript caller keeps itself.
17. [Borrowing](chapters/17-borrowing/README.md): `&` to read and `&mut`
    to change, many readers or one writer, the `splice`-in-a-loop bug
    that won't compile, and a `&mut u32` as a `{ value }` box.
18. [Lifetimes](chapters/18-lifetimes/README.md): no garbage collector,
    so a reference can't outlive its value; `'a` names "as long as" in a
    signature or a struct, and leaves no trace in the JavaScript.
19. [`Rc` and `RefCell`](chapters/19-rc-and-refcell/README.md): owners
    counted, borrows checked as the program runs, and a read while
    writing that panics where TypeScript lets it through.
20. [Modules and crates](chapters/20-modules-and-crates/README.md):
    `mod` declares a module, `pub(crate)` is a privacy TypeScript lacks,
    `pub use` is the front door, and a crates.io dependency compiled too.
21. [`async`](chapters/21-async/README.md): the same words, but a Rust
    future waits to be polled where a promise starts at once, and rust-js
    refuses the code where that would show.
22. [Testing](chapters/22-testing/README.md): `#[test]` built in, unit
    tests beside the code that reach its privates, `should_panic`, and the
    same Rust tests run as JavaScript by `rust-js test`.

## Run it

```bash
git clone --recurse-submodules https://github.com/rust-js-lang/coming-from-typescript.git
cd coming-from-typescript
bun install
(cd rust-js && bun install)
bun run rust     # compile each chapter's Rust to JS (builds rust-js first)
bun run test     # tsc, then each chapter's tests, then native Rust's,
                 # then chapter 22's Rust tests as JavaScript
```

## The layout

```
coming-from-typescript/
├── vendor/rust-js/              the compiler, a submodule pinned to a commit
├── rust-js/crates/              crates.io crates rust-js compiled (chapter 20)
├── chapters/01-the-same-function-twice/
│   ├── ts/stats.ts              the TypeScript
│   ├── rust/src/lib.rs          the Rust
│   ├── rust/src/lib.js, .d.ts   what rust-js writes from it (committed)
│   ├── rust/tests/native.rs     native Rust on the same cases
│   ├── cases.json               the inputs, and what each should give
│   └── compare.ts, .test.ts     both, side by side
├── scripts/patch-rust-js.ts     applies patches/, while any wait upstream
└── PATCHES.md                   why each patch exists, and its upstream issue
```

## When rust-js falls short

rust-js is young, and a chapter will sometimes need something it doesn't
do yet. When that happens we write a patch to it in `patches/`, which
`bun run rust` applies to the submodule, so the chapter can go on, and
open an issue on [rust-js](https://github.com/rust-js-lang/rust-js/issues)
so it's fixed upstream. [PATCHES.md](PATCHES.md) lists each patch and its
issue; when the fix lands, the submodule moves to it and the patch goes.
