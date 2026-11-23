//! Chapter 24: where TypeScript is easier. Three things a TypeScript
//! programmer writes without thinking, and what each costs in Rust.

/// 1. A default argument. Rust has none, and no overloads either: a
/// parameter that may be left out is an `Option` the caller always writes.
pub fn greet(name: &str, greeting: Option<&str>) -> String {
    format!("{}, {name}!", greeting.unwrap_or("Hello"))
}

/// A user.
#[derive(Debug, Clone, PartialEq)]
pub struct User {
    pub name: String,
    pub email: String,
    pub age: u32,
}

/// 2. `Partial<User>`. Rust has no type that's "a struct with every field
/// optional": it's a second struct, written by hand, kept in step by hand.
#[derive(Debug, Clone, PartialEq, Default)]
pub struct UserPatch {
    pub name: Option<String>,
    pub email: Option<String>,
    pub age: Option<u32>,
}

/// A user with the patch's fields in place of theirs: TypeScript's
/// `{ ...user, ...patch }`, field by field.
pub fn update(user: &User, patch: &UserPatch) -> User {
    User {
        name: patch.name.clone().unwrap_or_else(|| user.name.clone()),
        email: patch.email.clone().unwrap_or_else(|| user.email.clone()),
        age: patch.age.unwrap_or(user.age),
    }
}

/// 3. Objects that point at each other. A tree whose nodes know their
/// parents is a cycle of references, which one owner per value doesn't
/// allow. The usual Rust answer is an *arena*: every node in one `Vec`,
/// and a parent is an index into it.
struct Node {
    name: String,
    parent: Option<usize>,
}

/// From `start` up to the root, given each `(child, parent)` pair.
pub fn path_to_root(edges: &[(String, String)], start: &str) -> Vec<String> {
    let mut nodes: Vec<Node> = Vec::new();
    let index = |nodes: &mut Vec<Node>, name: &str| match nodes.iter().position(|node| node.name == name) {
        Some(at) => at,
        None => {
            nodes.push(Node { name: name.to_string(), parent: None });
            nodes.len() - 1
        }
    };
    for (child, parent) in edges {
        let parent = index(&mut nodes, parent);
        let child = index(&mut nodes, child);
        nodes[child].parent = Some(parent);
    }
    let mut path = Vec::new();
    let mut at = nodes.iter().position(|node| node.name == start);
    while let Some(i) = at {
        path.push(nodes[i].name.clone());
        at = nodes[i].parent;
    }
    path
}
