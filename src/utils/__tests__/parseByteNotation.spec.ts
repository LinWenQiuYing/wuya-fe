import { describe, expect, test } from "vitest";
import parseByteNotation from "../parseByteNotation";

describe("parseByteNotation", () => {
  test("normally", () => {
    expect(parseByteNotation("512b")).toBe(512);
    expect(parseByteNotation("512Kb")).toBe(512 * 1024);
    expect(parseByteNotation("100M")).toBe(100 * 1024 * 1024);
    expect(parseByteNotation("50.5Mb")).toBe(50.5 * 1024 * 1024);
    expect(parseByteNotation("50.5Mb")).toBe(50.5 * 1024 * 1024);
    expect(parseByteNotation("50.5MB")).toBe(50.5 * 1024 * 1024);
    expect(parseByteNotation("0.5G")).toBe(0.5 * 1024 * 1024 * 1024);
  });
});
