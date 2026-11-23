//! Chapter 18: lifetimes. A reference must not outlive what it refers to.
//! A lifetime, `'a`, is a name for "as long as that lives", which lets a
//! signature say which input a returned reference borrows from.

/// The first word of `text`: a slice of `text` itself, no copy. One input,
/// so Rust knows what the result borrows from without being told.
pub fn first_word(text: &str) -> &str {
    text.split_whitespace().next().unwrap_or("")
}

/// The longer of two strings. Two inputs, so the signature must say: the
/// result lives as long as both do, `'a`.
pub fn longest<'a>(a: &'a str, b: &'a str) -> &'a str {
    if a.chars().count() >= b.chars().count() { a } else { b }
}

/// The sentences of `text` that mention `word`, each a slice of `text`.
/// The result borrows from `text`, not from `word`: only `text` gets `'a`.
pub fn mentions<'a>(text: &'a str, word: &str) -> Vec<&'a str> {
    text.split_inclusive('.')
        .map(str::trim)
        .filter(|sentence| sentence.to_lowercase().contains(&word.to_lowercase()))
        .collect()
}

/// A reader of `key=value` lines that hands out slices of what it reads:
/// a struct that holds a reference says how long, `'a`.
struct Lines<'a> {
    rest: &'a str,
}

impl<'a> Lines<'a> {
    /// The next `key=value` pair, both slices of the original text.
    fn next_pair(&mut self) -> Option<(&'a str, &'a str)> {
        loop {
            let (line, rest) = match self.rest.split_once('\n') {
                Some(split) => split,
                None if self.rest.is_empty() => return None,
                None => (self.rest, ""),
            };
            self.rest = rest;
            if let Some((key, value)) = line.split_once('=') {
                return Some((key.trim(), value.trim()));
            }
        }
    }
}

/// Every `key=value` pair in a config, lines without `=` skipped.
pub fn pairs(config: &str) -> Vec<(String, String)> {
    let mut lines = Lines { rest: config };
    let mut found = Vec::new();
    while let Some((key, value)) = lines.next_pair() {
        found.push((key.to_string(), value.to_string()));
    }
    found
}

/// A string that lives as long as the program: `'static`.
pub fn version() -> &'static str {
    "1.0"
}
