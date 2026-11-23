//! The chapter's cases, run by native Rust: what rust-js's JS must say too.

use chapter_13_interfaces_are_traits::{Circle, Meters, Seconds, Square, area_of, garden, show, speed};
use serde::Deserialize;

#[derive(Deserialize)]
struct Case {
    circles: Vec<f64>,
    squares: Vec<f64>,
    garden: Vec<String>,
    areas: Vec<f64>,
    shown: Vec<String>,
}

#[test]
fn native_rust_says_what_each_case_says() {
    let cases: Vec<Case> = serde_json::from_str(include_str!("../../cases.json")).unwrap();
    for case in cases {
        let circles: Vec<Circle> = case.circles.iter().map(|&radius| Circle { radius }).collect();
        let squares: Vec<Square> = case.squares.iter().map(|&side| Square { side }).collect();
        assert_eq!(garden(&circles, &squares), case.garden);
        let areas: Vec<f64> = circles.iter().map(area_of).chain(squares.iter().map(area_of)).collect();
        assert_eq!(areas, case.areas);
        let shown: Vec<String> = circles.iter().map(show).collect();
        assert_eq!(shown, case.shown);
    }
}

#[test]
fn meters_over_seconds() {
    assert_eq!(speed(Meters(100.0), Seconds(9.58)), 100.0 / 9.58);
}
