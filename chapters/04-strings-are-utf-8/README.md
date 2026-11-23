# 4. Strings are UTF-8

## What `.length` counts

A JavaScript string is a list of 16-bit units (UTF-16). Most characters
take one unit. Some, emoji and many letters outside the basic set, take
two, a *surrogate pair*. `.length`, `[i]`, `.slice` and `split('')` all
count units, not characters, and that's where the bugs hide:

```ts
'👋'.length          // 2
'👋'[0]              // '\ud83d': half an emoji
'👋 hi'.split('')    // the emoji's halves, apart
```

Most code never meets one, until a user's name has a character outside
the basic set, or a message starts with an emoji.

## The Rust way: bytes you can't break

A Rust string is UTF-8 bytes, and it's *always* valid UTF-8: there's no
way to hold half a character. Two different questions get two different
answers:

```rust
pub fn sizes(text: &str) -> (usize, usize) {
    (text.len(), text.chars().count())   // bytes, and characters
}
```

- `.len()` is the length in **bytes**, the size it takes in memory or on
  the wire. `"naïve café"` is 12 bytes: `ï` and `é` take two each.
- `.chars()` walks the **characters** (Unicode code points), so
  `.chars().count()` is how many there are. `"naïve café"` has 10.

And anything you do a character at a time, you do with `.chars()`:

```rust
pub fn initials(name: &str) -> String {
    let firsts: String = name.split_whitespace().filter_map(|word| word.chars().next()).collect();
    firsts.to_uppercase()
}

pub fn reverse(text: &str) -> String {
    text.chars().rev().collect()
}
```

## Side by side

`bun chapters/04-strings-are-utf-8/compare.ts`:

```
"naïve café"
  sizes     ts: [10,10]    rust: [12,10]  (rust's: bytes, chars)
  initials  ts: "NC"       rust: "NC"
  shorten   ts: "naïv…"    rust: "naïv…"
  reverse   ts: "éfac evïan"  rust: "éfac evïan"
"👋 hi there"
  sizes     ts: [11,10]    rust: [13,10]  (rust's: bytes, chars)
  initials  ts: "\ud83dHT" rust: "👋HT"
  shorten   ts: "👋 h…"    rust: "👋 hi…"
  reverse   ts: "ereht ih \udc4b\ud83d"  rust: "ereht ih 👋"
```

For `"naïve café"`, every character is one UTF-16 unit, so the
TypeScript and the Rust agree on everything but the byte count. For
`"👋 hi there"` the TypeScript breaks three ways:

- `word[0]` takes half the emoji, `\ud83d`, so the initials begin with a
  broken character.
- `.length > 4` counts the emoji as two, so "4 characters" is `👋 h`.
- `split('')` splits the emoji's two halves, and reversing puts them in
  the wrong order: the output isn't valid text.

The Rust never could. A `char` is a whole code point, so there's no half
of one to get hold of.

## Two kinds of string: `&str` and `String`

You've seen both. They're the same text, held two ways:

- **`&str`** is a *borrowed* view of text that lives somewhere else.
  Parameters are usually `&str`, because the function only reads.
- **`String`** is text you *own*: you can grow it, and you can hand it
  back. Results are usually `String`, because the function made it.

```rust
pub fn first_word(text: &str) -> &str {
    text.split(' ').next().unwrap_or("")    // a view into `text`, no copy
}
```

`first_word` returns a `&str` pointing into the text it was given:
nothing is copied. Chapter 17 explains how Rust knows that's safe. In
JavaScript both are just `string`.

## What rust-js writes

```js
// rust/src/lib.js (generated)
export function sizes(text) {
  return [$byteLen(text), Array.from(text).length];
}

export function reverse(text) {
  return Array.from(text).toReversed().join("");
}
```

JavaScript strings are still UTF-16 underneath, so rust-js keeps Rust's
meaning on top: `$byteLen` counts the UTF-8 bytes, and `Array.from(text)`
walks code points, which is what `.chars()` does. It's the careful
TypeScript you'd write if you remembered every time.

## Where it's different

- **A "character" isn't always what a person sees.** `"école"` can be
  written as `e` plus a combining accent: two code points, one letter on
  screen. Rust's `.chars()` and TypeScript's `[...text]` both see two, so
  reversing it puts the accent on the wrong letter, in both
  (`compare.test.ts`). What a reader calls a character is a *grapheme
  cluster*: the `unicode-segmentation` crate in Rust, `Intl.Segmenter` in
  JavaScript.
- **Indexing by number is gone.** `text[0]` doesn't compile in Rust: an
  index would be a byte, which might land in the middle of a character.
  You ask for what you mean: `.chars().next()`, or a slice `&text[..n]`
  at a byte position you got from `char_indices`, as `shorten` does.
  Slicing at a byte that isn't a character boundary is a panic.
- **Lengths differ.** `.len()` is bytes, and `.length` in JS is UTF-16
  units. Neither is "characters". Pick the one you mean.

## Try it

In `shorten`, change `&text[..cut]` to `&text[..max]`, slicing at the
4th *byte* instead of after the 4th character, and run `cargo test`. It
fails on `"naïve café"`: 4 bytes is `naï`, since `ï` takes two. Bytes
aren't characters.

Then put it back, and add a test that slices inside a character:
`&"naïve"[..3]`. Rust panics: `end byte index 3 is not a char boundary;
it is inside 'ï' (bytes 2..4 of string)`. It refuses to make half a
character, even when you ask it to.
