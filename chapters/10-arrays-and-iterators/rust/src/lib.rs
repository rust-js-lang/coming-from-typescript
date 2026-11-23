//! Chapter 10: arrays and iterators. A `Vec` owns its items and a slice
//! borrows them; an iterator walks them, lazily, a step at a time, only as
//! far as something asks.

/// A student and their score.
#[derive(Debug, Clone, PartialEq)]
pub struct Student {
    pub name: String,
    pub score: u32,
}

/// The names of those who passed, in order: nothing is built between the
/// steps, and `collect` makes the one `Vec` at the end.
pub fn passing(students: &[Student]) -> Vec<String> {
    students.iter().filter(|s| s.score >= 50).map(|s| s.name.clone()).collect()
}

/// The `n` best scores, best first.
pub fn top(scores: &[u32], n: usize) -> Vec<u32> {
    let mut sorted = scores.to_vec();
    sorted.sort_unstable_by(|a, b| b.cmp(a));
    sorted.truncate(n);
    sorted
}

/// The first `n` squares past `limit`, of every whole number there is: the
/// range has no end, and the chain stops when `take` has enough.
pub fn squares_past(limit: u32, n: usize) -> Vec<u32> {
    (1u32..).map(|x| x * x).filter(|&square| square > limit).take(n).collect()
}

/// Each total so far: `scan` carries a running sum along.
pub fn running_totals(xs: &[i32]) -> Vec<i32> {
    xs.iter()
        .scan(0, |total, x| {
            *total += x;
            Some(*total)
        })
        .collect()
}

/// How much each step went up or down: `windows(2)` sees each pair side by side.
pub fn changes(xs: &[i32]) -> Vec<i32> {
    xs.windows(2).map(|pair| pair[1] - pair[0]).collect()
}

/// The item at `i`, if there is one: `get` gives an `Option`, where `xs[i]`
/// past the end would panic.
pub fn item(xs: &[i32], i: usize) -> Option<i32> {
    xs.get(i).copied()
}
