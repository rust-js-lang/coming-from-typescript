//! Chapter 17: borrowing. A reference lends a value without giving it
//! away: `&` to read, `&mut` to change. Many readers, or one writer, never
//! both at once.

/// How many letters in all: a shared borrow, `&`, only reads.
pub fn letters(words: &[String]) -> usize {
    words.iter().map(|word| word.chars().count()).sum()
}

/// Makes each word start with a capital, in place: a mutable borrow,
/// `&mut`, may change what it's lent.
pub fn capitalize_all(words: &mut [String]) {
    for word in words.iter_mut() {
        let mut chars = word.chars();
        if let Some(first) = chars.next() {
            *word = first.to_uppercase().chain(chars).collect();
        }
    }
}

/// Removes the words shorter than `min`, in place. `retain` walks the list
/// and removes as it goes, safely; removing inside a `for` over the same
/// list doesn't compile.
pub fn remove_short(words: &mut Vec<String>, min: usize) {
    words.retain(|word| word.chars().count() >= min);
}

/// Adds to a score: a `&mut` to a number, changed where it lives.
pub fn add_points(score: &mut u32, points: u32) {
    *score += points;
}

/// A round of a game: each correct answer scores, through one `&mut` at a
/// time.
pub fn play(answers: &[bool]) -> u32 {
    let mut score = 0;
    for &right in answers {
        if right {
            add_points(&mut score, 10);
        }
    }
    score
}

/// Swaps the halves' first items: `split_at_mut` lends two parts of one
/// slice, each `&mut`, because they can't overlap.
pub fn swap_halves(xs: &mut [i32]) {
    let middle = xs.len() / 2;
    let (left, right) = xs.split_at_mut(middle);
    if let (Some(a), Some(b)) = (left.first_mut(), right.first_mut()) {
        std::mem::swap(a, b);
    }
}
