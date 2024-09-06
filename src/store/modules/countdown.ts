import { Module } from "vuex";
import reflectStorage from "../utils/reflectStorage";
import { StoreState } from "..";

type CountdownExpired = number;

type Second = `${number}s`;
export type PhoneOrEmail = string;

export type CountdownState = {
  countdownExpiredMap: Record<string, CountdownExpired>;
};

export const Set_CountdownExpiredMap = "Set_CountdownExpiredMap";

// 倒计时默认生存时间
const defaultTTL: Second = "60s";

const countdown = {
  namespaced: true,
  state: {
    countdownExpiredMap: {},
  },
  mutations: {
    [Set_CountdownExpiredMap](state: CountdownState, payload: PhoneOrEmail) {
      const ttl = defaultTTL.replace(/s$/, "");
      const expired = Math.floor(Date.now() / 1000) + Number.parseInt(ttl);
      state.countdownExpiredMap = { ...state.countdownExpiredMap, [payload]: expired };
    },
  },
} satisfies Module<CountdownState, StoreState>;

reflectStorage(countdown.state, { storage: sessionStorage });

export default countdown;
