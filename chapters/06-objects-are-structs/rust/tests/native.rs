//! The chapter's cases, run by native Rust: what rust-js's JS must say too.

use chapter_06_objects_are_structs::{Point, Rect, debug, same};
use serde::Deserialize;

#[derive(Deserialize)]
struct Case {
    rect: [f64; 4],
    point: [f64; 2],
    area: f64,
    contains: bool,
    moved: [f64; 4],
    grown: [f64; 4],
    debug: String,
}

fn rect([x, y, width, height]: [f64; 4]) -> Rect {
    Rect::new(x, y, width, height)
}

#[test]
fn native_rust_says_what_each_case_says() {
    let cases: Vec<Case> = serde_json::from_str(include_str!("../../cases.json")).unwrap();
    for case in cases {
        let r = rect(case.rect);
        let [x, y] = case.point;
        assert_eq!(r.area(), case.area);
        assert_eq!(r.contains(&Point { x, y }), case.contains);
        assert_eq!(r.moved(1.0, 2.0), rect(case.moved));
        let mut grown = r.clone();
        grown.grow(1.0);
        assert_eq!(grown, rect(case.grown));
        assert_eq!(debug(&r), case.debug);
    }
}

#[test]
fn equal_is_what_is_in_them() {
    let a = Rect::new(0.0, 0.0, 2.0, 3.0);
    let b = Rect::new(0.0, 0.0, 2.0, 3.0);
    assert!(same(&a, &b));
    assert!(!same(&a, &a.moved(1.0, 0.0)));
}
