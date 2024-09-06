import { describe, expect, test } from "vitest";
import isByteNotation from "../isByteNotation";

describe("isByteNotation", () => {
  test("normally", () => {
    // GB
    expect(isByteNotation("0.5g")).toBe(true);
    expect(isByteNotation("1g")).toBe(true);
    expect(isByteNotation("1G")).toBe(true);
    expect(isByteNotation("1gb")).toBe(true);
    expect(isByteNotation("1Gb")).toBe(true);
    expect(isByteNotation("1GB")).toBe(true);
    // KB
    expect(isByteNotation("1kb")).toBe(true);
    expect(isByteNotation("1KB")).toBe(true);
    expect(isByteNotation("1Kb")).toBe(true);
    expect(isByteNotation("1K")).toBe(true);
    expect(isByteNotation("1k")).toBe(true);
    // MB
    expect(isByteNotation("1mb")).toBe(true);
    expect(isByteNotation("1MB")).toBe(true);
    expect(isByteNotation("1Mb")).toBe(true);
    expect(isByteNotation("1M")).toBe(true);
    expect(isByteNotation("1m")).toBe(true);
    // byte
    expect(isByteNotation("800B")).toBe(true);
    expect(isByteNotation("800b")).toBe(true);
  });
});
