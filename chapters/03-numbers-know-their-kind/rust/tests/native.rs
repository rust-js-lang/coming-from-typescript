//! The chapter's cases, run by native Rust: what rust-js's JS must say too.

use chapter_03_numbers_know_their_kind::{add_box, brightness, next_id, parse_count, parse_id, share};
use serde::Deserialize;

#[derive(Deserialize)]
struct Cases {
    share: Vec<(u32, (u32, u32))>,
    add_box: Vec<(u8, Option<u8>)>,
    parse_count: Vec<(String, Result<u32, String>)>,
    /// Ids as text, as `JSON.parse` would round a `u64` that's a number.
    parse_id: Vec<(String, Option<String>)>,
    next_id: Vec<(String, String)>,
    brightness: Vec<(f64, u8)>,
}

#[test]
fn native_rust_says_what_each_case_says() {
    let cases: Cases = serde_json::from_str(include_str!("../../cases.json")).unwrap();
    for (n, said) in cases.share {
        assert_eq!(share(n), said, "share({n})");
    }
    for (boxes, said) in cases.add_box {
        assert_eq!(add_box(boxes), said, "add_box({boxes})");
    }
    for (text, said) in cases.parse_count {
        assert_eq!(parse_count(&text), said, "parse_count({text:?})");
    }
    for (text, said) in cases.parse_id {
        assert_eq!(parse_id(&text).map(|id| id.to_string()), said, "parse_id({text:?})");
    }
    for (id, said) in cases.next_id {
        assert_eq!(next_id(id.parse().unwrap()).to_string(), said, "next_id({id})");
    }
    for (level, said) in cases.brightness {
        assert_eq!(brightness(level), said, "brightness({level})");
    }
}
