// Chapter 21: async, as TypeScript has it, beside `rust/src/lib.rs`.

const prices: Record<string, number> = { tea: 350, cake: 425, jam: 600 }

// An item's price, answered later, as a server would. It throws, and the
// promise rejects.
export async function price(item: string): Promise<number> {
  const cents = await Promise.resolve(prices[item])
  if (cents === undefined) throw new Error(`no price for ${item}`)
  return cents
}

// What a basket costs: each price awaited in turn.
export async function total(items: readonly string[]): Promise<number> {
  let sum = 0
  for (const item of items) sum += await price(item)
  return sum
}

// A receipt: an async function awaits another.
export async function receipt(items: readonly string[]): Promise<string> {
  try {
    return `${items.length} items, ${await total(items)} cents`
  } catch (error) {
    return `can't total: ${(error as Error).message}`
  }
}

// A step that writes to the log when it starts.
async function step(log: string[], name: string): Promise<void> {
  log.push(`${name} started`)
}

// Makes a promise and never awaits it: it ran anyway, as it was made.
export function madeNotAwaited(): string[] {
  const log: string[] = []
  void step(log, 'step')
  log.push('made')
  return log
}

// Makes a promise, then awaits it: it had already run.
export async function madeThenAwaited(): Promise<string[]> {
  const log: string[] = []
  const promise = step(log, 'step')
  log.push('made')
  await promise
  return log
}
