//! Chapter 6: objects are structs. A struct is a named shape; what you can
//! do with it is in an `impl` block beside it.

/// A point on a page.
#[derive(Debug, Clone, PartialEq)]
pub struct Point {
    pub x: f64,
    pub y: f64,
}

/// A rectangle: where its corner is, and how big it is.
#[derive(Debug, Clone, PartialEq)]
pub struct Rect {
    pub corner: Point,
    pub width: f64,
    pub height: f64,
}

impl Rect {
    /// A rectangle of a corner and a size: Rust's constructor is a plain
    /// function, `new` by custom.
    pub fn new(x: f64, y: f64, width: f64, height: f64) -> Rect {
        Rect { corner: Point { x, y }, width, height }
    }

    /// How much of the page it covers. `&self`: it only reads.
    pub fn area(&self) -> f64 {
        self.width * self.height
    }

    /// Whether a point is inside it.
    pub fn contains(&self, point: &Point) -> bool {
        let Point { x, y } = *point;
        x >= self.corner.x && x <= self.corner.x + self.width && y >= self.corner.y && y <= self.corner.y + self.height
    }

    /// A copy of it, moved: the original stays where it was.
    pub fn moved(&self, dx: f64, dy: f64) -> Rect {
        Rect { corner: Point { x: self.corner.x + dx, y: self.corner.y + dy }, ..self.clone() }
    }

    /// Grows it in place. `&mut self`: it changes the rectangle it's called on.
    pub fn grow(&mut self, by: f64) {
        self.width += by;
        self.height += by;
    }
}

/// Whether two rectangles are the same: `==` compares what's in them.
pub fn same(a: &Rect, b: &Rect) -> bool {
    a == b
}

/// A rectangle as `{:?}` shows it, `#[derive(Debug)]`'s.
pub fn debug(rect: &Rect) -> String {
    format!("{rect:?}")
}
