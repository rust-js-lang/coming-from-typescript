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

## Run it

```bash
git clone --recurse-submodules https://github.com/rust-js-lang/coming-from-typescript.git
cd coming-from-typescript
bun install
(cd rust-js && bun install)
bun run rust     # compile each chapter's Rust to JS (builds rust-js first)
bun run test     # tsc, then each chapter's tests, then native Rust's
```

## The layout

```
coming-from-typescript/
├── rust-js/                     the compiler, a submodule pinned to a commit
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
