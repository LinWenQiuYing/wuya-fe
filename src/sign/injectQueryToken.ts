import { useRoute, useRouter } from "vue-router";
import useAuthorization from "@/store/hooks/useAuthorization";
import omitRestQueryValue from "@/utils/omitRestQueryValue";

/**
 * 从url中注入权限: 如果url的查询字符串中带有token, 则将它剪下并保存
 *
 * token 需要使用 [btoa](https://developer.mozilla.org/zh-CN/docs/Web/API/btoa) 方法编码
 *
 * > btoa() 方法可以将一个二进制字符串（例如，将字符串中的每一个字节都视为一个二进制数据字节）编码为 Base64 编码的 ASCII 字符串。
 * >
 * > 你可以使用这个方法来对可能遇到通信问题的数据进行编码，然后使用 atob() 方法来对数据进行解码。
 * > 例如，你可以对 ASCII 中的控制字符（值为 0 到 31 的字符）进行编码。
 */
export default async function injectQueryToken() {
  const router = useRouter();
  const route = useRoute();
  const authorization = useAuthorization();
  const { token, ...query } = route.query;
  const encodedToken = omitRestQueryValue(token);
  if (encodedToken) {
    await router.replace({ query });
    const rawToken = window.atob(encodedToken).replace(new RegExp("=*$"), "");
    authorization.value = rawToken;
    return true;
  }
  return false;
}
