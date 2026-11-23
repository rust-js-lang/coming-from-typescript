// Chapter 8: `undefined`, `?.` and `??`, as `rust/src/lib.rs` has `Option`.

export interface Person {
  name: string
  nickname?: string
  manager?: string
}

// What to call someone: their nickname if they have one.
export function callThem(person: Person): string {
  return person.nickname ?? person.name
}

// Someone on the team, by name, if they're on it.
export function find(team: Person[], name: string): Person | undefined {
  return team.find((person) => person.name === name)
}

// What to call someone's manager: each `?.` stops at `undefined`.
export function managersName(team: Person[], name: string): string | undefined {
  const manager = find(team, name)?.manager
  const found = manager === undefined ? undefined : find(team, manager)
  return found === undefined ? undefined : callThem(found)
}

// How long someone's nickname is, if they have one.
export function nicknameLength(person: Person): number | undefined {
  return person.nickname === undefined ? undefined : [...person.nickname].length
}
