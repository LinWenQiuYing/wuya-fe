import axios, { AxiosResponse } from "axios";
import { baseURL } from "@/config";
import appendAuthHeaderInConfig from "../appendAuthHeaderInConfig";
import reAuth from "@/sign/reAuth";
import getRequestStatus from "@/utils/getRequestStatus";
import { CaptchaInitData, SlideCaptchaTrackData } from "#captcha";
import { ModelCode } from "@/client/api/chat";
import { userPrefix } from "@/utils/reqPrefix";
import { Language } from "@/client/types";
import type { SEM } from "@/utils/getSEMInfo";

type AxiosError<T extends ResponseBody<unknown> = ResponseBody<unknown>> = {
  response: AxiosResponse<ResponseBody<T>>;
};

export const fetcher = axios.create({ baseURL });
fetcher.interceptors.request.use(appendAuthHeaderInConfig);
fetcher.interceptors.response.use(null, async (err: AxiosError) => {
  if (err.response.status === 401 || err.response.status === 403) {
    await reAuth({ remote: true });
  }
  return Promise.reject(pickResponseErrorMessage(err));
});

const pickResponseErrorMessage = (err: AxiosError) => {
  return err.response.data.message
    ? err.response.data
    : getRequestStatus(err.response.request) || err.response;
};

type SplitByDotString = string;

export type ReferencesLimit = 10 | 20 | 30 | 50;

// 1正常用户 2用户已被禁用 3用户未设置密码 4游客
export type UserStatus = 1 | 2 | 3 | 4;

export type UserInfo = {
  id: number;
  email: string;
  phone: string;
  nickname: string;
  organId: number;
  username: string;
  telephone: string;
  defaultKnowledgeSource: SplitByDotString;
  agentType: string;
  defaultModel: ModelCode;
  defaultLanguage: Language;
  defaultPrompt: string;
  personalDetails: string;
  useHistoryData: boolean;
  // 默认的最大引用数量由前端设置, 也就是新建用户时后端默认为null
  maxSource: ReferencesLimit | null;
  isAdmin: boolean;
  status: UserStatus;
};

/// 鉴权信息, 从响应头中获取
export type AuthInfo = {
  authorization: string;
};

// 后端接口中给的UserInfo对象中并不包含isAdmin
export type RemoteUserInfo = Omit<UserInfo, "isAdmin"> & {
  // 头像字段另作保存
  avatar: string;
  // 密码作为风险字段不作保存
  password: string;
};

// 后端给的用户配置 (仅关注需要的部分)
export type UserProfile = {
  user: RemoteUserInfo;
  isAdmin: boolean;
};

export type ResponseBody<T> = {
  code: number;
  message: string;
  data: T;
};

// 裁剪后端给的 UserProfile, 得到前端想要的数据结构 UserInfo
export const clipUserProfile = (body: { data: UserProfile }): UserInfo => {
  const { user, isAdmin } = body.data;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { avatar, password, ...rest } = user;
  return { ...rest, isAdmin };
};

/**
 * 从response开始裁剪
 * 1. 裁剪后端给的 UserProfile, 得到 UserInfo
 * 2. 裁剪header得到 authorization
 *
 * 注: 登录相关(也仅登录相关)的用户信息, 更改时也会更改authorization
 *
 * 它们是
 * - 用户名
 * - 密码
 * - 手机号
 * - 邮箱
 * @param response
 */
export const clipUserProfileResponse = (
  response: AxiosResponse<ResponseBody<UserProfile>>,
): UserInfo & AuthInfo => {
  const authorization = <string>response.headers.authorization;
  const userInfo = clipUserProfile(response.data);
  return { ...userInfo, authorization };
};

// 获取用户信息
export const fetchUserInfo = async (): Promise<UserInfo | null> => {
  const validateStatus = (status: number) => status === 401 || status <= 299;
  // 这个请求不受普通401过滤器的拦截
  const response = await fetcher.get<ResponseBody<UserProfile | null>>(`${userPrefix}/auth/user-info`, {
    validateStatus,
  });
  const body = response.data;
  const data = body.data;
  return data ? clipUserProfile({ data }) : null;
};

