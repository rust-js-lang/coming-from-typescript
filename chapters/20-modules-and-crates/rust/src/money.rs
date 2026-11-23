//! An amount of money, kept in cents.

/// An amount of money. Its field is private to this module.
#[derive(Debug, Clone, Copy, PartialEq)]
pub struct Money {
    cents: u32,
}

impl Money {
    pub fn from_cents(cents: u32) -> Money {
        Money { cents }
    }

    /// The amount as people write it: `$12.50`.
    pub fn format(&self) -> String {
        format!("${}.{:02}", self.cents / 100, self.cents % 100)
    }

    /// The cents, for this crate's own code only: `pub(crate)`.
    pub(crate) fn cents(&self) -> u32 {
        self.cents
    }
}
