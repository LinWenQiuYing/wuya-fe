import { describe, expect, test } from "vitest";
import uncapitalize from "../uncapitalize";

describe("uncapitalize", () => {
  test("work in all lowercase", () => {
    expect(uncapitalize("abc")).toBe("abc");
  });

  test("work in all uppercase", () => {
    expect(uncapitalize("ABC")).toBe("aBC");
  });

  test("work in uppercase", () => {
    expect(uncapitalize("Hello")).toBe("hello");
  });
});
