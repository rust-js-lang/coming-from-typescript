//! Chapter 20: modules and crates. A crate is a package; a module is a
//! namespace inside it, declared with `mod`, private unless it says `pub`.
//!
//! Outside the crate, the private module can't be named:
//!
//! ```compile_fail,E0603
//! use chapter_20_modules_and_crates::money::Money;
//! ```
//!
//! and a `pub(crate)` method can't be called:
//!
//! ```compile_fail,E0624
//! use chapter_20_modules_and_crates::Money;
//! let cents = Money::from_cents(5).cents();
//! ```

// The modules of this crate, each a file: `src/money.rs`, `src/shop.rs`.
// `money` is private: code outside this crate can't name `money::..`.
mod money;
pub mod shop;

// `Money` is re-exported, so outside it's `chapter_20::Money`, wherever it
// lives inside: TypeScript's `export { Money } from './money'`.
pub use money::Money;
