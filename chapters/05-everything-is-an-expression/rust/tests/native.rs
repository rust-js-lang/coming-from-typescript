//! The chapter's cases, run by native Rust: what rust-js's JS must say too.

use chapter_05_everything_is_an_expression::{describe, first_negative, grade, shipping};
use serde::Deserialize;

#[derive(Deserialize)]
struct Cases {
    grade: Vec<(u32, String)>,
    shipping: Vec<(u32, bool, u32)>,
    first_negative: Vec<(Vec<i32>, Option<usize>)>,
    describe: Vec<(i32, String)>,
}

#[test]
fn native_rust_says_what_each_case_says() {
    let cases: Cases = serde_json::from_str(include_str!("../../cases.json")).unwrap();
    for (score, said) in cases.grade {
        assert_eq!(grade(score), said, "grade({score})");
    }
    for (total, express, said) in cases.shipping {
        assert_eq!(shipping(total, express), said, "shipping({total}, {express})");
    }
    for (xs, said) in cases.first_negative {
        assert_eq!(first_negative(&xs), said, "first_negative({xs:?})");
    }
    for (n, said) in cases.describe {
        assert_eq!(describe(n), said, "describe({n})");
    }
}
