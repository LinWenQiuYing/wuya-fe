import { describe, expect, test } from "vitest";
import isTimeNotation from "../isTimeNotation";

describe("isTimeNotation", () => {
  test("normally", () => {
    expect(isTimeNotation("500ms")).toBe(true);
    expect(isTimeNotation("10s")).toBe(true);
    expect(isTimeNotation("1m")).toBe(true);
    expect(isTimeNotation("0.5h")).toBe(true);
    expect(isTimeNotation("0.5d")).toBe(true);
  });
});
