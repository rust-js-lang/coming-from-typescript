//! The chapter's cases, run by native Rust: what rust-js's JS must say too.

use chapter_10_arrays_and_iterators::{Student, changes, item, passing, running_totals, squares_past, top};
use serde::Deserialize;

#[derive(Deserialize)]
struct Case {
    xs: Vec<u32>,
    n: usize,
    i: usize,
    top: Vec<u32>,
    running_totals: Vec<i32>,
    changes: Vec<i32>,
    item: Option<i32>,
    squares_past: Vec<u32>,
}

/// The class `passing` is asked about.
pub fn class() -> Vec<Student> {
    let student = |name: &str, score| Student { name: name.to_string(), score };
    vec![student("Ada", 91), student("Alan", 49), student("Grace", 50), student("Linus", 12)]
}

fn signed(xs: &[u32]) -> Vec<i32> {
    xs.iter().map(|&x| x as i32).collect()
}

#[test]
fn native_rust_says_what_each_case_says() {
    let cases: Vec<Case> = serde_json::from_str(include_str!("../../cases.json")).unwrap();
    for case in cases {
        let xs = signed(&case.xs);
        assert_eq!(top(&case.xs, case.n), case.top, "{:?}", case.xs);
        assert_eq!(running_totals(&xs), case.running_totals, "{:?}", case.xs);
        assert_eq!(changes(&xs), case.changes, "{:?}", case.xs);
        assert_eq!(item(&xs, case.i), case.item, "{:?}", case.xs);
        let limit = case.xs.first().copied().unwrap_or(0);
        assert_eq!(squares_past(limit, case.n), case.squares_past, "{:?}", case.xs);
    }
}

#[test]
fn those_who_passed() {
    assert_eq!(passing(&class()), ["Ada", "Grace"]);
}
