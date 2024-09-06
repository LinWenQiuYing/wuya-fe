interface ReflectStorageOptions<T extends string> {
  storage?: Storage;
  keys?: T[];
}

/**
 * 将一个对象持久化到Storage中, 更新是更新到Storage中, 读取也是从Storage中读取
 * @param state 需要持久化的对象
 * @param options 存储选项, 用于指定用那个Storage实现, 以及指定state对象中那些key需要持久化
 */
export default function reflectStorage<S extends Record<string, unknown>, K extends string & keyof S>(
  state: S,
  options: ReflectStorageOptions<K> = {},
) {
  const storage: Storage = options.storage ?? window.localStorage;
  if (!storage) {
    console.warn("No Storage Implement available.");
    return;
  }
  const persistentKeys = options.keys ?? Object.keys(state);
  persistentKeys.forEach((key) => {
    Reflect.defineProperty(state, key, {
      get() {
        const value = storage.getItem(key);
        return value ? <S[K]>JSON.parse(value) : null;
      },
      set(value: S[K]) {
        if (!value) {
          storage.removeItem(key);
        } else {
          storage.setItem(key, JSON.stringify(value));
        }
      },
    });
  });
}
