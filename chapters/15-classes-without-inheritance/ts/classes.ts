// Chapter 15: classes, as TypeScript has them, beside `rust/src/lib.rs`'s
// structs, enum and composition.

// A temperature that can't be below absolute zero: a private constructor,
// and static functions that check.
export class Temperature {
  static readonly ABSOLUTE_ZERO = -273.15
  private constructor(private readonly celsiusValue: number) {}

  static fromCelsius(celsius: number): Temperature {
    if (Number.isNaN(celsius) || celsius < Temperature.ABSOLUTE_ZERO) {
      throw new Error(`${celsius}°C is below absolute zero`)
    }
    return new Temperature(celsius)
  }

  static fromFahrenheit(fahrenheit: number): Temperature {
    return Temperature.fromCelsius(((fahrenheit - 32) * 5) / 9)
  }

  get celsius() {
    return this.celsiusValue
  }

  get fahrenheit() {
    return (this.celsiusValue * 9) / 5 + 32
  }
}

// Staff as a class hierarchy: each job a subclass that overrides.
export class Employee {
  constructor(
    readonly name: string,
    protected readonly salary: number,
  ) {}
  monthlyPay(): number {
    return Math.floor(this.salary / 12)
  }
  describe(): string {
    return `${this.name} is an engineer`
  }
}

export class Manager extends Employee {
  constructor(name: string, salary: number, readonly reports: number) {
    super(name, salary)
  }
  override monthlyPay() {
    return super.monthlyPay() + 100 * this.reports
  }
  override describe() {
    return `${this.name} is a manager of ${this.reports}`
  }
}

// A contractor has no salary, but an Employee must: it inherits one anyway.
export class Contractor extends Employee {
  constructor(name: string, salary: number, readonly hours: number, readonly rate: number) {
    super(name, salary)
  }
  override monthlyPay() {
    return this.hours * this.rate
  }
  override describe() {
    return `${this.name} is a contractor for ${this.hours} hours`
  }
}

// The whole staff's pay for a month.
export const payroll = (staff: Employee[]) => staff.reduce((total, e) => total + e.monthlyPay(), 0)
