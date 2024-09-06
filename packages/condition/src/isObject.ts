const isObject = function (value: unknown): value is Record<string | number | symbol, unknown> {
  return Object.prototype.toString.call(value) === "[object Object]";
};

export default isObject;
