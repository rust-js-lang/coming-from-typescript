// Chapter 6: objects and interfaces, as `rust/src/lib.rs` has structs.

export interface Point {
  x: number
  y: number
}

export interface Rect {
  corner: Point
  width: number
  height: number
}

export function newRect(x: number, y: number, width: number, height: number): Rect {
  return { corner: { x, y }, width, height }
}

export function area(rect: Rect): number {
  return rect.width * rect.height
}

export function contains(rect: Rect, point: Point): boolean {
  const { x, y } = point
  return x >= rect.corner.x && x <= rect.corner.x + rect.width && y >= rect.corner.y && y <= rect.corner.y + rect.height
}

export function moved(rect: Rect, dx: number, dy: number): Rect {
  return { ...rect, corner: { x: rect.corner.x + dx, y: rect.corner.y + dy } }
}

export function grow(rect: Rect, by: number): void {
  rect.width += by
  rect.height += by
}

// `===` compares which object it is, not what's in it.
export function same(a: Rect, b: Rect): boolean {
  return a === b
}
