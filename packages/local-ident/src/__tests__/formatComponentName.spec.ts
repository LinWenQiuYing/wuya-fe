import { describe, expect, test } from "vitest";
import formatComponentName from "../formatComponentName";

describe("formatComponentName", () => {
  test("get itself with name is upper case", () => {
    expect(formatComponentName("CSM")).toBe("CSM");
  });

  test("otherwise first letter lower case", () => {
    expect(formatComponentName("SignIn")).toBe("signIn");
  });
});
