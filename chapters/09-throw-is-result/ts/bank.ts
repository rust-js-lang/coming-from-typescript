// Chapter 9: errors thrown, as TypeScript usually has them, beside
// `rust/src/lib.rs`'s `Result`. Nothing in a signature says it may throw.

export interface Account {
  name: string
  cents: number
}

function position(accounts: Account[], name: string): number {
  const at = accounts.findIndex((account) => account.name === name)
  if (at < 0) throw new Error(`no account named ${name}`)
  return at
}

// Moves `cents` from one account to another, or throws.
export function transfer(accounts: Account[], from: string, to: string, cents: number): void {
  const fromAt = position(accounts, from)
  const toAt = position(accounts, to)
  if (fromAt === toAt) throw new Error('from and to are the same account')
  const has = accounts[fromAt]!.cents
  if (has < cents) throw new Error(`needs ${cents} cents, has ${has}`)
  accounts[fromAt]!.cents -= cents
  accounts[toAt]!.cents += cents
}

// An amount typed as `12.50`, in cents, or throws.
export function parseCents(text: string): number {
  const [dollars, cents = '00'] = text.trim().split('.')
  if (cents.length !== 2) throw new Error(`${JSON.stringify(text)} needs two digits of cents`)
  if (!/^\d+$/.test(dollars!) || !/^\d+$/.test(cents)) throw new Error(`${JSON.stringify(text)} isn't an amount`)
  return Number(dollars) * 100 + Number(cents)
}

// A payment typed into a form: the amount read, then the transfer made.
export function pay(accounts: Account[], from: string, to: string, amount: string): number {
  const cents = parseCents(amount)
  transfer(accounts, from, to, cents)
  return cents
}
