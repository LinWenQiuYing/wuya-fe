import { ChatTreeNode } from "@/client/types/api";
import { Module } from "vuex";

export type HistoryChatState = {
  root: ChatTreeNode | null;
  historyChats: ChatTreeNode[];
  moveTree: ChatTreeNode[];
  curChat: ChatTreeNode | null;
};
export const Set_Root = "Set_Root";
export const Set_History_Chats = "Set_History_Chats";
export const Set_Move_Tree = "Set_Move_Tree";
export const Set_CurChat = "Set_CurChat";

type Store = unknown;

const historyChat = {
  namespaced: true,
  state: {
    root: null,
    historyChats: [], // 历史对话
    moveTree: [], //历史对话文件夹
    curChat: null, // 当前对话
  },
  mutations: {
    [Set_Root](state, payload: ChatTreeNode) {
      state.root = payload;
    },
    [Set_History_Chats](state, payload: ChatTreeNode[]) {
      state.historyChats = payload;
    },
    [Set_Move_Tree](state, payload: ChatTreeNode[]) {
      state.moveTree = payload;
    },
    [Set_CurChat](state, payload: ChatTreeNode) {
      state.curChat = payload;
    },
  },
} satisfies Module<HistoryChatState, Store>;
export default historyChat;
