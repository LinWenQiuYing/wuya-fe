import { describe, test, expect } from "vitest";
import formatInputText from "../formatInputText";

describe("formatInputText", () => {
  test("A string of characters with spaces at both ends removed should be returned", () => {
    expect(formatInputText(" 123 ")).toBe("123");
  });
  test("A string of characters with line breaks removed from both ends should be returned", () => {
    expect(formatInputText("\n" + "123" + "\n")).toBe("123");
  });
});
