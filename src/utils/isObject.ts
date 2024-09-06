const isObject = function <T extends Record<string | number, unknown>>(
  value: unknown,
): value is T extends infer R ? R : never {
  return Object.prototype.toString.call(value) === "[object Object]";
};

export default isObject;
