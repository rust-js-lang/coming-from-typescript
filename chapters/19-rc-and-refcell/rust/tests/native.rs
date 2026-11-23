//! The chapter's cases, run by native Rust: what rust-js's JS must say too.

use chapter_19_rc_and_refcell::{chat, owners, read_while_writing};
use serde::Deserialize;

#[derive(Deserialize)]
struct Cases {
    chats: Vec<(Vec<(String, String)>, Vec<String>)>,
    owners: Vec<(usize, usize, usize)>,
}

#[test]
fn native_rust_says_what_each_case_says() {
    let cases: Cases = serde_json::from_str(include_str!("../../cases.json")).unwrap();
    for (lines, log) in cases.chats {
        assert_eq!(chat(&lines), log);
    }
    for (n, gone, count) in cases.owners {
        assert_eq!(owners(n, gone), count, "{n} join, {gone} leave");
    }
}

#[test]
#[should_panic(expected = "RefCell already borrowed")]
fn a_refcell_refuses_a_writer_while_it_lends_a_reader() {
    read_while_writing();
}
