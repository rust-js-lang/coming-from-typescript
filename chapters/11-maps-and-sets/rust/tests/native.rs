//! The chapter's cases, run by native Rust: what rust-js's JS must say too.

use chapter_11_maps_and_sets::{most_common, places_visited, shared_tags, sorted_counts, word_counts};
use serde::Deserialize;

#[derive(Deserialize)]
struct Cases {
    texts: Vec<Text>,
    walks: Vec<Walk>,
    tags: Vec<Tags>,
}

#[derive(Deserialize)]
struct Text {
    text: String,
    sorted_counts: Vec<(String, u32)>,
    most_common: Option<(String, u32)>,
}

#[derive(Deserialize)]
struct Walk {
    steps: Vec<(i32, i32)>,
    places_visited: usize,
}

#[derive(Deserialize)]
struct Tags {
    a: Vec<String>,
    b: Vec<String>,
    shared: Vec<String>,
}

#[test]
fn native_rust_says_what_each_case_says() {
    let cases: Cases = serde_json::from_str(include_str!("../../cases.json")).unwrap();
    for case in cases.texts {
        assert_eq!(sorted_counts(&case.text), case.sorted_counts, "{}", case.text);
        // The same counts, in no order: sorted to compare.
        let mut counts: Vec<(String, u32)> = word_counts(&case.text).into_iter().collect();
        counts.sort();
        assert_eq!(counts, case.sorted_counts, "{}", case.text);
        assert_eq!(most_common(&case.text), case.most_common, "{}", case.text);
    }
    for case in cases.walks {
        assert_eq!(places_visited(&case.steps), case.places_visited, "{:?}", case.steps);
    }
    for case in cases.tags {
        assert_eq!(shared_tags(&case.a, &case.b), case.shared);
    }
}
