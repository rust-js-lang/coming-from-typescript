//! Chapter 23: calling JavaScript, and being called from TypeScript. A
//! binding declares a function TypeScript has; an exported function takes
//! a TypeScript callback as a closure.

/// `formatMoney` of `ts/currency.ts`, bound: rust-js writes the `import`,
/// and rustc checks each call against these types. Its body never runs:
/// native Rust has no JavaScript to call, so it's `unreachable!()`.
#[cfg_attr(rust_js, rust_js::link_name = "../../ts/currency.ts#formatMoney")]
fn format_money(minor: u32, currency: &str) -> String {
    unreachable!("{minor} {currency}: a binding runs only in JavaScript")
}

/// An item and its price, in the currency's smallest unit.
#[derive(Debug, Clone, PartialEq)]
pub struct Item {
    pub name: String,
    pub price: u32,
}

/// What the items cost: plain Rust, the same natively and in JavaScript.
pub fn total(items: &[Item]) -> u32 {
    items.iter().map(|item| item.price).sum()
}

/// The total after a discount the caller decides: a closure, which a
/// TypeScript caller gives as a function.
pub fn discounted(items: &[Item], rule: impl Fn(&Item) -> u32) -> u32 {
    items.iter().map(|item| item.price - rule(item).min(item.price)).sum()
}

/// A receipt's lines, each price as TypeScript's `Intl` writes it.
pub fn receipt(items: &[Item], currency: &str) -> Vec<String> {
    let mut lines: Vec<String> =
        items.iter().map(|item| format!("{} {}", item.name, format_money(item.price, currency))).collect();
    lines.push(format!("total {}", format_money(total(items), currency)));
    lines
}
