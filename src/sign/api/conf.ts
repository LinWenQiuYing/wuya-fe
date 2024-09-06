import { fetcher } from "./sign";
import json5 from "json5";
import { target } from "@/config";
import { TimeNotation } from "@/utils/isTimeNotation";

export type SignEntryConfig = {
  prefer?: string;
};

export type RenewalConfig = {
  interval: TimeNotation;
};

export type SignConfig = {
  // 登录入口偏好: 验证码登录 | 密码登录
  entry?: SignEntryConfig;
  // 续租配置
  renewal?: RenewalConfig;
  // 访问登录页的时候, 是否自动登录
  auto?: boolean;
  // 是否允许访客模式
  guestMode?: boolean;
};

const importSignConfig = async () => {
  const { default: data } = await import("#public/conf/sign.json5?raw");
  return json5.parse<SignConfig>(data);
};

const fetchSignConfig = async () => {
  const result = await fetcher.get<string>("/conf/sign.json5");
  return json5.parse<SignConfig>(result.data);
};

// 获取登录配置(可通过配置文件手动修改)
export const getSignConf = async () => {
  return target.isElectron ? await importSignConfig() : await fetchSignConfig();
};
