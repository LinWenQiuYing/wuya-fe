import {
  AuthsProp,
  BaseInfoProp,
  CreateKnowledgeProp,
  KnowledgeBaseState,
  uploadFilesResProp,
} from "@/admin/types";
import { Module, MutationTree } from "vuex";
import { StoreState } from "..";

export type KnowledgeState = CreateKnowledgeProp;

const state: KnowledgeState = {
  state: KnowledgeBaseState.LIST, // 当前属于创建知识库还是查看知识库列表
  currentData: {} as BaseInfoProp, // 当前选中知识库
  createType: 1, // 当前知识库类型 图谱或文本
  uploadFilesRes: [], // 批量上传文件结果
  taskId: "",
  organization: null, // 当前选中组织架构
};

const mutations: MutationTree<KnowledgeState> = {
  CHECK_STATE(state: KnowledgeState, payload: KnowledgeBaseState) {
    state.state = payload;
  },
  SET_CURRENT_DATA(state: KnowledgeState, payload: BaseInfoProp) {
    state.currentData = payload;
  },
  SET_CREATE_TYPE(state: KnowledgeState, payload: number) {
    state.createType = payload;
  },
  SET_UPLOAD_FILES(state: KnowledgeState, payload: uploadFilesResProp[]) {
    state.uploadFilesRes = payload;
  },
  SET_TASK_ID(state: KnowledgeState, payload: string) {
    state.taskId = payload;
  },
  SET_ORGANIZATION(state: KnowledgeState, payload: AuthsProp) {
    state.organization = payload;
  },
};

export default {
  namespaced: true,
  state,
  mutations,
} satisfies Module<KnowledgeState, StoreState>;
