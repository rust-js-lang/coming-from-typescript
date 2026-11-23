// The TypeScript and the Rust rust-js compiled give what cases.json records
// native Rust giving, of the same team: "nothing" is `undefined` from both,
// `null` in the JSON, and `null` from the `#[rust_js::nullable]` one.
// rust/tests/native.rs holds native Rust to the same cases.
import { expect, test } from 'bun:test'
import cases from './cases.json'
import * as rust from './rust/src/lib.js'
import { team } from './team.ts'
import * as ts from './ts/team.ts'

for (const { name, call_them, managers_name, nickname_length } of cases) {
  test(name, () => {
    const person = team.find((p) => p.name === name)
    expect(person ? rust.callThem(person) : null).toBe(call_them)
    expect(person ? ts.callThem(person) : null).toBe(call_them)
    expect(rust.managersName(team, name) ?? null).toBe(managers_name)
    expect(ts.managersName(team, name) ?? null).toBe(managers_name)
    expect(person ? (rust.nicknameLength(person) ?? null) : null).toBe(nickname_length)
    expect(person ? (ts.nicknameLength(person) ?? null) : null).toBe(nickname_length)
  })
}

test("None is undefined, or null where the function's #[rust_js::nullable]", () => {
  expect(rust.managersName(team, 'Ada')).toBe(undefined)
  expect(rust.managersNameOrNull(team, 'Ada')).toBe(null)
  expect(rust.managersNameOrNull(team, 'Grace')).toBe('Countess')
})

test('a None given in is null or undefined alike', () => {
  expect(rust.callThem({ name: 'Ada', nickname: undefined })).toBe('Ada')
  expect(rust.callThem({ name: 'Ada', nickname: null as unknown as undefined })).toBe('Ada')
})
