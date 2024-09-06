import { Module } from "vuex";
import { StoreState } from "@/store";
import { AideKey } from "@/client/const";

export type AgentState = {
  type: AideKey | null; // 当前助手类型
};

const state: AgentState = {
  type: null,
};

export default {
  namespaced: true,
  state,
  mutations: {
    SET_TYPE: (state: AgentState, payload: AideKey) => {
      state.type = payload;
    },
  },
} satisfies Module<AgentState, StoreState>;
