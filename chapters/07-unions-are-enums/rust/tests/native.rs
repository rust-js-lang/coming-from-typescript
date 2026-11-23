//! The chapter's cases, run by native Rust: what rust-js's JS must say too.

use chapter_07_unions_are_enums::{Shape, area, describe, doubled};
use serde::Deserialize;

#[derive(Deserialize)]
struct Case {
    kind: String,
    size: f64,
    area: f64,
    doubled: f64,
    describe: String,
}

/// A shape of its kind and its one size, as cases.json writes it.
fn shape(kind: &str, size: f64) -> Shape {
    match kind {
        "circle" => Shape::Circle { radius: size },
        "square" => Shape::Square { side: size },
        _ => Shape::Point,
    }
}

#[test]
fn native_rust_says_what_each_case_says() {
    let cases: Vec<Case> = serde_json::from_str(include_str!("../../cases.json")).unwrap();
    for case in cases {
        let s = shape(&case.kind, case.size);
        assert_eq!(area(&s), case.area, "{}", case.describe);
        assert_eq!(doubled(&s), shape(&case.kind, case.doubled), "{}", case.describe);
        assert_eq!(describe(&s), case.describe);
    }
}
