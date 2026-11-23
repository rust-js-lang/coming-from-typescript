//! Chapter 7: unions are enums. A value that's one of a few kinds, each
//! with its own fields, and a `match` that must handle every kind.
//!
//! `#[rust_js::tag]` and `#[rust_js::name]` make the JavaScript objects
//! TypeScript's discriminated union, `{ kind: "circle", radius }`.

/// A shape: a circle, a square, or a point.
#[derive(Debug, Clone, PartialEq)]
#[cfg_attr(rust_js, rust_js::tag = "kind")]
pub enum Shape {
    #[cfg_attr(rust_js, rust_js::name = "circle")]
    Circle { radius: f64 },
    #[cfg_attr(rust_js, rust_js::name = "square")]
    Square { side: f64 },
    #[cfg_attr(rust_js, rust_js::name = "point")]
    Point,
}

/// How much a shape covers.
///
/// Every kind must be handled. Leave one out and it doesn't compile:
///
/// ```compile_fail,E0004
/// # use chapter_07_unions_are_enums::Shape;
/// fn area(shape: &Shape) -> f64 {
///     match shape {
///         Shape::Circle { radius } => 3.0 * radius * radius,
///         Shape::Square { side } => side * side,
///     }
/// }
/// ```
pub fn area(shape: &Shape) -> f64 {
    match shape {
        Shape::Circle { radius } => std::f64::consts::PI * radius * radius,
        Shape::Square { side } => side * side,
        Shape::Point => 0.0,
    }
}

/// A shape twice as big, of the same kind.
pub fn doubled(shape: &Shape) -> Shape {
    match shape {
        Shape::Circle { radius } => Shape::Circle { radius: radius * 2.0 },
        Shape::Square { side } => Shape::Square { side: side * 2.0 },
        Shape::Point => Shape::Point,
    }
}

/// A shape in words.
pub fn describe(shape: &Shape) -> String {
    match shape {
        Shape::Circle { radius } if *radius == 0.0 => "a circle of no size".to_string(),
        Shape::Circle { radius } => format!("a circle of radius {radius}"),
        Shape::Square { side } => format!("a square of side {side}"),
        Shape::Point => "a point".to_string(),
    }
}
