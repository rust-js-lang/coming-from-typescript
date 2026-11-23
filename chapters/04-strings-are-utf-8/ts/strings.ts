// Chapter 4: strings, as a TypeScript developer would usually write these,
// beside `rust/src/lib.rs`. A JS string is UTF-16: `.length` and `[i]`
// count 16-bit units, and some characters take two.

// How long a text is: its `.length`, and its code points.
export function sizes(text: string): [number, number] {
  return [text.length, [...text].length]
}

// The first letter of each word, in capitals.
export function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter((word) => word !== '')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
}

// At most `max` characters of the text, and `…` where it was cut.
export function shorten(text: string, max: number): string {
  return text.length > max ? `${text.slice(0, max)}…` : text
}

// The text backwards.
export function reverse(text: string): string {
  return text.split('').reverse().join('')
}

// The first word.
export function firstWord(text: string): string {
  return text.split(' ')[0] ?? ''
}
