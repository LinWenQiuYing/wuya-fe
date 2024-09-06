import {
  UserInfo,
  AuthInfo,
  UserProfile,
  ResponseBody,
  fetcher,
  clipUserProfileResponse,
  clipUserProfile,
  ReferencesLimit,
} from "@/sign/api/sign";
import { userPrefix } from "@/utils/reqPrefix";

// 更新个人资料(仅传修改的部分)
export const updateProfileColumn = async (column: string, value: string | boolean): Promise<UserInfo> => {
  const response = await fetcher.get<ResponseBody<{ user: UserInfo }>>(
    `${userPrefix}/user/setting/update-by-column`,
    {
      params: { column, value },
    },
  );
  const body = response.data;
  return body.data.user;
};

// 更新用户名(会更新token)
export const updateUsername = async (username: string): Promise<UserInfo & AuthInfo> => {
  const response = await fetcher.get<ResponseBody<UserProfile>>(`${userPrefix}/user/setting/username`, {
    params: { username },
  });
  return clipUserProfileResponse(response);
};

type PhoneCaptchaCheckPayload = {
  phone: string;
  code: string;
};

// 对手机号进行校验
export const checkPhoneCaptcha = async (params: PhoneCaptchaCheckPayload): Promise<true> => {
  const response = await fetcher.get<ResponseBody<true>>(`${userPrefix}/auth/check-phone-captcha`, {
    params,
  });
  const body = response.data;
  return body.data;
};

type EmailCaptchaCheckPayload = {
  email: string;
  code: string;
};

// 对邮箱进行校验
export const checkEmailCaptcha = async (params: EmailCaptchaCheckPayload): Promise<true> => {
  const response = await fetcher.get<ResponseBody<true>>(`${userPrefix}/auth/check-email-captcha`, {
    params,
  });
  const body = response.data;
  return body.data;
};

// 获取当前用户的手机号
export const getUserPhone = async (): Promise<string | null> => {
  const response = await fetcher.get<ResponseBody<string | null>>(`${userPrefix}/user/phone`);
  const body = response.data;
  return body.data;
};

type PhoneUpdatePayload = {
  phone: string;
  code: string;
};

// 更新手机号
export const updatePhone = async (params: PhoneUpdatePayload): Promise<UserInfo & AuthInfo> => {
  const response = await fetcher.get<ResponseBody<UserProfile>>(`${userPrefix}/user/setting/phone`, {
    params,
  });
  return clipUserProfileResponse(response);
};

export const updatePassword = async (payload: {
  oldPassword: string;
  newPassword: string;
}): Promise<UserInfo & AuthInfo> => {
  const response = await fetcher.post<ResponseBody<UserProfile>>(
    `${userPrefix}/user/setting/password`,
    payload,
  );
  return clipUserProfileResponse(response);
};

type EmailUpdatePayload = {
  email: string;
  code: string;
};

// 更新邮箱
export const updateEmail = async (params: EmailUpdatePayload): Promise<UserInfo & AuthInfo> => {
  const response = await fetcher.get<ResponseBody<UserProfile>>(`${userPrefix}/user/setting/email`, {
    params,
  });
  return clipUserProfileResponse(response);
};

// 切换是否共享使用数据
export const toggleShareUsage = async (shared: boolean): Promise<boolean> => {
  const params = { value: shared };
  const response = await fetcher.get<ResponseBody<boolean>>(`${userPrefix}/user/setting/use-history-data`, {
    params,
  });
  const body = response.data;
  return body.data;
};

// 更新默认模型
export const updateDefaultModel = async (value: string): Promise<boolean> => {
  const params = { value };
  const response = await fetcher.get<ResponseBody<boolean>>(`${userPrefix}/user/setting/default-model`, {
    params,
  });
  const body = response.data;
  return body.data;
};

// 修改最大参考来源数量
export const updateReferencesLimit = async (value: ReferencesLimit): Promise<boolean> => {
  const params = { value };
  const response = await fetcher.get<ResponseBody<boolean>>(`${userPrefix}/user/setting/max-source`, {
    params,
  });
  const body = response.data;
  return body.data;
};