// 获取匿名用户权限
export const getAnonymousAccess = async () => {
  const response = await fetcher.get<ResponseBody<UserProfile>>(`${userPrefix}/auth/any/token/visitor`);
  return clipUserProfileResponse(response);
};

// 获取行为验证码
export const getCaptcha = async () => {
  const response = await fetcher.get<ResponseBody<CaptchaInitData>>(
    `${userPrefix}/auth/any/behavior-captcha`,
  );
  const body: ResponseBody<CaptchaInitData> = response.data;
  return body.data;
};

type SignInPayload = {
  key: string;
  code: SlideCaptchaTrackData;
  name: string;
  password: string;
};

// 进行行为验证并登录
export const validateCertification = async (payload: SignInPayload): Promise<UserInfo & AuthInfo> => {
  const response = await fetcher.post<ResponseBody<UserProfile>>(`${userPrefix}/auth/any/login`, payload);
  return clipUserProfileResponse(response);
};

export type PhoneSignPayload = {
  phone: string;
  phoneCode: string;
} & SEM;

// 通过验证码签入Infinity(未注册用户会自动注册)
export const signByPhone = async (payload: PhoneSignPayload) => {
  const response = await fetcher.post<ResponseBody<UserProfile>>(
    `${userPrefix}/auth/any/login-phone`,
    payload,
  );
  return clipUserProfileResponse(response);
};

export enum AuthType {
  Phone = 1,
  Email = 2,
}

// 发送手机验证码
export const sendPhoneCaptcha = async (
  phone: string,
  captchaId: string,
  captchaData: SlideCaptchaTrackData,
  exist?: boolean,
): Promise<ResponseBody<true>> => {
  const response = await fetcher.post<ResponseBody<true>>(
    `${userPrefix}/auth/any/send-captcha?type=${AuthType.Phone}&auth=${phone}&key=${captchaId}&exist=${exist}`,
    captchaData,
  );
  return response.data;
};

// 发送邮箱验证码
export const sendEmailCaptcha = async (
  email: string,
  captchaId: string,
  captchaData: SlideCaptchaTrackData,
  exist?: boolean,
): Promise<ResponseBody<true>> => {
  const response = await fetcher.post<ResponseBody<true>>(
    `${userPrefix}/auth/any/send-captcha?type=${AuthType.Email}&auth=${email}&key=${captchaId}&exist=${exist}`,
    captchaData,
  );
  return response.data;
};

export type SignUpPayload = {
  username: string;
  password: string;
  phone: string;
  phoneCode: string;
} & SEM;

// 注册新用户
export const createUser = async (payload: SignUpPayload): Promise<UserInfo & AuthInfo> => {
  const response = await fetcher.post<ResponseBody<UserProfile>>(`${userPrefix}/auth/any/register`, payload);
  return clipUserProfileResponse(response);
};

type ResetPasswordPayload = {
  auth: string;
  code: string;
  newPassword: string;
  type: AuthType;
};

// 重置密码
export const resetPassword = async (payload: ResetPasswordPayload): Promise<UserInfo & AuthInfo> => {
  const response = await fetcher.post<ResponseBody<UserProfile>>(
    `${userPrefix}/auth/any/reset-password`,
    payload,
  );
  return clipUserProfileResponse(response);
};

export const signOut = async (): Promise<true> => {
  const validateStatus = (status: number) => status === 401 || status <= 299;
  const response = await fetcher.get<ResponseBody<true>>(`${userPrefix}/auth/logout`, { validateStatus });
  return response.data.data;
};

// 获取填写意见反馈的URL
export const getFeedbackURL = async (): Promise<string> => {
  const response = await fetcher.get<ResponseBody<string>>(`${userPrefix}/auth/community-url`);
  return response.data.data;
};

export const renewToken = async (): Promise<boolean> => {
  const response = await fetcher.get<ResponseBody<true>>(`${userPrefix}/auth/token/renewal`);
  return response.data.data;
};
