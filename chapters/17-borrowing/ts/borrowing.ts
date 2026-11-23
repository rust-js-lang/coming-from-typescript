// Chapter 17: what TypeScript does where `rust/src/lib.rs` borrows. Any
// name for an array may read or change it, any time, even mid-loop.

// How many letters in all.
export const letters = (words: readonly string[]) => words.reduce((n, word) => n + [...word].length, 0)

// Makes each word start with a capital, in place.
export function capitalizeAll(words: string[]): void {
  words.forEach((word, i) => {
    const [first, ...rest] = [...word]
    if (first !== undefined) words[i] = first.toUpperCase() + rest.join('')
  })
}

// Removes the words shorter than `min`, in place, the way that looks
// right: `splice` inside the loop. Each removal shifts the rest left, and
// the loop steps past the word that moved into the gap.
export function removeShortWithSplice(words: string[], min: number): void {
  words.forEach((word, i) => {
    if ([...word].length < min) words.splice(i, 1)
  })
}

// The same, the way that works: walk backwards, so a removal only shifts
// what's been seen.
export function removeShort(words: string[], min: number): void {
  for (let i = words.length - 1; i >= 0; i--) {
    if ([...words[i]!].length < min) words.splice(i, 1)
  }
}

// Adds to a score. A number is passed by value, so this can't change the
// caller's: it needs a box, `{ value }`.
export function addPoints(score: { value: number }, points: number): void {
  score.value += points
}

// A round of a game: each correct answer scores.
export function play(answers: readonly boolean[]): number {
  const score = { value: 0 }
  for (const right of answers) if (right) addPoints(score, 10)
  return score.value
}

// Swaps the halves' first items.
export function swapHalves(xs: number[]): void {
  const middle = Math.floor(xs.length / 2)
  if (middle > 0 && middle < xs.length) [xs[0], xs[middle]] = [xs[middle]!, xs[0]!]
}
