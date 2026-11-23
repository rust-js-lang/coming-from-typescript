//! Chapter 16: moves. Every value has one owner. Giving it away moves it,
//! and the old name can't be used again; when the owner is done, the value
//! is dropped, and anything it holds is let go.

/// An order, made from a cart.
#[derive(Debug, Clone, PartialEq)]
pub struct Order {
    pub items: Vec<String>,
    pub count: usize,
}

/// Turns a cart into an order. It takes the cart, not a look at it: after
/// this, the caller's cart is gone, so nothing can add to the order behind
/// its back.
pub fn checkout(cart: Vec<String>) -> Order {
    let count = cart.len();
    Order { items: cart, count }
}

/// Two orders from one cart: the first needs its own copy, a `clone`, since
/// the second takes the cart itself.
pub fn order_twice(cart: Vec<String>) -> (Order, Order) {
    let first = checkout(cart.clone());
    let second = checkout(cart);
    (first, second)
}

/// A point is two numbers, cheap to copy: `Copy` makes passing it a copy,
/// and the old name stays usable.
#[derive(Debug, Clone, Copy, PartialEq)]
pub struct Point {
    pub x: f64,
    pub y: f64,
}

/// A point and where it goes, both: `p` was copied into `moved`.
pub fn step(p: Point) -> (Point, Point) {
    let moved = Point { x: p.x + 1.0, ..p };
    (p, moved)
}

/// A section of a log that closes itself when it's dropped.
struct Section<'a> {
    log: &'a mut Vec<String>,
    name: &'static str,
}

impl<'a> Section<'a> {
    fn open(log: &'a mut Vec<String>, name: &'static str) -> Section<'a> {
        log.push(format!("open {name}"));
        Section { log, name }
    }

    fn note(&mut self, line: &str) {
        self.log.push(format!("  {line}"));
    }
}

impl Drop for Section<'_> {
    fn drop(&mut self) {
        self.log.push(format!("close {}", self.name));
    }
}

/// Writes each line into a section, stopping at an empty one. The section
/// closes on the way out, whichever way out it is: no `finally` needed.
fn write_all(log: &mut Vec<String>, lines: &[String]) -> Result<(), String> {
    let mut file = Section::open(log, "file");
    for (i, line) in lines.iter().enumerate() {
        if line.is_empty() {
            return Err(format!("line {} is empty", i + 1));
        }
        file.note(line);
    }
    Ok(())
}

/// What `write_all` did, in order, and how it ended.
pub fn save(lines: &[String]) -> Vec<String> {
    let mut log = Vec::new();
    let result = write_all(&mut log, lines);
    log.push(match result {
        Ok(()) => "saved".to_string(),
        Err(why) => format!("failed: {why}"),
    });
    log
}
