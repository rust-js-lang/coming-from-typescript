//! Chapter 22: testing. Tests live beside the code, in a `#[cfg(test)]`
//! module that sees the file's private items; `cargo test` runs them
//! natively, and `rust-js test` runs the same tests as JavaScript.

/// How many seconds a duration like `1h30m` or `90s` is, or why it isn't one.
pub fn parse_duration(text: &str) -> Result<u32, String> {
    if text.is_empty() {
        return Err("empty duration".to_string());
    }
    let mut total = 0;
    let mut digits = String::new();
    for c in text.chars() {
        if c.is_ascii_digit() {
            digits.push(c);
            continue;
        }
        let unit = unit_seconds(c).ok_or_else(|| format!("unknown unit {c:?} in {text:?}"))?;
        let n: u32 = digits.parse().map_err(|_| format!("no number before {c:?} in {text:?}"))?;
        total += n * unit;
        digits.clear();
    }
    if !digits.is_empty() {
        return Err(format!("{digits} has no unit in {text:?}"));
    }
    Ok(total)
}

/// Seconds in one of a unit, private to this file.
fn unit_seconds(unit: char) -> Option<u32> {
    match unit {
        'h' => Some(3600),
        'm' => Some(60),
        's' => Some(1),
        _ => None,
    }
}

/// Each of `count` equal parts of `seconds`. A count of 0 is a bug in the
/// caller, and panics, as dividing by zero does.
pub fn share(seconds: u32, count: u32) -> u32 {
    seconds / count
}

// The unit tests: compiled only for `cargo test`, and able to reach
// `unit_seconds`, which is private.
#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn hours_and_minutes_add_up() {
        assert_eq!(parse_duration("1h30m"), Ok(5400));
    }

    #[test]
    fn a_private_helper_is_tested_from_its_own_file() {
        assert_eq!(unit_seconds('m'), Some(60));
        assert_eq!(unit_seconds('x'), None);
    }

    #[test]
    fn a_bad_unit_says_which() {
        let error = parse_duration("5x").unwrap_err();
        assert!(error.contains("unknown unit 'x'"), "{error}");
    }

    // A test may return a `Result`: an `Err` fails it, and `?` works.
    #[test]
    fn a_test_can_use_question_mark() -> Result<(), String> {
        let seconds = parse_duration("2m5s")?;
        assert_eq!(seconds, 125);
        Ok(())
    }

    // A test that passes only if the code panics, with this in its message.
    #[test]
    #[should_panic(expected = "divide by zero")]
    fn sharing_among_nobody_panics() {
        share(60, 0);
    }
}
