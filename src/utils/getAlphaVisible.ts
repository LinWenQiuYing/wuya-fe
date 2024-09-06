import whitelist from "@/config/alpha-envs-whitelist";

// alpha功能是否可见(根据环境来判断)
export default function getAlphaVisible() {
  return whitelist.some((env) => {
    return typeof env === "function" ? env() : location.host === env;
  });
}
