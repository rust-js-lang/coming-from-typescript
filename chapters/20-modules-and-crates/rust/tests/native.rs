//! The chapter's cases, run by native Rust: what rust-js's JS must say too.
//! From here, outside the crate, `Money` is at the crate's root, where
//! `pub use` put it, and `shop` is a public module.

use chapter_20_modules_and_crates::Money;
use chapter_20_modules_and_crates::shop::{Item, receipt, total};
use serde::Deserialize;

#[derive(Deserialize)]
struct Case {
    items: Vec<(String, u32)>,
    total: String,
    receipt: Vec<String>,
}

#[test]
fn native_rust_says_what_each_case_says() {
    let cases: Vec<Case> = serde_json::from_str(include_str!("../../cases.json")).unwrap();
    for case in cases {
        let items: Vec<Item> = case.items.into_iter().map(|(name, cents)| Item { name, cents }).collect();
        assert_eq!(total(&items).format(), case.total);
        assert_eq!(receipt(&items), case.receipt);
    }
    assert_eq!(Money::from_cents(5).format(), "$0.05");
}
