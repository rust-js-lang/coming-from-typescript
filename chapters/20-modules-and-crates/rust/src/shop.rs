//! A shop's items, their total, and a receipt.

// `crate::` starts from this crate's root, as an import from a package's
// own `src/` would.
use crate::money::Money;
// A trait from the `heck` crate: bringing it in scope gives every `str` its
// methods.
use heck::ToKebabCase;

#[derive(Debug, Clone, PartialEq)]
pub struct Item {
    pub name: String,
    pub cents: u32,
}

/// What the items cost together.
pub fn total(items: &[Item]) -> Money {
    Money::from_cents(items.iter().map(|item| item.cents).sum())
}

/// A line for each item, its code made from its name, and the total.
pub fn receipt(items: &[Item]) -> Vec<String> {
    let mut lines: Vec<String> = items
        .iter()
        .map(|item| format!("{} {}", item.name.to_kebab_case(), Money::from_cents(item.cents).format()))
        .collect();
    let sum = total(items);
    lines.push(format!("total {} ({} cents)", sum.format(), sum.cents()));
    lines
}
