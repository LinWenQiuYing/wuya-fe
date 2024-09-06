import { Platform } from "@/@types";
import { isApp, isMobile, target } from "@/config";

/**
 * 获取代码运行的平台
 *
 * 它将在运行时通过访问BOM信息或者获取构建时(pnpm build)时注入的参数确定
 */
export default function getPlatform(): Platform {
  if (target.isElectron) return "electron";
  if (target.isWeb) {
    if (isApp) return "app";
    if (isMobile) return "h5";
    return "pc";
  }
  throw Error("unknown platform");
}
