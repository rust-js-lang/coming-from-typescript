//! The chapter's cases, run by native Rust: what rust-js's JS must say too.

use chapter_17_borrowing::{capitalize_all, letters, play, remove_short, swap_halves};
use serde::Deserialize;

#[derive(Deserialize)]
struct Cases {
    words: Vec<Words>,
    games: Vec<(Vec<bool>, u32)>,
    swaps: Vec<(Vec<i32>, Vec<i32>)>,
}

#[derive(Deserialize)]
struct Words {
    words: Vec<String>,
    letters: usize,
    capitalized: Vec<String>,
    long: Vec<String>,
}

#[test]
fn native_rust_says_what_each_case_says() {
    let cases: Cases = serde_json::from_str(include_str!("../../cases.json")).unwrap();
    for case in cases.words {
        assert_eq!(letters(&case.words), case.letters);
        let mut capitalized = case.words.clone();
        capitalize_all(&mut capitalized);
        assert_eq!(capitalized, case.capitalized);
        let mut long = case.words.clone();
        remove_short(&mut long, 3);
        assert_eq!(long, case.long);
    }
    for (answers, score) in cases.games {
        assert_eq!(play(&answers), score, "{answers:?}");
    }
    for (mut xs, swapped) in cases.swaps {
        swap_halves(&mut xs);
        assert_eq!(xs, swapped);
    }
}
