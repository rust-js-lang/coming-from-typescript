// The team every case asks about, as rust/tests/native.rs has it: a
// missing nickname or manager is a key left out.
import type { Person } from './ts/team.ts'

export const team: Person[] = [
  { name: 'Ada', nickname: 'Countess' },
  { name: 'Grace', manager: 'Ada' },
  { name: 'Linus', nickname: 'Tux', manager: 'Grace' },
  { name: 'Alan', manager: 'Turing' },
]
