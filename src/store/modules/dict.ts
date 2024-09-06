import { Module } from "vuex";
import { StoreState } from "..";

export type NameValue = {
  name: string;
  value: string;
};
export type DictState = {
  // 省份数据
  province: NameValue[];
  // 职位
  position: NameValue[];
  // 行业
  industry: NameValue[];
};

export const SetProvince = "SET_PROVINCE";
export const SetPosition = "SET_POSITION";
export const SetIndustry = "SET_INDUSTRY";

const dict = {
  namespaced: true,
  state: {
    province: [],
    position: [],
    industry: [],
  },
  mutations: {
    [SetProvince](state: DictState, payload: NameValue[]) {
      state.province = payload;
    },
    [SetPosition](state: DictState, payload: NameValue[]) {
      state.position = payload;
    },
    [SetIndustry](state: DictState, payload: NameValue[]) {
      state.industry = payload;
    },
  },
} satisfies Module<DictState, StoreState>;

export default dict;
