//! An integration test: a crate of its own, which sees only the library's
//! public API, as a user does. It runs the chapter's cases, natively under
//! `cargo test`, and as JavaScript under `rust-js test`.

use chapter_22_testing::parse_duration;
use serde::Deserialize;

#[derive(Deserialize)]
struct Case {
    text: String,
    seconds: Result<u32, String>,
}

#[test]
fn native_rust_says_what_each_case_says() {
    let cases: Vec<Case> = serde_json::from_str(include_str!("../../cases.json")).unwrap();
    for case in cases {
        assert_eq!(parse_duration(&case.text), case.seconds, "{:?}", case.text);
    }
}
