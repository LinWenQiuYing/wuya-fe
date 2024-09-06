import { describe, expect, test, vi, afterAll } from "vitest";
import isNavHidden from "../isNavHidden";
import { platforms } from "@/@types/const";
import { AndCondition, OrCondition } from "#condition";
import { NetworkStatus, Platform } from "@/@types";

vi.mock("@/hooks/useOffline", () => import("@/hooks/__mocks__/useOffline.mock"));

describe("isNavHidden", () => {
  test("not hidden when is default value `undefined`", () => {
    platforms.forEach((platform) => {
      expect(isNavHidden(undefined, platform)).toBe(false);
      expect(isNavHidden(null, platform)).toBe(false);
    });
  });

  test("not hidden when value `true`", () => {
    platforms.forEach((platform) => {
      expect(isNavHidden(true, platform)).toBe(true);
    });
  });

  test("always hidden when value `false`", () => {
    platforms.forEach((platform) => {
      expect(isNavHidden(false, platform)).toBe(false);
    });
  });

  test("work in atom condition", () => {
    expect(isNavHidden("h5", "h5")).toBe(true);
    expect(isNavHidden("h5", "pc")).toBe(false);
    expect(isNavHidden("h5", "app")).toBe(false);
    expect(isNavHidden("h5", "electron")).toBe(false);
  });

  test("if network is offline, result of `{ offline: true }` is hidden", () => {
    vi.stubGlobal("navigator", { onLine: false });
    expect(isNavHidden({ offline: true }, "pc")).toBe(true);
    expect(isNavHidden({ offline: true }, "h5")).toBe(true);
    expect(isNavHidden({ offline: true }, "app")).toBe(true);
    expect(isNavHidden({ offline: true }, "electron")).toBe(true);
  });

  test("work in negative condition", () => {
    expect(isNavHidden({ not: "h5" }, "h5")).toBe(false);
    expect(isNavHidden({ not: "h5" }, "pc")).toBe(true);
    expect(isNavHidden({ not: "h5" }, "electron")).toBe(true);
    expect(isNavHidden({ not: "h5" }, "app")).toBe(true);
  });

  test("work in or condition", () => {
    const condition: OrCondition<Platform> = { any: ["h5", "electron"] };
    expect(isNavHidden(condition, "h5")).toBe(true);
    expect(isNavHidden(condition, "pc")).toBe(false);
    expect(isNavHidden(condition, "electron")).toBe(true);
    expect(isNavHidden(condition, "app")).toBe(false);
  });

  test("work in and condition & network status is offline", () => {
    vi.stubGlobal("navigator", { onLine: false });
    const condition: AndCondition<Platform | NetworkStatus> = { both: ["electron", { offline: true }] };
    expect(isNavHidden(condition, "h5")).toBe(false);
    expect(isNavHidden(condition, "pc")).toBe(false);
    expect(isNavHidden(condition, "electron")).toBe(true);
    expect(isNavHidden(condition, "app")).toBe(false);
  });

  test("work in and condition & network status is online", () => {
    vi.stubGlobal("navigator", { onLine: true });
    const condition: AndCondition<Platform | NetworkStatus> = { both: ["electron", { offline: true }] };
    expect(isNavHidden(condition, "h5")).toBe(false);
    expect(isNavHidden(condition, "pc")).toBe(false);
    expect(isNavHidden(condition, "electron")).toBe(false);
    expect(isNavHidden(condition, "app")).toBe(false);
  });

  afterAll(() => {
    vi.unstubAllGlobals();
  });
});
