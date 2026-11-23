//! Chapter 19: `Rc` and `RefCell`. When one value really needs several
//! owners, `Rc` counts them; when they need to change it, `RefCell` checks
//! the borrowing rules while the program runs, instead of before.

use std::cell::{Cell, RefCell};
use std::rc::Rc;

/// A chat room every member shares. Its log changes through a shared
/// reference: a `RefCell` lends it mutably, one borrow at a time. A `Cell`
/// holds a number that's swapped whole, with no borrow at all.
struct Room {
    log: RefCell<Vec<String>>,
    said: Cell<u32>,
}

/// A member holds the room: one of its owners, by `Rc`.
struct Member {
    name: String,
    room: Rc<Room>,
}

impl Member {
    fn join(name: &str, room: &Rc<Room>) -> Member {
        Member { name: name.to_string(), room: Rc::clone(room) }
    }

    /// Says something: `&self`, and still the room's log changes.
    fn say(&self, text: &str) {
        self.room.log.borrow_mut().push(format!("{}: {text}", self.name));
        self.room.said.set(self.room.said.get() + 1);
    }
}

/// A conversation, each line a speaker and what they said. Each speaker
/// joins the room once; all of them write to the one log.
pub fn chat(lines: &[(String, String)]) -> Vec<String> {
    let room = Rc::new(Room { log: RefCell::new(Vec::new()), said: Cell::new(0) });
    let mut members: Vec<Member> = Vec::new();
    for (speaker, text) in lines {
        if !members.iter().any(|m| &m.name == speaker) {
            members.push(Member::join(speaker, &room));
        }
        let member = members.iter().find(|m| &m.name == speaker).unwrap();
        member.say(text);
    }
    let mut log = room.log.borrow().clone();
    log.push(format!("{} said, {} owners", room.said.get(), Rc::strong_count(&room)));
    log
}

/// How many own the room after `n` join and the first `gone` leave: each
/// `Rc::clone` counts one more, each drop one less.
pub fn owners(n: usize, gone: usize) -> usize {
    let room = Rc::new(Room { log: RefCell::new(Vec::new()), said: Cell::new(0) });
    let mut members: Vec<Member> = (0..n).map(|i| Member::join(&format!("m{i}"), &room)).collect();
    members.drain(..gone.min(n));
    Rc::strong_count(&room)
}

/// Reads the log while writing it: the borrowing rule, broken where the
/// compiler can't see. `RefCell` catches it as the program runs, and panics.
pub fn read_while_writing() -> usize {
    let log = RefCell::new(vec!["hello".to_string()]);
    let reading = log.borrow();
    log.borrow_mut().push("again".to_string());
    reading.len()
}
