//! The chapter's cases, run by native Rust: what rust-js's JS must say too.

use chapter_15_classes_without_inheritance::{Person, Role, Staff, Temperature, payroll};
use serde::Deserialize;

#[derive(Deserialize)]
struct Cases {
    celsius: Vec<(f64, Result<(f64, f64), String>)>,
    fahrenheit: Vec<(f64, Result<(f64, f64), String>)>,
    staff: Vec<(u32, String)>,
    payroll: u32,
}

/// The staff every case asks about.
pub fn staff() -> Vec<Staff> {
    let staff = |name: &str, salary, role| Staff { person: Person { name: name.to_string(), salary }, role };
    vec![
        staff("Ada", 120000, Role::Engineer),
        staff("Grace", 150000, Role::Manager { reports: 4 }),
        staff("Linus", 0, Role::Contractor { hours: 80, rate: 95 }),
        staff("Alan", 100001, Role::Engineer),
    ]
}

/// A temperature as cases.json writes it: Celsius and Fahrenheit, or why not.
pub fn both(temperature: Result<Temperature, String>) -> Result<(f64, f64), String> {
    temperature.map(|t| (t.celsius(), t.fahrenheit()))
}

#[test]
fn native_rust_says_what_each_case_says() {
    let cases: Cases = serde_json::from_str(include_str!("../../cases.json")).unwrap();
    for (c, said) in cases.celsius {
        assert_eq!(both(Temperature::from_celsius(c)), said, "{c}°C");
    }
    for (f, said) in cases.fahrenheit {
        assert_eq!(both(Temperature::from_fahrenheit(f)), said, "{f}°F");
    }
    for (member, (pay, described)) in staff().iter().zip(&cases.staff) {
        assert_eq!(member.monthly_pay(), *pay);
        assert_eq!(&member.describe(), described);
    }
    assert_eq!(payroll(&staff()), cases.payroll);
}
