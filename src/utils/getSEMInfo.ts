import { LocationQueryValue } from "vue-router";
import omitRestQueryValue from "@/utils/omitRestQueryValue";
import URL from "@/utils/URL";

export type SEM = {
  // 注册用户访问来源(某个推广渠道的code)
  source?: string;
  // 从推广渠道进入无涯时的落地页(落地页会重定向到登录页)
  url?: string;
  // 邀请人code
  inviteCode?: string;
};

/**
 * 从URL的查询字符串中的redirect的value中获取SEM(Search Engine Marketing, 搜索引擎营销)信息
 * @param redirect URL的查询字符串中的redirect的value值
 */
export default function getSEMInfo(redirect: LocationQueryValue | LocationQueryValue[]): SEM {
  const fixedRedirect = omitRestQueryValue(redirect);
  if (!fixedRedirect || !fixedRedirect.length) {
    return {};
  }
  const url = location.origin + decodeURIComponent(fixedRedirect);
  const source = new URL(url).search.get("source");
  const inviteCode = new URL(url).search.get("invite_code");
  if (source && source.length) {
    return { url, source, inviteCode };
  } else {
    return { url, inviteCode };
  }
}
