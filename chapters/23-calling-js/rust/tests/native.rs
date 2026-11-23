//! The chapter's cases, run by native Rust: what rust-js's JS must say too.
//! `receipt` calls JavaScript, so only its plain parts run here.

use chapter_23_calling_js::{Item, discounted, total};
use serde::Deserialize;

#[derive(Deserialize)]
struct Case {
    items: Vec<(String, u32)>,
    total: u32,
    tenth_off: u32,
}

#[test]
fn native_rust_says_what_each_case_says() {
    let cases: Vec<Case> = serde_json::from_str(include_str!("../../cases.json")).unwrap();
    for case in cases {
        let items: Vec<Item> = case.items.into_iter().map(|(name, price)| Item { name, price }).collect();
        assert_eq!(total(&items), case.total);
        assert_eq!(discounted(&items, |item| item.price / 10), case.tenth_off);
    }
}

#[test]
#[should_panic(expected = "a binding runs only in JavaScript")]
fn a_binding_has_nothing_to_call_natively() {
    chapter_23_calling_js::receipt(&[Item { name: "tea".to_string(), price: 350 }], "USD");
}
