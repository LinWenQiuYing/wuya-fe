import store from "..";

// 在当前会话中准备新尽调: 插入占位的数据结构
// 不等到后端接口就绪再添加插入新数据, 这样可以在输入问题后, 就可以立即获得尽调页面
export default function prepareDataAnalysis(question: string, reset = true) {
  store.commit("chat/TOGGLE_STARTCHAT", true);
  store.commit("chat/SET_IS_STOP", false);
  reset && store.commit("chat/RESET_DATA_ANALYSIS_SESSION");
  store.commit("chat/PREPARE_DATA_ANALYSIS", question);
}
