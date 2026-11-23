//! Chapter 3: numbers that know their kind. TypeScript has one `number`;
//! Rust has whole numbers of each size, signed or not, and floats, and
//! never turns one into another unless you say so.

/// Splits `n` things between two: how many each gets, and what's left.
/// Whole numbers divide into whole numbers: `7 / 2` is `3`.
pub fn share(n: u32) -> (u32, u32) {
    (n / 2, n % 2)
}

/// One more box on a shelf that holds at most 255: none if it's full. A
/// `u8` can't hold 256, so the sum must say what happens past it.
pub fn add_box(boxes: u8) -> Option<u8> {
    boxes.checked_add(1)
}

/// A count typed into a form: a whole number, or why it isn't one.
pub fn parse_count(text: &str) -> Result<u32, String> {
    text.trim().parse::<u32>().map_err(|error| error.to_string())
}

/// An order's id, as the database gives it: past what a JS `number` holds
/// exactly, so a `u64`, which is a `bigint` in JS.
pub fn parse_id(text: &str) -> Option<u64> {
    text.parse().ok()
}

/// The id after it.
pub fn next_id(id: u64) -> u64 {
    id + 1
}

/// A brightness from 0 to 255, of a float: `as` cuts off the fraction, and
/// holds what's past either end at that end.
pub fn brightness(level: f64) -> u8 {
    level as u8
}
