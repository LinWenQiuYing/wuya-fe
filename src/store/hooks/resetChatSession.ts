import store from "..";

// 重置聊天会话, 新的问答将出现在新的话题(topic)中
export default function resetChatSession() {
  store.commit("chat/RESET_CHAT_SESSION");
}
