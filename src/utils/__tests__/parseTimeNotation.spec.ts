import { describe, expect, test } from "vitest";
import parseTimeNotation from "../parseTimeNotation";

describe("parseTimeNotation", () => {
  test("normally", () => {
    expect(parseTimeNotation("64ms")).toBe(64);
    expect(parseTimeNotation("0.55s")).toBe(0.55 * 1000);
    expect(parseTimeNotation("5s")).toBe(5 * 1000);
    expect(parseTimeNotation("2m")).toBe(2 * 60 * 1000);
    expect(parseTimeNotation("1h")).toBe(60 * 60 * 1000);
    expect(parseTimeNotation("3d")).toBe(3 * 24 * 60 * 60 * 1000);
  });
});
