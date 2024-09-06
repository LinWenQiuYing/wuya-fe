import { describe, expect, test } from "vitest";
import { getPaginationStr } from "../getPaginationStr";

describe("getPaginationStr", () => {
  test("enter number return page number", () => {
    expect(getPaginationStr(1, 12, 25)).toBe("第1-12项 / 共 12项");
  });
});
