//! The chapter's cases, run by native Rust: what rust-js's JS must say too.

use chapter_04_strings_are_utf_8::{first_word, initials, reverse, shorten, sizes};
use serde::Deserialize;

#[derive(Deserialize)]
struct Case {
    text: String,
    bytes: usize,
    chars: usize,
    initials: String,
    short: String,
    reversed: String,
    first: String,
}

#[test]
fn native_rust_says_what_each_case_says() {
    let cases: Vec<Case> = serde_json::from_str(include_str!("../../cases.json")).unwrap();
    for case in cases {
        assert_eq!(sizes(&case.text), (case.bytes, case.chars), "{:?}", case.text);
        assert_eq!(initials(&case.text), case.initials, "{:?}", case.text);
        assert_eq!(shorten(&case.text, 4), case.short, "{:?}", case.text);
        assert_eq!(reverse(&case.text), case.reversed, "{:?}", case.text);
        assert_eq!(first_word(&case.text), case.first, "{:?}", case.text);
    }
}
