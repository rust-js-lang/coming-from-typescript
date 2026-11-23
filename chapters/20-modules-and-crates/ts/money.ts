// An amount of money, kept in cents. A file is a module: what it doesn't
// `export` is private to it.

export class Money {
  private constructor(private readonly amount: number) {}

  static fromCents(cents: number): Money {
    return new Money(cents)
  }

  // The amount as people write it: `$12.50`.
  format(): string {
    return `$${Math.floor(this.amount / 100)}.${String(this.amount % 100).padStart(2, '0')}`
  }

  // Wanted by shop.ts alone, but TypeScript has no "this package only":
  // exported to one module is exported to all.
  cents(): number {
    return this.amount
  }
}
