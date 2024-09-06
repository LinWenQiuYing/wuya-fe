import router from "@/router";
import useAuthorization from "@/store/hooks/useAuthorization";
import useUserInfo from "@/store/hooks/useUserInfo";
import useClearChat from "@/store/hooks/useClearChat";
import usePdfPreview from "@/store/hooks/usePdfPreview";
import useAvatar from "@/store/hooks/useAvatar";
import { signOut } from "@/sign/api/sign";
import useHistoryChat from "@/store/hooks/useHistoryChat";
import getPreferSignEntry from "@/sign/getPreferSignEntry";
import { isMiniProgram, wxSignUtils } from "@/utils/wxUtils";

// 登录后的默认重定向地址
export const defaultRedirect: string = "/";

export type ReAuthOptions = {
  // 是否调用远程的退出接口
  readonly remote?: boolean;
  readonly logout?: boolean;
};

// 是否正在重新登录中
let active = false;

/**
 * 清除缓存并去登录
 *
 * 注: 当前函数中会引用的后端接口, 都应忽略响应状态 401 (即不得又因401重新调用当前函数)
 */
export default async function reAuth(options?: Event | ReAuthOptions) {
  if (active) return;
  active = true;
  // 这些hook应调整为 onUnmounted 钩子里清除, 且范围越精确越好
  const authorization = useAuthorization();
  const userInfo = useUserInfo();
  const avatar = useAvatar(true);
  const { clearChat } = useClearChat();
  const { pdfUrl } = usePdfPreview();
  const { root } = useHistoryChat();
  if (options && "remote" in options && options.remote) {
    await signOut().catch(console.error);
  }
  authorization.value = null;
  userInfo.value = null;
  avatar.value = null;
  clearChat();
  pdfUrl.value = null;
  root.value = null;
  const route = router.currentRoute.value;
  const redirect = route.fullPath;
  const query = redirect === defaultRedirect ? undefined : { redirect: encodeURIComponent(redirect) };
  if (isMiniProgram.value) {
    if (options && "logout" in options && options.logout) {
      wxSignUtils.logout();
    } else {
      wxSignUtils.navigateToSign(redirect);
    }
  } else if (!route.path.startsWith("/sign")) {
    const preferSignEntry = await getPreferSignEntry();
    await router.push({ path: preferSignEntry, query });
  }
  active = false;
}
