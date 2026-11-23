//! Chapter 4: strings are UTF-8. A Rust string is bytes that are always
//! valid UTF-8; its length is in bytes, and its `char`s are Unicode's
//! code points, never half of one.

/// How long a text is: in bytes, as Rust stores it, and in `char`s.
pub fn sizes(text: &str) -> (usize, usize) {
    (text.len(), text.chars().count())
}

/// The first letter of each word, in capitals: `"ada lovelace"` → `"AL"`.
pub fn initials(name: &str) -> String {
    let firsts: String = name.split_whitespace().filter_map(|word| word.chars().next()).collect();
    firsts.to_uppercase()
}

/// At most `max` `char`s of the text, and `…` where it was cut.
pub fn shorten(text: &str, max: usize) -> String {
    match text.char_indices().nth(max) {
        Some((cut, _)) => format!("{}…", &text[..cut]),
        None => text.to_string(),
    }
}

/// The text backwards, `char` by `char`.
pub fn reverse(text: &str) -> String {
    text.chars().rev().collect()
}

/// The first word, borrowed from the text: no copy is made.
pub fn first_word(text: &str) -> &str {
    text.split(' ').next().unwrap_or("")
}
