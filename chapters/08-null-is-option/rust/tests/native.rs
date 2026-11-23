//! The chapter's cases, run by native Rust: what rust-js's JS must say too.

use chapter_08_null_is_option::{Person, call_them, managers_name, nickname_length};
use serde::Deserialize;

#[derive(Deserialize)]
struct Case {
    name: String,
    call_them: Option<String>,
    managers_name: Option<String>,
    nickname_length: Option<usize>,
}

/// The team every case asks about.
pub fn team() -> Vec<Person> {
    let person = |name: &str, nickname: Option<&str>, manager: Option<&str>| Person {
        name: name.to_string(),
        nickname: nickname.map(str::to_string),
        manager: manager.map(str::to_string),
    };
    vec![
        person("Ada", Some("Countess"), None),
        person("Grace", None, Some("Ada")),
        person("Linus", Some("Tux"), Some("Grace")),
        person("Alan", None, Some("Turing")),
    ]
}

#[test]
fn native_rust_says_what_each_case_says() {
    let team = team();
    let cases: Vec<Case> = serde_json::from_str(include_str!("../../cases.json")).unwrap();
    for case in cases {
        let person = team.iter().find(|p| p.name == case.name);
        assert_eq!(person.map(|p| call_them(p).to_string()), case.call_them, "{}", case.name);
        assert_eq!(managers_name(&team, &case.name), case.managers_name, "{}", case.name);
        assert_eq!(person.and_then(nickname_length), case.nickname_length, "{}", case.name);
    }
}
