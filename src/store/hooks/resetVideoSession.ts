import store from "..";

// 重置视频解析会话(session), 新的视频解析将出现在新的话题(topic)中
export default function resetVideoSession() {
  store.commit("chat/RESET_VIDEO_SESSION");
}
