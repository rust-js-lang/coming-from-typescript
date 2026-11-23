// bun chapters/15-classes-without-inheritance/compare.ts: the staff's pay,
// by a class hierarchy and by composition and an enum.
import * as rust from './rust/src/lib.js'
import { rustStaff, tsStaff } from './staff.ts'

rustStaff.forEach((member, i) => {
  const employee = tsStaff[i]!
  console.log(`${rust.Staff.describe(member)}`)
  console.log(`  ts:   ${employee.monthlyPay()}   rust: ${rust.Staff.monthlyPay(member)}`)
})
const result = rust.Temperature.fromCelsius(-300)
console.log(`-300°C: ${result.TAG === 'Err' ? result._0 : 'made'}`)
