import { SidecarConfig, SidecarMember } from "@/@types";

// 在当前路由(route)下, 根据配置 route.meta.sidecar, 获取sidecar中相应成员的可见性
export default function getSidecarVisible(
  member: SidecarMember,
  config?: boolean | SidecarConfig,
): boolean | "readonly" {
  if (!config) return false;
  if (config === true) return true;
  if ("exclude" in config) {
    return config.exclude.every((it) => it !== member);
  }
  if ("include" in config) {
    return config.include.some((it) => it === member);
  }
  if (member in config) {
    return config[member] ?? false;
  } else {
    return false;
  }
}
