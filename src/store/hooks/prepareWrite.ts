import store from "..";

// 在当前会话中准备新写作: 插入占位的数据结构
// 不等到后端接口就绪再添加插入新数据, 这样可以在输入问题后, 就可以立即获得写作界面
export default function prepareWrite(question: string) {
  store.commit("chat/TOGGLE_STARTCHAT", true);
  store.commit("chat/SET_IS_STOP", false);
  store.commit("chat/PREPARE_WRITE", question);
}
