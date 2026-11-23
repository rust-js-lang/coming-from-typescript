# Patches to rust-js

The `rust-js` submodule is pinned to a commit of
[rust-js-lang/rust-js](https://github.com/rust-js-lang/rust-js), unchanged.
When a chapter needs something rust-js doesn't do yet, we write the change
as a patch in [patches/](patches/), open an issue upstream, and list both here.
`bun run rust` applies each patch to the submodule before it builds
([scripts/patch-rust-js.ts](scripts/patch-rust-js.ts)), once. When the fix
is upstream, the submodule moves to a commit that has it, and the patch and
its row go.

None open.

Pinned: `1c13c914e` (rust-js `main`, 2026-11-23).

## Landed upstream

| Patch | Gap | Chapter | Issue | Fixed by |
|---|---|---|---|---|
