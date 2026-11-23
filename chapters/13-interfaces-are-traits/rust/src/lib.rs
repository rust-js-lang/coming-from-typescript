//! Chapter 13: interfaces are traits. A trait names what a type can do, and
//! a type has it only where an `impl` says so: nominal, where TypeScript's
//! interfaces are structural.

use std::fmt;

/// What a shape can do. `describe` comes with a body: a type that
/// implements `Shape` gets it for free.
pub trait Shape {
    fn area(&self) -> f64;
    fn name(&self) -> String;
    fn describe(&self) -> String {
        format!("a {} of area {:.2}", self.name(), self.area())
    }
}

#[derive(Debug, Clone, PartialEq)]
pub struct Circle {
    pub radius: f64,
}

#[derive(Debug, Clone, PartialEq)]
pub struct Square {
    pub side: f64,
}

impl Shape for Circle {
    fn area(&self) -> f64 {
        std::f64::consts::PI * self.radius * self.radius
    }
    fn name(&self) -> String {
        "circle".to_string()
    }
}

impl Shape for Square {
    fn area(&self) -> f64 {
        self.side * self.side
    }
    fn name(&self) -> String {
        "square".to_string()
    }
    // Its own `describe`, in place of the one it would get.
    fn describe(&self) -> String {
        format!("a {0} by {0} square", self.side)
    }
}

/// How a circle prints with `{}`: `Display` is a trait too.
impl fmt::Display for Circle {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "circle(r={})", self.radius)
    }
}

/// The area of any one shape: a generic, the type known where it's called.
pub fn area_of(shape: &impl Shape) -> f64 {
    shape.area()
}

/// A garden's beds, round and square in one list: `dyn Shape` is "some
/// shape", each knowing its own methods.
pub fn garden(circles: &[Circle], squares: &[Square]) -> Vec<String> {
    let mut beds: Vec<Box<dyn Shape>> = Vec::new();
    for circle in circles {
        beds.push(Box::new(circle.clone()));
    }
    for square in squares {
        beds.push(Box::new(square.clone()));
    }
    beds.iter().map(|bed| bed.describe()).collect()
}

/// A circle, printed by its `Display`.
pub fn show(circle: &Circle) -> String {
    circle.to_string()
}

/// A distance, and a time: one number each, and not each other.
#[derive(Debug, Clone, Copy, PartialEq)]
pub struct Meters(pub f64);
#[derive(Debug, Clone, Copy, PartialEq)]
pub struct Seconds(pub f64);

/// How fast: meters over seconds, never the other way round.
pub fn speed(distance: Meters, time: Seconds) -> f64 {
    distance.0 / time.0
}
