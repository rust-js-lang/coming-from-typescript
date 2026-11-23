//! The chapter's cases, run by native Rust: what rust-js's JS must say too.

use chapter_18_lifetimes::{first_word, longest, mentions, pairs, version};
use serde::Deserialize;

#[derive(Deserialize)]
struct Cases {
    words: Vec<(String, String)>,
    longest: Vec<(String, String, String)>,
    mentions: Vec<(String, String, Vec<String>)>,
    pairs: Vec<(String, Vec<(String, String)>)>,
}

#[test]
fn native_rust_says_what_each_case_says() {
    let cases: Cases = serde_json::from_str(include_str!("../../cases.json")).unwrap();
    for (text, word) in &cases.words {
        assert_eq!(first_word(text), word);
    }
    for (a, b, longer) in &cases.longest {
        assert_eq!(longest(a, b), longer);
    }
    for (text, word, found) in &cases.mentions {
        assert_eq!(&mentions(text, word), found);
    }
    for (config, found) in &cases.pairs {
        assert_eq!(&pairs(config), found);
    }
    assert_eq!(version(), "1.0");
}

#[test]
fn a_slice_is_part_of_its_text() {
    let text = String::from("hello world");
    let word = first_word(&text);
    // The same bytes, not a copy: `word` starts where `text` does.
    assert_eq!(word.as_ptr(), text.as_ptr());
}
