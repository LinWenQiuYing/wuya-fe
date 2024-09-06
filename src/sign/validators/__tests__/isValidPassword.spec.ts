import { describe, expect, test } from "vitest";
import isValidPassword from "../isValidPassword";

describe("isValidPassword", () => {
  test("normally", () => {
    expect(isValidPassword("Yyyy8888")).toBe(true);
    expect(isValidPassword("YYYY8888")).toBe(true);
    expect(isValidPassword("yyyy8888")).toBe(true);
    expect(isValidPassword("12345678")).toBe("密码至少8位，需要包含字母和数字");
    expect(isValidPassword("infinity")).toBe("密码至少8位，需要包含字母和数字");
  });
});
