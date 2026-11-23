// What the `heck` crate gives the Rust, written by hand, as there's no
// dependency here: a name in kebab case, `Fancy Mug` as `fancy-mug`.
export const toKebabCase = (name: string) =>
  (name.match(/[A-Z]+(?![a-z])|[A-Z]?[a-z]+|\d+/g) ?? []).map((word) => word.toLowerCase()).join('-')