// 修改默认知识源
export const updateDefaultSources = async (value: string): Promise<boolean> => {
  const params = { value };
  const response = await fetcher.get<ResponseBody<boolean>>(
    `${userPrefix}/user/setting/default-knowledge-source`,
    { params },
  );
  const body = response.data;
  return body.data;
};

// 修改头像
export const updateAvatar = async (image: File): Promise<UserInfo> => {
  const formData = new FormData();
  formData.append("image", image);
  const response = await fetcher.post<ResponseBody<UserProfile>>(
    `${userPrefix}/user/setting/avatar`,
    formData,
  );
  const body = response.data;
  return clipUserProfile(body);
};

export const getAvatarBase64 = async (): Promise<string | null> => {
  const response = await fetcher.get<ResponseBody<string>>(`${userPrefix}/user/avatar`);
  return response.data.data;
};

type ContactUsPayload = {
  // 省份
  area: string;
  // 需求
  attr22: string;
  // 手机验证码
  code: string;
  // 公司
  company: string;
  // 邮箱
  email: string;
  // 是否已有采购需求
  hasPurchaseRequirement: string;
  // 贵司的身份
  identity: string;
  // 行业
  industry: string;
  // 手机号
  mobile: string;
  // 姓名
  name: string;
  // 终端用户公司名称
  terminalCompany: string;
  // 职务
  title: string;
  // 当前页面地址
  url: string;
};

type RegisterParams = {
  password: string;
} & Pick<ContactUsPayload, Exclude<keyof ContactUsPayload, "area" | "industry">>;

export const contactUs = async (payload: ContactUsPayload): Promise<boolean> => {
  const response = await fetcher.post<ResponseBody<boolean>>(`${userPrefix}/user/contact`, payload);
  return response.data.data;
};

export const registerUs = async (params: RegisterParams): Promise<boolean> => {
  const response = await fetcher.post<ResponseBody<boolean>>(`${userPrefix}/auth/any/register2`, params);
  return response.data.data;
};

export type Product = {
  // 是否上架商品
  active: boolean;
  // 实际发生金额
  actualAmount: number;
  // 创建时间 (yyyy-MM-dd HH:mm:ss)
  createTime: string;
  // 商品描述
  description: string;
  // 折扣率
  discount: number;
  // 限时开始时间 (yyyy-MM-dd HH:mm:ss)
  discountStart: string;
  // 限时结束时间 (yyyy-MM-dd HH:mm:ss)
  discountEnd: string;
  // 是否首充专享
  firstChargeOnly: boolean;
  // ID
  id: number;
  // 商品名称
  name: string;
  orderUuid: string;
  // 活动前金额
  originalAmount: number;
  // 是否永久商品
  permanent: boolean;
  // 商品类型
  prodType: number;
  // 月次会员有效月数
  timeMemMonths: number;
  // 次数会员次数有效天
  timesProdDays: number;
  // 次数商品有效月
  timesProdMonths: number;
  // 次数会员有效次数
  timesProdTimes: number;
  // 更新时间 (yyyy-MM-dd HH:mm:ss)
  updateTime: string;
};

// 获取用户可购买商品列表
export const getProducts = async (): Promise<Product[]> => {
  const response = await fetcher.post<ResponseBody<Product[]>>(
    `${userPrefix}/product/list-user-show-products`,
  );
  return response.data.data;
};

export const getMonthlyCard = async (): Promise<Product> => {
  const response = await fetcher.post<ResponseBody<Product>>(`${userPrefix}/product/get-latest-month-prod`);
  return response.data.data;
};

export type PayQRCodes = {
  // 支付宝支付二维码(base64格式)
  aliImageBytes: string;
  // 微信支付二维码(base64格式)
  wxImageBytes: string;
  orderUuid: string;
};

