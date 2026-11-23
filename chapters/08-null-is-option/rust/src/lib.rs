//! Chapter 8: `null` is `Option`. Rust has no `null` and no `undefined`:
//! a value that may be missing is an `Option`, `Some(value)` or `None`,
//! and you can't use the value without saying what happens when it's
//! not there.

/// A person on a team.
#[derive(Debug, Clone, PartialEq)]
pub struct Person {
    pub name: String,
    pub nickname: Option<String>,
    pub manager: Option<String>,
}

/// What to call someone: their nickname if they have one. `unwrap_or` is `??`.
pub fn call_them(person: &Person) -> &str {
    person.nickname.as_deref().unwrap_or(&person.name)
}

/// Someone on the team, by name, if they're on it.
pub fn find<'a>(team: &'a [Person], name: &str) -> Option<&'a Person> {
    team.iter().find(|person| person.name == name)
}

/// What to call someone's manager. Each `?` is `?.`: if what's before it
/// is `None`, the whole function is `None`.
pub fn managers_name(team: &[Person], name: &str) -> Option<String> {
    let person = find(team, name)?;
    let manager = find(team, person.manager.as_deref()?)?;
    Some(call_them(manager).to_string())
}

/// The same, for a caller that tests `=== null`: its `None` is `null`.
#[cfg_attr(rust_js, rust_js::nullable)]
pub fn managers_name_or_null(team: &[Person], name: &str) -> Option<String> {
    managers_name(team, name)
}

/// How long someone's nickname is, if they have one: `map` changes what's
/// inside a `Some` and leaves a `None` alone.
pub fn nickname_length(person: &Person) -> Option<usize> {
    person.nickname.as_ref().map(|nickname| nickname.chars().count())
}
