//! Chapter 21: async. `async fn` and `.await` read as TypeScript's do. The
//! difference is underneath: a Rust future does nothing until something
//! polls it, where a JavaScript promise starts the moment it's made.

/// An item's price, answered later, as a server would: `ready` is a future
/// that's done the first time it's asked.
pub async fn price(item: &str) -> Result<u32, String> {
    std::future::ready(match item {
        "tea" => Ok(350),
        "cake" => Ok(425),
        "jam" => Ok(600),
        _ => Err(format!("no price for {item}")),
    })
    .await
}

/// What a basket costs: each price awaited in turn, and `?` makes the
/// first error the whole answer, as in any function.
pub async fn total(items: &[String]) -> Result<u32, String> {
    let mut sum = 0;
    for item in items {
        sum += price(item).await?;
    }
    Ok(sum)
}

/// A receipt: an async function awaits another, as in TypeScript.
pub async fn receipt(items: &[String]) -> String {
    match total(items).await {
        Ok(cents) => format!("{} items, {cents} cents", items.len()),
        Err(why) => format!("can't total: {why}"),
    }
}

/// Where a future being lazy shows. Native Rust alone compiles this: in
/// rust-js a future is a promise, which starts as it's made, and rust-js
/// refuses both functions rather than run them differently (ADR 0029).
#[cfg(not(rust_js))]
pub mod lazy {
    use std::cell::RefCell;

    /// A step that writes to the log when it starts.
    async fn step(log: &RefCell<Vec<String>>, name: &str) {
        log.borrow_mut().push(format!("{name} started"));
    }

    /// Makes a future and drops it, never awaited. In Rust, its body never
    /// runs: a future is a plan until it's polled.
    pub fn made_not_awaited() -> Vec<String> {
        let log = RefCell::new(Vec::new());
        let future = step(&log, "step");
        log.borrow_mut().push("made".to_string());
        drop(future);
        log.into_inner()
    }

    /// Makes a future, then awaits it: in Rust, its body runs at the `.await`.
    pub async fn made_then_awaited() -> Vec<String> {
        let log = RefCell::new(Vec::new());
        let future = step(&log, "step");
        log.borrow_mut().push("made".to_string());
        future.await;
        log.into_inner()
    }
}
