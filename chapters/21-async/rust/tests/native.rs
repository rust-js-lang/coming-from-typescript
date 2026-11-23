//! The chapter's cases, run by native Rust: what rust-js's JS must say too.

use chapter_21_async::lazy::{made_not_awaited, made_then_awaited};
use chapter_21_async::{receipt, total};
use serde::Deserialize;
use std::pin::pin;
use std::task::{Context, Poll, Waker};

/// Runs a future to its end on this thread: an executor of one loop.
/// Native Rust needs one, as nothing runs a future by itself; a real
/// program uses tokio's or another runtime's. These futures never wait on
/// anything, so the first poll finishes each.
pub fn block_on<F: Future>(future: F) -> F::Output {
    let mut future = pin!(future);
    let mut context = Context::from_waker(Waker::noop());
    loop {
        if let Poll::Ready(value) = future.as_mut().poll(&mut context) {
            return value;
        }
    }
}

#[derive(Deserialize)]
struct Case {
    items: Vec<String>,
    total: Result<u32, String>,
    receipt: String,
}

#[test]
fn native_rust_says_what_each_case_says() {
    let cases: Vec<Case> = serde_json::from_str(include_str!("../../cases.json")).unwrap();
    for case in cases {
        assert_eq!(block_on(total(&case.items)), case.total, "{:?}", case.items);
        assert_eq!(block_on(receipt(&case.items)), case.receipt);
    }
}

#[test]
fn a_future_runs_only_when_polled() {
    // Never awaited: the step never started.
    assert_eq!(made_not_awaited(), ["made"]);
    // Awaited after "made": it starts at the await.
    assert_eq!(block_on(made_then_awaited()), ["made", "step started"]);
}
