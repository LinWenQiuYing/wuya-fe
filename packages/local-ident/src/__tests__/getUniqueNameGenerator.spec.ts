import { describe, test, expect } from "vitest";
import getUniqueNameGenerator from "../getUniqueNameGenerator";

describe("getUniqueHashGenerator", () => {
  test("generate seq hash", () => {
    const { getUniqueName } = getUniqueNameGenerator();
    expect(getUniqueName("button")).toBe("button");
    expect(getUniqueName("input")).toBe("input");
    expect(getUniqueName("button")).toBe("button1");
  });
  test("ignore digital suffix", () => {
    const { getUniqueName } = getUniqueNameGenerator();
    expect(getUniqueName("button1")).toBe("button");
    expect(getUniqueName("button")).toBe("button1");
  });
});
