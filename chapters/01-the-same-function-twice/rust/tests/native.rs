//! The chapter's cases, run by native Rust: what rust-js's JS must say too.

use chapter_01_the_same_function_twice::{describe, largest, mean};
use serde::Deserialize;

#[derive(Deserialize)]
struct Case {
    xs: Vec<f64>,
    why: String,
    mean: Option<f64>,
    largest: Option<f64>,
    describe: String,
}

#[test]
fn native_rust_says_what_each_case_says() {
    let cases: Vec<Case> = serde_json::from_str(include_str!("../../cases.json")).unwrap();
    for case in cases {
        assert_eq!(mean(&case.xs), case.mean, "{}", case.why);
        assert_eq!(largest(&case.xs), case.largest, "{}", case.why);
        assert_eq!(describe(&case.xs), case.describe, "{}", case.why);
    }
}
