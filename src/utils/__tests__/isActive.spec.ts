import { describe, expect, test } from "vitest";
import isActive from "../isActive";

describe("isActive", () => {
  test("match by path prefix", () => {
    expect(isActive({ path: "/topic", icon: "x", name: "x" }, "/topic/123")).toBeTruthy();
    expect(isActive({ path: "/topic", icon: "x", name: "x" }, "/topics")).toBeFalsy();
    expect(isActive({ path: "/", icon: "x", name: "x" }, "/topic/123")).toBeFalsy();
    expect(isActive({ path: "/topic", icon: "x", name: "x" }, "/topics")).toBeFalsy();
    expect(isActive({ path: "/topics", icon: "x", name: "x" }, "/topic")).toBeFalsy();
  });

  test("match by rewrite active pattern", () => {
    const condition = { any: ["/topic/*", "/topics"] };
    expect(isActive({ path: "/topics", icon: "x", name: "x", active: condition }, "/topic/123")).toBeTruthy();
    expect(isActive({ path: "/topics", icon: "x", name: "x", active: condition }, "/topics")).toBeTruthy();
    expect(isActive({ path: "/topics", icon: "x", name: "x", active: condition }, "/")).toBeFalsy();
    expect(isActive({ path: "/topics", icon: "x", name: "x", active: condition }, "/model")).toBeFalsy();
    expect(isActive({ path: "/topic", icon: "x", name: "x", active: "/topic/*" }, "/topic/123")).toBeTruthy();
    expect(isActive({ path: "/topic", icon: "x", name: "x" }, "/topic/123")).toBeTruthy();
    expect(isActive({ path: "/topic", icon: "x", name: "x" }, "/topics")).toBeFalsy();
  });
});
