//! The chapter's cases, run by native Rust: what rust-js's JS must say too.

use chapter_09_throw_is_result::{Account, pay};
use serde::Deserialize;

#[derive(Deserialize)]
struct Case {
    from: String,
    to: String,
    amount: String,
    result: Result<u32, String>,
    after: (u32, u32),
}

/// The accounts each case starts from: Ada has 50 dollars, Grace 10.
pub fn accounts() -> Vec<Account> {
    vec![Account { name: "ada".into(), cents: 5000 }, Account { name: "grace".into(), cents: 1000 }]
}

#[test]
fn native_rust_says_what_each_case_says() {
    let cases: Vec<Case> = serde_json::from_str(include_str!("../../cases.json")).unwrap();
    for case in cases {
        let mut accounts = accounts();
        assert_eq!(pay(&mut accounts, &case.from, &case.to, &case.amount), case.result, "{}", case.amount);
        assert_eq!((accounts[0].cents, accounts[1].cents), case.after, "{}", case.amount);
    }
}
