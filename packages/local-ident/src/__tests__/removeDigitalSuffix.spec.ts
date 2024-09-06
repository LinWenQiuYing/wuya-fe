import { describe, test, expect } from "vitest";
import removeDigitalSuffix from "../removeDigitalSuffix";

describe("removeDigitalSuffix", () => {
  test("ignore full digital", () => {
    expect(removeDigitalSuffix("404")).toBe("404");
  });

  test("else work normally", () => {
    expect(removeDigitalSuffix("input1")).toBe("input");
    expect(removeDigitalSuffix("yaml2Json")).toBe("yaml2Json");
    expect(removeDigitalSuffix("yaml2Json2")).toBe("yaml2Json");
  });
});
