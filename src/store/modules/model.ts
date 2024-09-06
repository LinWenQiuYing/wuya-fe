import { Module } from "vuex";
import { Model } from "@/client/api/chat";
import { StoreState } from "..";

export type ModelState = {
  models: Model[];
};

export const Set_Models = "Set_Models";

const model = {
  namespaced: true,
  state: {
    models: [],
  },
  mutations: {
    [Set_Models](state, payload: Model[]) {
      state.models = payload;
    },
  },
} satisfies Module<ModelState, StoreState>;

export default model;
