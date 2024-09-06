import { Module } from "vuex";
import { UserInfo } from "@/sign/api/sign";
import reflectStorage from "../utils/reflectStorage";
import { StoreState } from "..";
import { Milliseconds } from "@/utils/parseTimeNotation";

export type SignState = {
  // 用户信息
  userInfo: UserInfo | null;
  authorization: string | null;
  avatar: string | null;
  expired: Milliseconds | null;
};

export const Set_User = "Set_User";
export const Set_Authorization = "Set_Authorization";
export const Set_Avatar = "Set_Avatar";
export const Set_Expired = "Set_TokenExpired";

// 登录鉴权相关
const sign = {
  namespaced: true,
  state: {
    userInfo: null,
    authorization: null,
    avatar: null,
    expired: null,
  },
  mutations: {
    [Set_User](state: SignState, payload: UserInfo | null) {
      state.userInfo = payload;
    },
    [Set_Authorization](state: SignState, authorization: string | null) {
      if (state.authorization === authorization) return;
      state.authorization = authorization;
    },
    [Set_Avatar](state: SignState, avatar: string) {
      if (state.avatar === avatar) return;
      state.avatar = avatar;
    },
    [Set_Expired](state: SignState, expired: Milliseconds | null) {
      state.expired = expired;
    },
  },
} satisfies Module<SignState, StoreState>;

reflectStorage(sign.state, { keys: ["userInfo", "authorization", "avatar", "expired"] });

export default sign;
