import { AuthInfo, UserInfo } from "@/sign/api/sign";
import useUserInfo from "@/store/hooks/useUserInfo";
import useAuthorization from "@/store/hooks/useAuthorization";

/**
 * 刷新本地用户配置
 *
 * 如下这些操作后需要刷新用户配置:
 * - 登录 (包含注册并登录, 找回密码并登录)
 * - 修改用户名
 * - 修改密码
 * - 修改手机号
 * - 修改邮箱
 * @param profile 用户配置, 包含 用户信息, AUTHORIZATION
 */
export default function updateUserProfile(profile: UserInfo & AuthInfo) {
  const authorizationRef = useAuthorization();
  const userInfoRef = useUserInfo();
  const { authorization, ...userInfo } = profile;
  authorizationRef.value = authorization;
  userInfoRef.value = userInfo;
}
