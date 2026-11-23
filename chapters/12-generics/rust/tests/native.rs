//! The chapter's cases, run by native Rust: what rust-js's JS must say too.

use chapter_12_generics::{Stack, balanced, by_length, highest, largest, last_letter};
use serde::Deserialize;

#[derive(Deserialize)]
struct Cases {
    scores: Vec<Scores>,
    words: Vec<Words>,
    brackets: Vec<Brackets>,
}

#[derive(Deserialize)]
struct Scores {
    scores: Vec<i32>,
    highest: Option<i32>,
}

#[derive(Deserialize)]
struct Words {
    words: Vec<String>,
    by_length: Vec<(usize, Vec<String>)>,
    last_letters: Vec<Option<char>>,
}

#[derive(Deserialize)]
struct Brackets {
    text: String,
    balanced: bool,
}

#[test]
fn native_rust_says_what_each_case_says() {
    let cases: Cases = serde_json::from_str(include_str!("../../cases.json")).unwrap();
    for case in cases.scores {
        assert_eq!(highest(&case.scores), case.highest, "{:?}", case.scores);
    }
    for case in cases.words {
        let mut groups: Vec<(usize, Vec<String>)> = by_length(&case.words).into_iter().collect();
        groups.sort();
        assert_eq!(groups, case.by_length, "{:?}", case.words);
        let last: Vec<Option<char>> = case.words.iter().map(|word| last_letter(word)).collect();
        assert_eq!(last, case.last_letters, "{:?}", case.words);
    }
    for case in cases.brackets {
        assert_eq!(balanced(&case.text), case.balanced, "{}", case.text);
    }
}

#[test]
fn one_body_many_types() {
    assert_eq!(largest(&[1.5, -2.0, 0.25]), Some(1.5));
    assert_eq!(largest::<u8>(&[]), None);
    let mut stack = Stack::new();
    stack.push("a");
    stack.push("b");
    assert_eq!(stack.pop(), Some("b"));
    assert_eq!(stack.peek(), Some("a"));
}
