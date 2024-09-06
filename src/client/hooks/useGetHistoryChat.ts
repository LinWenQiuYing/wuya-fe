import { getHistoryChatRoot, getHistoryChat } from "@/client/api/history";
import { HistoryChatType } from "@/client/types";
import useHistoryChat from "@/store/hooks/useHistoryChat";
import { ChatTreeNode } from "@/client/types/api";
import { watch, computed } from "vue";
import useHistoryType from "@/client/layout/useHistoryType";
import store from "@/store";
import getKeyData from "@/admin/utils/getKeyData";

export default function useGetHistoryChat() {
  const type = useHistoryType();
  const chat_id = computed(() => store.state.chat.chat_id);
  const { root, historyChats, moveTree, curChat } = useHistoryChat();
  const getHistoryChats = async (topic_type?: HistoryChatType, page: number = 1, superimposed = true) => {
    let node = root.value;
    if (!node) {
      node = await getHistoryChatRoot();
    }
    if (!node) return;
    const topicType =
      topic_type === HistoryChatType.writing_assistant
        ? [HistoryChatType.writing_assistant]
        : [HistoryChatType.intelligent_qa, HistoryChatType.real_time_information];
    const result = await getHistoryChat(node.id, topicType, page).catch(console.error);
    if (!result) return;
    const transformData = transform(result);
    historyChats.value =
      historyChats.value.length && superimposed ? historyChats.value.concat(transformData) : transformData;
    moveTree.value = historyChats.value
      .filter((item) => item?.is_dir)
      .map((item) => {
        const check = item.id === curChat.value?.parent_id;
        return { ...item, check };
      });
    // 新话题时未指定curChat.value
    if (!curChat.value) {
      const current = getKeyData(historyChats.value, "id", chat_id.value);
      if (current) curChat.value = current;
    }
    root.value = node;
  };

  watch(
    () => type.value,
    () => {
      root.value = null;
      moveTree.value = [];
      historyChats.value = [];
    },
  );
  return {
    getHistoryChats,
  };
}

export function transform(data: ChatTreeNode[]): ChatTreeNode[] {
  if (data && data.length > 0) {
    return data.map((item) => {
      const data = {
        ...item,
        isLeaf: !item.is_dir,
      };
      return data;
    });
  }
  return [];
}
