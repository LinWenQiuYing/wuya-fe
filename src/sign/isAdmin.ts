import type { UserInfo } from "@/sign/api/sign";

/**
 * 通过用户信息判断当前用户是否是管理员用户
 * @param userInfo 用户信息
 */
export default function isAdmin(userInfo?: UserInfo) {
  return userInfo?.isAdmin;
}
