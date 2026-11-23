// Chapter 18: the same functions in TypeScript, where nothing says how
// long a value lives: the garbage collector keeps anything reachable.

// The first word of `text`.
export const firstWord = (text: string) => text.split(/\s+/).filter(Boolean)[0] ?? ''

// The longer of two strings.
export const longest = (a: string, b: string) => ([...a].length >= [...b].length ? a : b)

// The sentences of `text` that mention `word`.
export function mentions(text: string, word: string): string[] {
  const sentences = text.match(/[^.]*\.|[^.]+$/g) ?? []
  return sentences.map((s) => s.trim()).filter((s) => s.toLowerCase().includes(word.toLowerCase()))
}

// Every `key=value` pair in a config, lines without `=` skipped.
export function pairs(config: string): [string, string][] {
  return config.split('\n').flatMap((line) => {
    const at = line.indexOf('=')
    return at < 0 ? [] : [[line.slice(0, at).trim(), line.slice(at + 1).trim()] as [string, string]]
  })
}
