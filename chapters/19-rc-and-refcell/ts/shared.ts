// Chapter 19: shared, changeable objects, as every TypeScript object is,
// beside `rust/src/lib.rs`'s `Rc<RefCell<..>>`.

interface Room {
  log: string[]
  said: number
}

class Member {
  constructor(
    readonly name: string,
    readonly room: Room,
  ) {}
  say(text: string) {
    this.room.log.push(`${this.name}: ${text}`)
    this.room.said += 1
  }
}

// A conversation, each line a speaker and what they said. Every member
// holds the one room. Nothing counts its owners: the garbage collector
// frees it when none are left.
export function chat(lines: readonly [string, string][]): string[] {
  const room: Room = { log: [], said: 0 }
  const members: Member[] = []
  for (const [speaker, text] of lines) {
    let member = members.find((m) => m.name === speaker)
    if (!member) members.push((member = new Member(speaker, room)))
    member.say(text)
  }
  return [...room.log, `${room.said} said, ${members.length + 1} owners`]
}

// Reads the log while writing it: allowed, and the reader sees the write.
export function readWhileWriting(): number {
  const log = ['hello']
  const reading = log
  log.push('again')
  return reading.length
}
