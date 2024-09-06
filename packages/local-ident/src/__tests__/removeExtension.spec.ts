import { describe, expect, test } from "vitest";
import removeExtension from "../removeExtension";

describe("removeExtension", () => {
  test("with query", () => {
    expect(removeExtension("SignIn.vue?vue&type=style&index=0&lang.module.scss")).toBe("SignIn");
  });
  test("with multiple extensions", () => {
    expect(removeExtension("index.module.scss")).toBe("index");
  });
  test("handle none", () => {
    expect(removeExtension("")).toBe("");
    expect(removeExtension("index")).toBe("index");
  });
});
