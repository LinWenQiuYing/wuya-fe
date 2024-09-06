import store from "..";

// 重置客服会话(session), 新的客服会话将出现在新的话题(topic)中
export default function resetServiceSession() {
  store.commit("chat/RESET_SERVICE_SESSION");
}
