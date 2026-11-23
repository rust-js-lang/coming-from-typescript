// Chapter 22: the same parser in TypeScript, tested in duration.test.ts.

const units: Record<string, number> = { h: 3600, m: 60, s: 1 }

// How many seconds a duration like `1h30m` or `90s` is. Throws if it isn't one.
export function parseDuration(text: string): number {
  if (text === '') throw new Error('empty duration')
  let total = 0
  let digits = ''
  for (const c of text) {
    if (c >= '0' && c <= '9') {
      digits += c
      continue
    }
    const unit = units[c]
    if (unit === undefined) throw new Error(`unknown unit '${c}' in ${JSON.stringify(text)}`)
    if (digits === '') throw new Error(`no number before '${c}' in ${JSON.stringify(text)}`)
    total += Number(digits) * unit
    digits = ''
  }
  if (digits !== '') throw new Error(`${digits} has no unit in ${JSON.stringify(text)}`)
  return total
}

// Each of `count` equal parts of `seconds`. Dividing by 0 gives Infinity,
// no error.
export const share = (seconds: number, count: number) => Math.floor(seconds / count)
