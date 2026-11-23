# Patches to rust-js

The `vendor/rust-js` submodule is pinned to a commit of
[rust-js-lang/rust-js](https://github.com/rust-js-lang/rust-js), unchanged.
When a chapter needs something rust-js doesn't do yet, we write the change
as a patch in [patches/](patches/), open an issue upstream, and list both here.
`bun run rust` applies each patch to the submodule before it builds
([scripts/patch-rust-js.ts](scripts/patch-rust-js.ts)), once. When the fix
is upstream, the submodule moves to a commit that has it, and the patch and
its row go.

None open.

Pinned: `1692e7581` (rust-js `main`, 2026-11-23).

## Landed upstream

| Patch | Gap | Chapter | Issue | Fixed by |
|---|---|---|---|---|
| (none) | **Declarations.** A `&[T]` parameter was declared `T[]`, the same as `&mut`, so TypeScript couldn't pass a `readonly` array to a function that only reads it. Now a shared borrow of an array is `readonly T[]` (ADR 1189). | [2](chapters/02-let-and-let-mut/README.md) | [rust-js#2392](https://github.com/rust-js-lang/rust-js/issues/2392) | [rust-js#2394](https://github.com/rust-js-lang/rust-js/pull/2394), `b8c176f28` |
| (none) | **Declarations.** A crate root of only `mod`s and a `pub use` of a type got no `.d.ts`, so the type's re-export was lost, and a glob's types weren't declared. Now a type a module re-exports is a type it exports (ADR 1005, amended). | [20](chapters/20-modules-and-crates/README.md) | [rust-js#2399](https://github.com/rust-js-lang/rust-js/issues/2399) | [rust-js#2400](https://github.com/rust-js-lang/rust-js/pull/2400), `1692e7581` |
