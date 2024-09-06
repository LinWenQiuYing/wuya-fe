import { describe, expect, test } from "vitest";
import joinPath from "../joinPath";

describe("joinPath", () => {
  test("normally", () => {
    expect(joinPath("qa", "/")).toBe("/qa");
  });

  test("join empty path return basePath", () => {
    expect(joinPath("", "/admin")).toBe("/admin");
  });

  test("normal append basePath as prefix", () => {
    expect(joinPath("kg", "/admin")).toBe("/admin/kg");
  });

  test("return itself without basePath", () => {
    expect(joinPath("/admin")).toBe("/admin");
    expect(joinPath("admin")).toBe("/admin");
  });

  test("absolute path not apply basePath", () => {
    expect(joinPath("/admin/kg", "/admin")).toBe("/admin/kg");
    expect(joinPath("/admin/kg", "/model")).toBe("/admin/kg");
  });
});
