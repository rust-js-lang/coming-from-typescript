//! The chapter's cases, run by native Rust: what rust-js's JS must say too.

use chapter_16_moves::{Order, Point, checkout, order_twice, save, step};
use serde::Deserialize;

#[derive(Deserialize)]
struct Cases {
    carts: Vec<Vec<String>>,
    saves: Vec<(Vec<String>, Vec<String>)>,
}

#[test]
fn native_rust_says_what_each_case_says() {
    let cases: Cases = serde_json::from_str(include_str!("../../cases.json")).unwrap();
    for cart in cases.carts {
        let order = checkout(cart.clone());
        assert_eq!(order, Order { count: cart.len(), items: cart.clone() });
        assert_eq!(order_twice(cart.clone()), (order.clone(), order));
    }
    for (lines, log) in cases.saves {
        assert_eq!(save(&lines), log);
    }
}

#[test]
fn a_copy_type_is_still_there() {
    let p = Point { x: 1.0, y: 2.0 };
    let (before, after) = step(p);
    assert_eq!((p, before, after.x), (Point { x: 1.0, y: 2.0 }, p, 2.0));
}
