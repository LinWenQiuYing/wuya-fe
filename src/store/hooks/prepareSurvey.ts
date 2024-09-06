import store from "..";

// 在当前会话中准备新尽调: 插入占位的数据结构
// 不等到后端接口就绪再添加插入新数据, 这样可以在输入问题后, 就可以立即获得尽调页面
export default function prepareSurvey(question: string, outline?: string) {
  store.commit("chat/TOGGLE_STARTCHAT", true);
  store.commit("chat/SET_IS_STOP", false);
  store.commit("chat/PREPARE_SURVEY", [question, outline]);
}
