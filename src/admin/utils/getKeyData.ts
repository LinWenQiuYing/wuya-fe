const getKeyData = <T extends Tree<Record<string, any>>, V>(
  data: T[],
  key: keyof Omit<T, "children">,
  val: V,
): T | undefined => {
  for (const d of data) {
    if (d[key] === val) {
      return d;
    }
    if (d.children) {
      const children = <T[]>(d.children || []);
      const result = getKeyData(children, key, val);
      if (result) {
        return result;
      }
    }
  }
  return undefined;
};

export type Tree<T extends Record<string, unknown>> = T & {
  children?: T[];
};

export default getKeyData;
