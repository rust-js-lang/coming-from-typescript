//! Chapter 14: narrowing is `match`. TypeScript narrows a value by testing
//! it; Rust matches it against patterns, which test and take apart at once.

/// A value from a config file: a number, some text, or a list of values.
/// `#[rust_js::untagged]` makes each variant its payload in JavaScript, so
/// it's TypeScript's `number | string | Value[]`.
#[derive(Debug, Clone, PartialEq)]
#[cfg_attr(rust_js, rust_js::untagged)]
pub enum Value {
    Number(f64),
    Text(String),
    List(Vec<Value>),
}

/// A value in words. Patterns nest: a list's own items are matched in place.
pub fn describe(value: &Value) -> String {
    match value {
        Value::Number(n) if n.fract() == 0.0 => format!("the whole number {n}"),
        Value::Number(n) => format!("the number {n}"),
        Value::Text(text) if text.is_empty() => "no text".to_string(),
        Value::Text(text) => format!("the text {text:?}"),
        Value::List(items) => match items.as_slice() {
            [] => "an empty list".to_string(),
            [only] => format!("a list of just {}", describe(only)),
            [Value::Number(_), Value::Number(_)] => "a pair of numbers".to_string(),
            [first, .., last] => format!("a list from {} to {}", describe(first), describe(last)),
        },
    }
}

/// A command typed at a prompt, read by the shape of its words.
pub fn command(line: &str) -> String {
    let words: Vec<&str> = line.split_whitespace().collect();
    match words.as_slice() {
        [] => "nothing to do".to_string(),
        ["go", direction @ ("north" | "south" | "east" | "west")] => format!("you walk {direction}"),
        ["go", elsewhere] => format!("you can't go {elsewhere}"),
        ["take", things @ ..] if !things.is_empty() => format!("you take {}", things.join(" ")),
        [verb, ..] => format!("you don't know how to {verb}"),
    }
}

/// How big a number is, in words: a range, and `@` to keep the number.
pub fn size(n: u32) -> String {
    match n {
        0 => "none".to_string(),
        digit @ 1..=9 => format!("one digit, {digit}"),
        10..=99 => "two digits".to_string(),
        _ => "lots".to_string(),
    }
}

/// The port of `host:port`, if it has one: `let else` takes a pattern
/// apart, or leaves the function.
pub fn port(address: &str) -> Option<u16> {
    let Some((_, port)) = address.rsplit_once(':') else {
        return None;
    };
    port.parse().ok()
}

/// Whether a value is a list: `matches!` is a `match` that answers yes or no.
pub fn is_list(value: &Value) -> bool {
    matches!(value, Value::List(_))
}
