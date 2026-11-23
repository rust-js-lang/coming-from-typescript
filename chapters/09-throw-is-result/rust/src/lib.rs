//! Chapter 9: `throw` is `Result`. A function that can fail says so in its
//! type, and says how: `Result<T, E>` is `Ok(T)` or `Err(E)`.

use std::fmt;

/// An account, and how much is in it, in cents.
#[derive(Debug, Clone, PartialEq)]
pub struct Account {
    pub name: String,
    pub cents: u32,
}

/// Every way a transfer can fail: the caller can `match` on it.
#[derive(Debug, Clone, PartialEq)]
#[cfg_attr(rust_js, rust_js::tag = "kind")]
pub enum TransferError {
    #[cfg_attr(rust_js, rust_js::name = "unknown")]
    UnknownAccount { name: String },
    #[cfg_attr(rust_js, rust_js::name = "short")]
    NotEnough { needed: u32, has: u32 },
    #[cfg_attr(rust_js, rust_js::name = "same")]
    SameAccount,
}

impl fmt::Display for TransferError {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        match self {
            TransferError::UnknownAccount { name } => write!(f, "no account named {name}"),
            TransferError::NotEnough { needed, has } => write!(f, "needs {needed} cents, has {has}"),
            TransferError::SameAccount => write!(f, "from and to are the same account"),
        }
    }
}

/// The index of the account named `name`, or why not.
fn position(accounts: &[Account], name: &str) -> Result<usize, TransferError> {
    (accounts.iter().position(|account| account.name == name))
        .ok_or_else(|| TransferError::UnknownAccount { name: name.to_string() })
}

/// Moves `cents` from one account to another, or says why it can't, and
/// then changes nothing. Each `?` returns the error at once.
pub fn transfer(accounts: &mut [Account], from: &str, to: &str, cents: u32) -> Result<(), TransferError> {
    let from = position(accounts, from)?;
    let to = position(accounts, to)?;
    if from == to {
        return Err(TransferError::SameAccount);
    }
    let has = accounts[from].cents;
    if has < cents {
        return Err(TransferError::NotEnough { needed: cents, has });
    }
    accounts[from].cents -= cents;
    accounts[to].cents += cents;
    Ok(())
}

/// An amount typed as `12.50`, in cents, or why it isn't one.
pub fn parse_cents(text: &str) -> Result<u32, String> {
    let (dollars, cents) = text.trim().split_once('.').unwrap_or((text.trim(), "00"));
    if cents.len() != 2 {
        return Err(format!("{text:?} needs two digits of cents"));
    }
    let dollars: u32 = dollars.parse().map_err(|_| format!("{text:?} isn't an amount"))?;
    let cents: u32 = cents.parse().map_err(|_| format!("{text:?} isn't an amount"))?;
    Ok(dollars * 100 + cents)
}

/// A payment typed into a form: the amount read, then the transfer made.
/// Two kinds of error, one result: each made a message on its way out.
pub fn pay(accounts: &mut [Account], from: &str, to: &str, amount: &str) -> Result<u32, String> {
    let cents = parse_cents(amount)?;
    transfer(accounts, from, to, cents).map_err(|error| error.to_string())?;
    Ok(cents)
}
