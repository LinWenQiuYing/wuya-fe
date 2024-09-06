import { describe, test, expect } from "vitest";
import URL, { Search, isURL } from "../URL";
import { stringify } from "json5";

describe("class Search", () => {
  test('new Search("") is empty', () => {
    const search = new Search("");
    expect(search.toString()).toEqual("");
    expect(search.valueOf()).toEqual({});
  });

  {
    const query: string = "?a=b&c=&e=true&h=1&g=%20";
    const obj: Record<string, string> = { a: "b", c: "", e: "true", h: "1", g: "%20" };
    test(`new Search("${query}").valueOf() eq ${stringify(obj)}`, () => {
      expect(Search.parse(query)).toEqual(obj);
      expect(Search.stringify(obj)).toEqual(query);

      const search = new Search(query);
      expect(search.valueOf()).toEqual(obj);
      expect(search.toString()).toEqual(query);
      expect(search.has("a")).toBeTruthy();
      expect(search.has("b")).toBeFalsy();
      expect(search.get("e")).toEqual("true");
      expect(search.get("c")).toEqual("");
    });
  }

  test("Search.set(key, value) update search", () => {
    const search = new Search("?a=b");
    search.set("a", "c");
    search.set("b", "1");
    expect(search.valueOf()).toEqual({ a: "c", b: "1" });
  });

  test("Search.del(key) delete key", () => {
    const search = new Search("?a=b");
    search.del("a");
    expect(search.valueOf()).toEqual({});
    search.del("non-exist key");
    expect(search.valueOf()).toEqual({});
  });
});

describe("util isURL", () => {
  {
    const cases: string[] = [
      "http://localhost:8066/gateway/serving/api/v1?parentId=&isNesting=true#preview",
      "http://localhost:8066/gateway/serving/api/v1?parentId=&isNesting=true",
      "http://localhost:8066/gateway/serving/api/v1?parentId=&isNesting=true#preview",
      "http://localhost:8066/gateway/serving/api/v1?parentId=&isNesting=true",
      "localhost:8066/gateway/serving/api/v1#preview",
      "localhost:8066/gateway/serving/api/v1",
      "localhost:8066",
      "www.transwarp.io",
      "/gateway/serving/api/v1",
      "/gateway/serving/api/v1#preview",
      "/gateway/serving/api/v1?parentId=&isNesting=true#preview",
      "/gateway/serving/api/v1?parentId=&isNesting=true",
      "?parentId=&isNesting=true#preview",
      "?parentId=&isNesting=true",
      "#preview",
    ];
    cases.forEach((it) => {
      test(`${it} is url`, () => {
        expect(URL.isURL(it)).toBeTruthy();
        expect(isURL(it)).toBeTruthy();
      });

      test(`parse "${it}" and stringify eq itself`, () => {
        expect(new URL(it).toString()).toBe(it);
      });
    });
  }
});

describe("class URL", () => {
  test('"/gateway" is url', () => {
    const url = new URL("/gateway");
    expect(url.toString()).toBe("/gateway");
    expect(url.protocol).toBe("");
    expect(url.hostname).toBe("");
    expect(url.port).toBe("");
    expect(url.host).toBe("");
    expect(url.pathname).toBe("/gateway");
    expect(url.search.toString()).toBe("");
    expect(url.hash).toBe("");
  });

  test('"172.26.0.128/gateway" is url', () => {
    const url = new URL("172.26.0.128/gateway");
    expect(url.toString()).toBe("172.26.0.128/gateway");
    expect(url.protocol).toBe("");
    expect(url.hostname).toBe("172.26.0.128");
    expect(url.port).toBe("");
    expect(url.host).toBe("172.26.0.128");
    expect(url.pathname).toBe("/gateway");
    expect(url.search.toString()).toBe("");
    expect(url.hash).toBe("");
  });

  test('"172.26.0.128:8066/gateway" is url', () => {
    const url = new URL("172.26.0.128:8066/gateway");
    expect(url.toString()).toBe("172.26.0.128:8066/gateway");
    expect(url.protocol).toBe("");
    expect(url.hostname).toBe("172.26.0.128");
    expect(url.port).toBe("8066");
    expect(url.host).toBe("172.26.0.128:8066");
    expect(url.pathname).toBe("/gateway");
    expect(url.search.toString()).toBe("");
    expect(url.hash).toBe("");
  });

  test("invalid url throw error", () => {
    expect(() => new URL("hello world")).toThrow('invalid url: "hello world"');
  });

  test("get & set host", () => {
    const url = new URL("tw-node128:8066");
    expect(url.host).toBe("tw-node128:8066");
    url.host = "172.26.0.129:8067";
    expect(url.hostname).toBe("172.26.0.129");
    expect(url.port).toBe("8067");
  });

  test("get origin", () => {
    const url = new URL("tw-node128:8066");
    expect(url.origin).toBe("tw-node128:8066");
    url.host = "172.26.0.129:8067";
    expect(url.origin).toBe("172.26.0.129:8067");
  });
});
