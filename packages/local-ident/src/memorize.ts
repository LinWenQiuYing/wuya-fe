/**
 * 对一个无副作用的函数进行结果缓存
 * @param fn 要进行结果缓存的函数
 */
export default function memorize<T = unknown>(fn: (key: string) => T): (key: string) => T {
  const cache = new Map<string, T>();
  return function (key: string): T {
    if (cache.has(key)) return cache.get(key)!;
    const value = fn(key);
    cache.set(key, value);
    return value;
  };
}
