import { AlphaCondition, Platform } from "@/@types";
import resolveCondition from "#condition";

/**
 * 在目标平台上是否是alpha阶段
 * @param alphaCondition alpha条件
 * @param targetPlatform 目标平台
 */
export default function isPlatformAlpha(
  alphaCondition: AlphaCondition | null | undefined,
  targetPlatform: Platform,
) {
  // 未声明alphaCondition则不是alpha阶段
  if (alphaCondition === null || alphaCondition === undefined) return false;
  // 声明为true, 全平台alpha阶段
  // 声明为false, 全平台不是alpha阶段
  if (typeof alphaCondition === "boolean") return alphaCondition;
  return resolveCondition(alphaCondition, (platform) => {
    // 目标平台和 alpha条件中描述的平台一致, 为alpha阶段
    return platform === targetPlatform;
  });
}
