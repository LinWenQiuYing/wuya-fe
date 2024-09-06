import { KnowledgeSourceType } from "@/client/types";
import { ElTree } from "element-plus";

export type CheckIdState = {
  kb_id?: string; //知识库id
  kb_type?: string; //知识库类型
  doc_id?: string; //文件id
  dir_id?: string; //文件夹id
};

export interface DocumentQAState {
  docIds: number[];
  knowledgeSource: KnowledgeSourceType[]; // 选中根节点知识源
  knowledgeTree: InstanceType<typeof ElTree> | null;
  treeRootData: Record<string, string>[] | null;
  halfRoots: string[]; // 当前半选父节点
  newsId: string;
  currentKnowledgeSourceIds: CheckIdState[];
}

/*文档文档菜单下共享数据信息*/
const state: DocumentQAState = {
  docIds: [],
  knowledgeSource: [],
  currentKnowledgeSourceIds: [],
  knowledgeTree: null,
  treeRootData: null,
  halfRoots: [],
  newsId: "",
};

const mutations = {
  SET_CHECK_DOC_ID(state: DocumentQAState, payload: number[]) {
    state.docIds = payload;
  },
  SET_KNOWLEDGE_SOURCE(state: DocumentQAState, payload: KnowledgeSourceType[]) {
    state.knowledgeSource = payload;
  },
  SET_KNOWLEDGE_TREE(state: DocumentQAState, payload: InstanceType<typeof ElTree>) {
    state.knowledgeTree = payload;
  },
  SET_KNOWLEDGE_ROOT_DATA(state: DocumentQAState, payload: Record<string, string>[]) {
    state.treeRootData = payload;
  },
  SET_HALF_ROOT(state: DocumentQAState, payload: string[]) {
    state.halfRoots = payload;
  },
  SET_NEWS_ID(state: DocumentQAState, payload: string) {
    state.newsId = payload;
  },
  SET_CURRENT_DATASOURCE_IDS(state: DocumentQAState, payload: CheckIdState[]) {
    state.currentKnowledgeSourceIds = payload;
  },
};

export default {
  namespaced: true,
  state,
  mutations,
};
