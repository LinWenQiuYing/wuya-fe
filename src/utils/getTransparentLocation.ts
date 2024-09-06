import { RouteLocationNormalized } from "vue-router";

// 在query中自动透传的key
// pure: 是否启用纯净模式, 若pure=on则无侧边栏无页眉
// recommend: 是否启用推荐, 若recommend=off则问答无推荐项
const transparentQueryKeys = ["pure", "recommend", "invite_code", "tag", "source", "keywords"];

/**
 * 获取带上透传的query信息的location
 * @param to
 * @param from
 * @return 判断结果, 如果下一个需要跳转的路由没有变化, 则返回null, 否则则返回修饰(即添加需要透传的query信息)后的路由
 */
export default function getTransparentLocation(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
): RouteLocationNormalized | null {
  const keys = {
    to: Object.keys(to.query || {}),
    from: Object.keys(from.query || {}),
  };
  // 出现自动透传的条件:
  // 来源中有任何需要透传的key但是去处没有该key
  const occur = transparentQueryKeys.some((transparentKey) => {
    return keys.from.includes(transparentKey) && !keys.to.includes(transparentKey);
  });
  if (!occur) return null;
  const query = keys.from.reduce(
    (hub, key) => {
      if (transparentQueryKeys.includes(key)) {
        hub[key] = from.query[key];
      }
      return hub;
    },
    { ...to.query },
  );
  return { ...to, query };
}
