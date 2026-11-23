//! The chapter's cases, run by native Rust: what rust-js's JS must say too.

use chapter_14_narrowing_is_match::{Value, command, describe, is_list, port, size};
use serde::Deserialize;

/// A value as cases.json writes it: a number, a string, or a list.
#[derive(Deserialize)]
#[serde(untagged)]
enum Json {
    Number(f64),
    Text(String),
    List(Vec<Json>),
}

fn value(json: &Json) -> Value {
    match json {
        Json::Number(n) => Value::Number(*n),
        Json::Text(text) => Value::Text(text.clone()),
        Json::List(items) => Value::List(items.iter().map(value).collect()),
    }
}

#[derive(Deserialize)]
struct Cases {
    values: Vec<(Json, String, bool)>,
    commands: Vec<(String, String)>,
    sizes: Vec<(u32, String)>,
    ports: Vec<(String, Option<u16>)>,
}

#[test]
fn native_rust_says_what_each_case_says() {
    let cases: Cases = serde_json::from_str(include_str!("../../cases.json")).unwrap();
    for (json, described, list) in &cases.values {
        assert_eq!(&describe(&value(json)), described);
        assert_eq!(is_list(&value(json)), *list, "{described}");
    }
    for (line, said) in &cases.commands {
        assert_eq!(&command(line), said, "{line}");
    }
    for (n, said) in &cases.sizes {
        assert_eq!(&size(*n), said, "{n}");
    }
    for (address, p) in &cases.ports {
        assert_eq!(port(address), *p, "{address}");
    }
}
