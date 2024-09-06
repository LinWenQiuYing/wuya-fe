import { describe, expect, test, vi, beforeAll, afterAll } from "vitest";
import getSEMInfo from "../getSEMInfo";

describe("getSEMInfo", () => {
  const origin: string = "https://localhost";

  beforeAll(() => {
    vi.stubGlobal("location", {
      origin,
    });
  });

  afterAll(() => {
    vi.unstubAllGlobals();
  });

  test("work in full params", () => {
    const redirect: string = "/qa?source=test%26keywords=ai,transwarp";
    const info = getSEMInfo(redirect);
    expect(info).toStrictEqual({
      source: "test",
      url: origin + decodeURIComponent(redirect),
    });
  });

  test("optional source", () => {
    const redirect: string = "/";
    const info = getSEMInfo(redirect);
    expect(info).toStrictEqual({
      url: origin + decodeURIComponent(redirect),
    });
  });

  test("omit empty source value", () => {
    const redirect: string = "/?source=";
    const info = getSEMInfo(redirect);
    expect(info).toStrictEqual({
      url: origin + decodeURIComponent(redirect),
    });
  });
});
