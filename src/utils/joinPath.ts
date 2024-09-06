/**
 * 获取一个路由项的完整path
 * @param path 当前路由的path
 * @param base 父路由的path
 * @return fullPath 当前路由的全路径
 */
export default function joinPath(path: string, base: string = "") {
  if (path === "") return base;
  if (path.startsWith("/")) return path;
  if (base === "/") return `/${path}`;
  return `${base}/${path}`;
}
