export function nanoid(size: number) {
  let id = '';
  while (size--) id += Math.random().toString(36).substr(2, 1);
  return id;
}
