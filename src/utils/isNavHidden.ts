import { NavHiddenCondition, NetworkStatus, Platform } from "@/@types";
import resolveCondition from "#condition";
import isObject from "@/utils/isObject";
import useOffline from "@/hooks/useOffline";

/**
 * 根据导航项的隐藏条件判断它是否是隐藏的
 * @param hiddenCondition 导航项的隐藏条件
 * @param targetPlatform 目标平台
 *
 * @return 要隐藏返回`true`, 否则返回`false`
 */
export default function isNavHidden(
  hiddenCondition: NavHiddenCondition | null | undefined,
  targetPlatform: Platform,
): boolean {
  const offline = useOffline();
  // 如果未定义隐藏条件, 不隐藏
  if (hiddenCondition === undefined || hiddenCondition === null) return false;
  if (typeof hiddenCondition === "boolean") {
    // 直接使用布尔值是临时隐藏
    return hiddenCondition;
  }

  return resolveCondition(hiddenCondition, (condition): boolean => {
    if (isObject(condition)) {
      if ("offline" in condition) {
        const networkStatus: NetworkStatus = condition;
        // networkStatus.offline 的值为真: offline时隐藏
        // offline.value 的值为真: BOM环境中, 网络是离线状态
        // 两者均为真时, 要隐藏
        return networkStatus.offline && offline.value;
      }
      throw new Error(`unsupported nav hidden condition: ${JSON.stringify(condition)}`);
    }
    const platform: Platform = condition;
    return platform === targetPlatform;
  });
}
