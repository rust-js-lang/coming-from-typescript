//! Chapter 15: classes without inheritance. Private fields keep a value
//! valid, composition puts one struct inside another, and an enum or a
//! trait does what a class hierarchy did.

/// A temperature that can't be below absolute zero. Its field is private:
/// only this module can make one, so every `Temperature` was checked.
#[derive(Debug, Clone, Copy, PartialEq, PartialOrd)]
pub struct Temperature {
    celsius: f64,
}

impl Temperature {
    /// The lowest a temperature can be, in Celsius: a constant of the type.
    pub const ABSOLUTE_ZERO: f64 = -273.15;

    /// A temperature in Celsius, or why it can't be one.
    pub fn from_celsius(celsius: f64) -> Result<Temperature, String> {
        if celsius.is_nan() || celsius < Self::ABSOLUTE_ZERO {
            return Err(format!("{celsius}°C is below absolute zero"));
        }
        Ok(Temperature { celsius })
    }

    /// A temperature in Fahrenheit, or why it can't be one.
    pub fn from_fahrenheit(fahrenheit: f64) -> Result<Temperature, String> {
        Self::from_celsius((fahrenheit - 32.0) * 5.0 / 9.0)
    }

    pub fn celsius(&self) -> f64 {
        self.celsius
    }

    pub fn fahrenheit(&self) -> f64 {
        self.celsius * 9.0 / 5.0 + 32.0
    }
}

/// A person, whatever their job.
#[derive(Debug, Clone, PartialEq)]
pub struct Person {
    pub name: String,
    pub salary: u32,
}

/// What someone does: the closed list of jobs, where TypeScript would
/// have a subclass for each.
#[derive(Debug, Clone, PartialEq)]
pub enum Role {
    Engineer,
    Manager { reports: u32 },
    Contractor { hours: u32, rate: u32 },
}

/// Someone on the staff: a `Person` inside, not a `Person` extended.
#[derive(Debug, Clone, PartialEq)]
pub struct Staff {
    pub person: Person,
    pub role: Role,
}

impl Staff {
    /// A month's pay. Each role's rule is an arm, where a subclass would
    /// override a method and call `super`.
    pub fn monthly_pay(&self) -> u32 {
        let base = self.person.salary / 12;
        match self.role {
            Role::Engineer => base,
            Role::Manager { reports } => base + 100 * reports,
            Role::Contractor { hours, rate } => hours * rate,
        }
    }

    /// Who they are and what they do.
    pub fn describe(&self) -> String {
        let job = match &self.role {
            Role::Engineer => "an engineer".to_string(),
            Role::Manager { reports } => format!("a manager of {reports}"),
            Role::Contractor { hours, .. } => format!("a contractor for {hours} hours"),
        };
        format!("{} is {job}", self.person.name)
    }
}

/// The whole staff's pay for a month.
pub fn payroll(staff: &[Staff]) -> u32 {
    staff.iter().map(Staff::monthly_pay).sum()
}
