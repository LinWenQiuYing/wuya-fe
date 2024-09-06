import { CrossPlatform, Platform, CrossCompatible } from "@/@types";
import { platforms } from "@/@types/const";
import isObject from "./isObject";

function getPlatformConfig<T extends CrossCompatible>(crossPlatform: CrossPlatform<T>, platform: Platform): T;

function getPlatformConfig<T extends CrossCompatible>(
  crossPlatform: CrossPlatform<T> | undefined,
  platform: Platform,
): T | undefined;

function getPlatformConfig<T extends CrossCompatible>(
  crossPlatform: CrossPlatform<T> | undefined,
  platform: Platform,
): T | undefined {
  if (isObject(crossPlatform)) {
    /**
     * 在这里, crossPlatform要么是:
     * 1. compatibleObjectConfig 兼容的对象配置, 同时满足了如下条件
     * - 是对象
     * - 对象中没有使用platform作为property
     * 2. expandedCrossPlatform 展开的跨平台配置, 即`{[p in Platform]?: T}`
     */
    const compatibleObjectConfigOrExpandedCrossPlatform = crossPlatform;
    if (platform in compatibleObjectConfigOrExpandedCrossPlatform) {
      return <T>compatibleObjectConfigOrExpandedCrossPlatform[platform];
    } else if ("pc" in compatibleObjectConfigOrExpandedCrossPlatform) {
      return compatibleObjectConfigOrExpandedCrossPlatform.pc;
    }
    if (platforms.every((key) => !(key in compatibleObjectConfigOrExpandedCrossPlatform))) {
      return <T>compatibleObjectConfigOrExpandedCrossPlatform;
    }
  }
  return <T>crossPlatform;
}

export default getPlatformConfig;
