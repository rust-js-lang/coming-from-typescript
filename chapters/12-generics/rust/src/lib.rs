//! Chapter 12: generics. A type parameter, `<T>`, as in TypeScript, and a
//! *bound*, `T: PartialOrd`, that says what a `T` must be able to do before
//! the body may do it.

use std::collections::HashMap;
use std::hash::Hash;

/// The largest item, if there are any. Comparing needs `PartialOrd`, and
/// returning a copy of one needs `Copy`: without them, it doesn't compile.
pub fn largest<T: PartialOrd + Copy>(xs: &[T]) -> Option<T> {
    let mut best = *xs.first()?;
    for &x in xs {
        if x > best {
            best = x;
        }
    }
    Some(best)
}

/// The highest score: `largest`, of `i32`s.
pub fn highest(scores: &[i32]) -> Option<i32> {
    largest(scores)
}

/// The letter of a word that's last in the alphabet: `largest`, of `char`s.
pub fn last_letter(word: &str) -> Option<char> {
    largest(&word.chars().collect::<Vec<char>>())
}

/// Items grouped by a key: any item, any key that can be hashed and compared.
pub fn group_by<T: Clone, K: Eq + Hash>(items: &[T], key: impl Fn(&T) -> K) -> HashMap<K, Vec<T>> {
    let mut groups: HashMap<K, Vec<T>> = HashMap::new();
    for item in items {
        groups.entry(key(item)).or_default().push(item.clone());
    }
    groups
}

/// Words grouped by their length.
pub fn by_length(words: &[String]) -> HashMap<usize, Vec<String>> {
    group_by(words, |word| word.chars().count())
}

/// A stack of anything: a generic struct.
#[derive(Debug, Clone, PartialEq, Default)]
pub struct Stack<T> {
    pub items: Vec<T>,
}

impl<T: Clone> Stack<T> {
    /// An empty stack.
    pub fn new() -> Stack<T> {
        Stack { items: Vec::new() }
    }

    /// Puts an item on top.
    pub fn push(&mut self, item: T) {
        self.items.push(item);
    }

    /// Takes the top item off, if there is one.
    pub fn pop(&mut self) -> Option<T> {
        self.items.pop()
    }

    /// The top item, left where it is.
    pub fn peek(&self) -> Option<T> {
        self.items.last().cloned()
    }
}

/// Whether every bracket in `text` is closed by its partner, in order: a
/// `Stack<char>` remembers the ones still open.
pub fn balanced(text: &str) -> bool {
    let mut open = Stack::new();
    for c in text.chars() {
        match c {
            '(' | '[' | '{' => open.push(c),
            ')' | ']' | '}' => {
                let want = match c {
                    ')' => '(',
                    ']' => '[',
                    _ => '{',
                };
                if open.pop() != Some(want) {
                    return false;
                }
            }
            _ => {}
        }
    }
    open.peek().is_none()
}
