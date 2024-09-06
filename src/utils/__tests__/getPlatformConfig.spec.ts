import { describe, expect, test } from "vitest";
import getPlatformConfig from "../getPlatformConfig";
import { CrossPlatform } from "@/@types";

describe("getPlatformConfig", () => {
  test("get shared string config", () => {
    const config = "cubed";
    expect(getPlatformConfig(config, "pc")).toBe(config);
    expect(getPlatformConfig(config, "h5")).toBe(config);
    expect(getPlatformConfig(config, "electron")).toBe(config);
    expect(getPlatformConfig(config, "app")).toBe(config);
  });

  test("get shared object config", () => {
    const config = {
      sidecar: {
        exclude: ["sources"],
      },
    };
    expect(getPlatformConfig(config, "pc")).toBe(config);
    expect(getPlatformConfig(config, "h5")).toBe(config);
    expect(getPlatformConfig(config, "electron")).toBe(config);
    expect(getPlatformConfig(config, "app")).toBe(config);
  });

  test("get platform specify config", () => {
    const crossPlatformConfig: CrossPlatform<string | Record<string, string>> = {
      pc: "cubed",
      h5: "none",
      electron: { type: "tiled" },
    };
    expect(getPlatformConfig(crossPlatformConfig, "pc")).toBe("cubed");
    expect(getPlatformConfig(crossPlatformConfig, "h5")).toBe("none");
    expect(getPlatformConfig(crossPlatformConfig, "electron")).toStrictEqual({ type: "tiled" });
    expect(getPlatformConfig(undefined, "pc")).toBe(undefined);
    expect(getPlatformConfig(undefined, "h5")).toBe(undefined);
  });

  test("get platform specify config backup with platform `pc`", () => {
    const crossPlatformConfig: CrossPlatform<string> = {
      pc: "cubed",
    };
    expect(getPlatformConfig(crossPlatformConfig, "h5")).toBe("cubed");
    expect(getPlatformConfig(crossPlatformConfig, "electron")).toBe("cubed");
    expect(getPlatformConfig(crossPlatformConfig, "app")).toBe("cubed");
  });
});
