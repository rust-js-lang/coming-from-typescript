//! Chapter 5: everything is an expression. `if`, `match`, a block and even
//! a `loop` have a value, so there's no ternary and no `let` waiting to be
//! assigned.

/// A letter grade: a `match` of ranges is the value.
pub fn grade(score: u32) -> &'static str {
    match score {
        90..=100 => "A",
        80..=89 => "B",
        70..=79 => "C",
        0..=69 => "F",
        _ => "not a score",
    }
}

/// Shipping, in cents: free over 50 dollars, and 10 more to be fast. Each
/// `if` is a value, added.
pub fn shipping(total: u32, express: bool) -> u32 {
    let base = if total >= 5000 { 0 } else { 499 };
    base + if express { 1000 } else { 0 }
}

/// Where the first number below zero is: a `loop` whose `break` gives the
/// answer.
pub fn first_negative(xs: &[i32]) -> Option<usize> {
    let mut i = 0;
    loop {
        if i == xs.len() {
            break None;
        }
        if xs[i] < 0 {
            break Some(i);
        }
        i += 1;
    }
}

/// A sentence about a number: a block's last line is its value.
pub fn describe(n: i32) -> String {
    let size = {
        let distance = n.unsigned_abs();
        if distance < 10 { "small" } else { "large" }
    };
    let sign = match n {
        0 => "zero",
        n if n < 0 => "negative",
        _ => "positive",
    };
    format!("{n} is {size} and {sign}")
}
