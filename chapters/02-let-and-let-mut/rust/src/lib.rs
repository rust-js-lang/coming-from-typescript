//! Chapter 2: `let` and `let mut`. In Rust, nothing changes unless you say
//! it may: not a variable, and not what a variable holds.

/// A name made into a URL slug, one step at a time, each step a new `name`
/// that hides the one before it.
pub fn slug(name: &str) -> String {
    let name = name.trim();
    let name = name.to_lowercase();
    let name = name.replace(' ', "-");
    name
}

/// The total of some prices, in cents: `total` changes, so it says `mut`.
pub fn total(prices: &[u32]) -> u32 {
    let mut total = 0;
    for price in prices {
        total += price;
    }
    total
}

/// Adds an item to the cart it's given. It changes the caller's cart, so
/// it takes it `&mut`, and the caller must give it `&mut` too.
pub fn add_item(cart: &mut Vec<String>, item: &str) {
    cart.push(item.to_string());
}

/// A new cart: the one it's given, and an item. The caller's is untouched,
/// and the signature says so: `&[String]` can only be read.
pub fn with_item(cart: &[String], item: &str) -> Vec<String> {
    let mut more = cart.to_vec();
    more.push(item.to_string());
    more
}
