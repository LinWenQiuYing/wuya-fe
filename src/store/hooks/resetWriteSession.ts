import store from "..";

// 重置写作会话(session), 新的写作将出现在新的话题(topic)中
export default function resetWriteSession() {
  store.commit("chat/RESET_WRITE_SESSION");
}
