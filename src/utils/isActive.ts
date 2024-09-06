import { Nav } from "@/@types";
import resolveCondition from "#condition";
import getGlobPattern from "./getGlobPattern";
import withEndSlash from "./withEndSlash";
import { AgentItem } from "@/client/const";

/**
 * 判断一个从路由表中提取出来的导航项是否应该高亮
 * @param nav 从路由表中提取出来的导航项
 * @param path 路由(一般是当前路由)的路径部分
 */
export default function isActive(nav: Nav | AgentItem, path: string): boolean {
  const condition = nav.active;
  if (condition) {
    return resolveCondition(condition, (glob): boolean => getGlobPattern(glob).test(path));
  }
  return path === nav.path || path.startsWith(withEndSlash(nav.path));
}
