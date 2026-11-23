// Chapter 14: narrowing, as TypeScript does it, beside `rust/src/lib.rs`'s
// patterns: test the value, and TypeScript knows more after each test.

export type Value = number | string | Value[]

// A value in words.
export function describe(value: Value): string {
  if (typeof value === 'number') {
    return Number.isInteger(value) ? `the whole number ${value}` : `the number ${value}`
  }
  if (typeof value === 'string') {
    return value === '' ? 'no text' : `the text ${JSON.stringify(value)}`
  }
  if (value.length === 0) return 'an empty list'
  if (value.length === 1) return `a list of just ${describe(value[0]!)}`
  if (value.length === 2 && typeof value[0] === 'number' && typeof value[1] === 'number') return 'a pair of numbers'
  return `a list from ${describe(value[0]!)} to ${describe(value.at(-1)!)}`
}

const directions = ['north', 'south', 'east', 'west']

// A command typed at a prompt, read by the shape of its words.
export function command(line: string): string {
  const words = line.split(/\s+/).filter(Boolean)
  const [verb, ...rest] = words
  if (verb === undefined) return 'nothing to do'
  if (verb === 'go' && rest.length === 1) {
    return directions.includes(rest[0]!) ? `you walk ${rest[0]}` : `you can't go ${rest[0]}`
  }
  if (verb === 'take' && rest.length > 0) return `you take ${rest.join(' ')}`
  return `you don't know how to ${verb}`
}

// How big a number is, in words.
export function size(n: number): string {
  if (n === 0) return 'none'
  if (n >= 1 && n <= 9) return `one digit, ${n}`
  if (n >= 10 && n <= 99) return 'two digits'
  return 'lots'
}

// The port of `host:port`, if it has one.
export function port(address: string): number | undefined {
  const at = address.lastIndexOf(':')
  if (at < 0) return undefined
  const digits = address.slice(at + 1)
  if (!/^\d+$/.test(digits)) return undefined
  const n = Number(digits)
  return n <= 65535 ? n : undefined
}

// Whether a value is a list.
export const isList = (value: Value): value is Value[] => Array.isArray(value)
