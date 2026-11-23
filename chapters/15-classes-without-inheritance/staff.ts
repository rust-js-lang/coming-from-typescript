// The staff every case asks about, both ways, as rust/tests/native.rs has it.
import type * as rust from './rust/src/lib.js'
import * as ts from './ts/classes.ts'

export const rustStaff: rust.Staff[] = [
  { person: { name: 'Ada', salary: 120000 }, role: 'Engineer' },
  { person: { name: 'Grace', salary: 150000 }, role: { TAG: 'Manager', reports: 4 } },
  { person: { name: 'Linus', salary: 0 }, role: { TAG: 'Contractor', hours: 80, rate: 95 } },
  { person: { name: 'Alan', salary: 100001 }, role: 'Engineer' },
]

export const tsStaff: ts.Employee[] = [
  new ts.Employee('Ada', 120000),
  new ts.Manager('Grace', 150000, 4),
  new ts.Contractor('Linus', 0, 80, 95),
  new ts.Employee('Alan', 100001),
]
