//! The chapter's cases, run by native Rust: what rust-js's JS must say too.

use chapter_24_where_typescript_is_easier::{User, UserPatch, greet, path_to_root, update};
use serde::Deserialize;

#[derive(Deserialize)]
struct Cases {
    greetings: Vec<(String, Option<String>, String)>,
    patches: Vec<(Option<String>, Option<String>, Option<u32>, (String, String, u32))>,
    paths: Vec<(String, Vec<String>)>,
}

/// The user every patch is made to.
pub fn ada() -> User {
    User { name: "Ada".to_string(), email: "ada@example.com".to_string(), age: 36 }
}

/// The tree every path is walked in: each `(child, parent)`.
pub fn edges() -> Vec<(String, String)> {
    [("src", "repo"), ("lib.rs", "src"), ("tests", "repo"), ("native.rs", "tests")]
        .iter()
        .map(|(child, parent)| (child.to_string(), parent.to_string()))
        .collect()
}

#[test]
fn native_rust_says_what_each_case_says() {
    let cases: Cases = serde_json::from_str(include_str!("../../cases.json")).unwrap();
    for (name, greeting, said) in &cases.greetings {
        assert_eq!(&greet(name, greeting.as_deref()), said);
    }
    for (name, email, age, (n, e, a)) in cases.patches {
        let patch = UserPatch { name, email, age };
        assert_eq!(update(&ada(), &patch), User { name: n, email: e, age: a });
    }
    for (start, path) in &cases.paths {
        assert_eq!(&path_to_root(&edges(), start), path);
    }
}
