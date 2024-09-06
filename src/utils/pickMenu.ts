import { RouteRecordRaw } from "vue-router";
import joinPath from "./joinPath";
import { Nav, Platform } from "@/@types";
import getPlatformConfig from "@/utils/getPlatformConfig";
import isPlatformAlpha from "@/utils/isPlatformAlpha";

/**
 * 从路由表中摘取出导航列表
 * @param routes 路由表
 * @param platform 平台, 用于区分 pc, h5等, 默认为`pc`
 * @param basePath 基础路径,默认为空字符串`""`
 */
export default function pickMenu(
  routes: Readonly<RouteRecordRaw[]>,
  platform: Platform = "pc",
  basePath: string = "",
): Nav[] {
  return routes.reduce((menu: Nav[], route): Nav[] => {
    const path = joinPath(route.path, basePath);
    const conf = route.meta?.nav;
    if (conf) {
      const { interceptor, ...rest } = conf;
      const icon = getPlatformConfig(rest.icon, platform);
      const nav: Nav = { ...rest, path, icon };
      const alpha = isPlatformAlpha(route.meta?.alpha, platform);
      if (alpha) {
        nav.alpha = alpha;
      }
      if (interceptor && "auth" in interceptor) {
        const auth = isPlatformAlpha(interceptor.auth, platform);
        nav.interceptor = { auth };
      }
      menu.push(nav);
    }
    if (Array.isArray(route.children)) {
      const sub = pickMenu(route.children, platform, path);
      menu.push(...sub);
    }
    return menu;
  }, []);
}
