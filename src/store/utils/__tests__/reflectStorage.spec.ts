import { describe, expect, test } from "vitest";
import reflectStorage from "../reflectStorage";

describe("reflectStorage", () => {
  class LocalStorage {
    #cache: Map<string, string> = new Map();
    getItem = (key: string) => {
      return this.#cache.get(key) || null;
    };
    setItem = (key: string, value: string) => this.#cache.set(key, value);

    removeItem = (key: string) => this.#cache.delete(key);

    get length() {
      return this.#cache.size;
    }

    clear = () => this.#cache.clear();

    key = (index: number) => [...this.#cache.entries()][index][1] ?? null;
  }

  test("reflect getter/setter", () => {
    const localStorage: Storage = new LocalStorage();
    type State = {
      obj: { name: string; value: string } | null;
      token: string | null;
    };
    const state: State = {
      obj: null,
      token: null,
    };
    reflectStorage(state, { storage: localStorage });
    expect(localStorage.getItem("obj")).toBe(null);
    expect(localStorage.getItem("token")).toBe(null);
    state.token = "test";
    state.obj = { name: "hello", value: "infinity" };
    expect(localStorage.getItem("token")).toBe(JSON.stringify("test"));
    expect(state.token).toBe("test");
    expect(localStorage.getItem("obj")).toBe(JSON.stringify({ name: "hello", value: "infinity" }));
    expect(state.obj).toStrictEqual({ name: "hello", value: "infinity" });
  });
});
