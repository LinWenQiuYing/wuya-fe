import store from "@/store";
import useChatDetail from "@/client/layout/components/useChatDetail";

export default async function initWritingTopicById(topicId: number) {
  store.commit("chat/SET_CHAT_ID", topicId);
  const { getDetail } = useChatDetail();
  const { chatData } = await getDetail(topicId, 2);
  store.commit("chat/SET_WRITE_DATA", chatData);
  return chatData;
}
