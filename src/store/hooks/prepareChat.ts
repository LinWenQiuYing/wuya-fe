import store from "..";
import { AideKey } from "@/client/const";

// 在当前会话中准备新问答: 插入占位的数据结构
// 不等到后端接口就绪再添加插入新数据, 这样可以在输入问题后, 就可以立即获得问答界面
export default function prepareChat(question: string) {
  const agent = store.state.agent.type;
  store.commit("chat/PREPARE_CHAT", [question, agent || AideKey.NO_AGENT]);
  store.commit("chat/TOGGLE_STARTCHAT", true);
  store.commit("chat/SET_IS_STOP", false);
}
