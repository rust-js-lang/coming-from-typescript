//! The chapter's cases, run by native Rust: what rust-js's JS must say too.

use chapter_02_let_and_let_mut::{add_item, slug, total, with_item};
use serde::Deserialize;

#[derive(Deserialize)]
struct Case {
    name: String,
    slug: String,
    prices: Vec<u32>,
    total: u32,
}

#[test]
fn native_rust_says_what_each_case_says() {
    let cases: Vec<Case> = serde_json::from_str(include_str!("../../cases.json")).unwrap();
    for case in cases {
        assert_eq!(slug(&case.name), case.slug, "{:?}", case.name);
        assert_eq!(total(&case.prices), case.total, "{:?}", case.prices);
    }
}

#[test]
fn a_function_changes_your_cart_only_if_you_hand_it_over_mut() {
    let mut cart = vec!["apple".to_string()];
    // `with_item` borrows the cart to read it: yours is as it was.
    let more = with_item(&cart, "pear");
    assert_eq!(cart, ["apple"]);
    assert_eq!(more, ["apple", "pear"]);
    // `add_item` borrows it to change it, and you say so: `&mut cart`.
    add_item(&mut cart, "fig");
    assert_eq!(cart, ["apple", "fig"]);
}
