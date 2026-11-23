//! Chapter 1: the same function, twice. A little statistics module, as
//! `ts/stats.ts` writes it in TypeScript.

/// The mean of some numbers, or nothing if there are none.
pub fn mean(xs: &[f64]) -> Option<f64> {
    if xs.is_empty() {
        return None;
    }
    let mut sum = 0.0;
    for x in xs {
        sum += x;
    }
    Some(sum / xs.len() as f64)
}

/// The largest of some numbers, or nothing if there are none.
pub fn largest(xs: &[f64]) -> Option<f64> {
    let mut largest = None;
    for &x in xs {
        largest = match largest {
            Some(most) if most >= x => Some(most),
            _ => Some(x),
        };
    }
    largest
}

/// A sentence about some numbers.
pub fn describe(xs: &[f64]) -> String {
    match (mean(xs), largest(xs)) {
        (Some(mean), Some(largest)) => format!("{} numbers, mean {mean}, largest {largest}", xs.len()),
        _ => "no numbers".to_string(),
    }
}
