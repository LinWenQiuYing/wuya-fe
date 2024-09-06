import { computed } from "vue";
import store from "..";
import { ChatTreeNode } from "@/client/types/api";
import { Set_CurChat, Set_History_Chats, Set_Move_Tree, Set_Root } from "@/store/modules/historyChat";

export default function useHistoryChat() {
  const root = computed<ChatTreeNode | null>({
    get() {
      return store.state.historyChat.root;
    },
    set(root) {
      store.commit(`historyChat/${Set_Root}`, root);
    },
  });
  const historyChats = computed<ChatTreeNode[]>({
    get() {
      return store.state.historyChat.historyChats;
    },
    set(historyChats) {
      store.commit(`historyChat/${Set_History_Chats}`, historyChats);
    },
  });
  const moveTree = computed<ChatTreeNode[]>({
    get() {
      return store.state.historyChat.moveTree;
    },
    set(moveTree) {
      store.commit(`historyChat/${Set_Move_Tree}`, moveTree);
    },
  });
  const curChat = computed<ChatTreeNode | null>({
    get() {
      return store.state.historyChat.curChat;
    },
    set(curChat) {
      store.commit(`historyChat/${Set_CurChat}`, curChat);
    },
  });
  const parentFolder = computed(() => {
    const parentFolder = moveTree.value.find((item) => item.id == curChat.value?.parent_id);
    return parentFolder;
  });

  return {
    root,
    historyChats,
    moveTree,
    curChat,
    parentFolder,
  };
}
