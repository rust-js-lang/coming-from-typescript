//! Chapter 11: maps and sets. `HashMap` and `HashSet` are `Map` and `Set`,
//! with two differences: a key is equal by what's in it, not by which
//! object it is, and a `HashMap`'s order is no order at all.

use std::collections::{BTreeMap, BTreeSet, HashMap, HashSet};

/// How many times each word appears. `entry` finds a key's slot, filled or
/// not, so counting is one line.
pub fn word_counts(text: &str) -> HashMap<String, u32> {
    let mut counts = HashMap::new();
    for word in text.split_whitespace() {
        *counts.entry(word.to_lowercase()).or_insert(0) += 1;
    }
    counts
}

/// The same counts, in alphabetical order: a `BTreeMap` keeps its keys sorted.
pub fn sorted_counts(text: &str) -> Vec<(String, u32)> {
    let mut counts = BTreeMap::new();
    for word in text.split_whitespace() {
        *counts.entry(word.to_lowercase()).or_insert(0) += 1;
    }
    counts.into_iter().collect()
}

/// The word that appears most, the first in the alphabet of any tie.
pub fn most_common(text: &str) -> Option<(String, u32)> {
    sorted_counts(text).into_iter().max_by(|(a, x), (b, y)| x.cmp(y).then(b.cmp(a)))
}

/// How many different places a walk visits. A point is a tuple, equal to
/// another of the same numbers, whichever value it is.
pub fn places_visited(steps: &[(i32, i32)]) -> usize {
    let mut seen = HashSet::new();
    let mut at = (0, 0);
    seen.insert(at);
    for (dx, dy) in steps {
        at = (at.0 + dx, at.1 + dy);
        seen.insert(at);
    }
    seen.len()
}

/// The tags two posts share, in order.
pub fn shared_tags(a: &[String], b: &[String]) -> Vec<String> {
    let a: BTreeSet<&String> = a.iter().collect();
    let b: BTreeSet<&String> = b.iter().collect();
    a.intersection(&b).map(|tag| tag.to_string()).collect()
}
