import { describe, test, expect } from "vitest";
import camelCaseToSnakeCase from "../camelCaseToSnakeCase";

describe("camelCaseToSnakeCase", () => {
  test("Should return a valid snake case", () => {
    expect(camelCaseToSnakeCase("personalDetails")).toBe("personal_details");
  });
});
