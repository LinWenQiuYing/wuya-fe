import getSignConfig from "./getSignConfig";
import { defaultSignEntry } from "@/sign/config/default";

// 偏好的登录入口(手机验证码登录 or 密码登录)
export default async function getPreferSignEntry() {
  const conf = await getSignConfig();
  return conf?.entry?.prefer ?? defaultSignEntry;
}