// 生成支付二维码
// 后端的二维码数据是不完整的, 这里补全头部的 data:image/png;base64,
export const getPayQRCode = async (productId: number): Promise<PayQRCodes> => {
  const response = await fetcher.post<ResponseBody<PayQRCodes>>(`${userPrefix}/order/get-qr-code`, {
    productId,
  });
  const data: PayQRCodes = response.data.data;
  const base64Head: string = "data:";
  const prefix: string = "data:image/png;base64,";
  if (!data.aliImageBytes.startsWith(base64Head)) {
    data.aliImageBytes = prefix + data.aliImageBytes;
  }
  if (!data.wxImageBytes.startsWith(base64Head)) {
    data.wxImageBytes = prefix + data.wxImageBytes;
  }
  return data;
};

// 获取会员卡的支付状态
export const getMemberCardPayStatus = async (orderUuid: string): Promise<boolean> => {
  const validateStatus = (status: number) => status === 401 || status <= 299;
  const response = await fetcher.post<ResponseBody<boolean>>(
    `${userPrefix}/order/get-pay-status?orderUuid=${orderUuid}`,
    null,
    {
      validateStatus,
    },
  );
  return response.data.data;
};

export type MemberState = {
  // 用户是否激活会员身份
  active: boolean;
  // 常规会员结束时间
  annualMemEnd: string;
  // 创建时间
  createTime: string;
  // 企业人员所在企业id
  entId: number;
  // 会员编号
  id: number;
  // 特殊会员类型 1付费会员 2特殊会员 3私有化部署会员
  specialMem: 1 | 2 | 3;
  // 最后更新时间
  updateTime: string;
  // 用户ID
  userId: number;
};

// 获取用户的会员卡信息
export const getMemberInfo = async (): Promise<MemberState | null> => {
  const response = await fetcher.post<ResponseBody<MemberState | null>>(`${userPrefix}/member/get-mem`);
  return response.data.data;
};

export type MemberCouponActivationPayload = {
  // 兑换channel
  // default=1,
  // 1=api兑换
  // 2=手机扫码
  // 3=手机上传
  // 4=电脑扫码
  // 5=电脑上传
  channel?: number;
  couponCode: string;
};

export type MemberCouponActivationResult = {
  msg: string;
  status: boolean;
};

// 激活会员卡优惠券
export const activeMemberCoupon = async (
  params: MemberCouponActivationPayload,
): Promise<MemberCouponActivationResult> => {
  const response = await fetcher.get<ResponseBody<MemberCouponActivationResult>>(
    `${userPrefix}/coupon/event/process`,
    { params },
  );
  return response.data.data;
};

export enum SvcTypeEnum {
  DILIGENCE = 1, // 尽调
  CONTRACT_AUDIT = 2, // 审核
}

export type CardState = {
  // 创建时间
  createTime: string;
  // 到期时间
  expireTime: string;
  // ID
  id: number;
  // 剩余次数
  remainingCount: number;
  // 开始时间
  startTime: string;
  // 卡片类型
  svcCardType: number;
  // 服务类型
  svcType: number;
  // 更新时间
  updateTime: string;
  // 当期已使用次数
  usedCount: number;
  // 用户ID
  userId: number;
};

export type MemberOrExperienceCardType = {
  lastValidExpTypeCard?: CardState;
  latestValidMemTypeCard?: CardState;
};

// 获取指定服务权益
export const getServiceCount = async (type: SvcTypeEnum) => {
  const response = await fetcher.post<ResponseBody<MemberOrExperienceCardType | null>>(
    `${userPrefix}/svc/get-latest-valid-card?svcTypeEnum=${type}`,
  );
  return response.data.data;
};

export type PayTradeForm = {
  aliTrade: string;
  wxTrade: string;
  orderUuid: string;
};

export const getTradeForm = async (productId: number, orderSourceEnum: number): Promise<PayTradeForm> => {
  const response = await fetcher.post<ResponseBody<PayTradeForm>>(`${userPrefix}/order/create-trade`, {
    productId,
    orderSourceEnum,
  });
  return response.data.data;
};
