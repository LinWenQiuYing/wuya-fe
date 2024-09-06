import { createStore } from "vuex";
import chat, { ChatState } from "./modules/chat";
import documentQA, { DocumentQAState } from "./modules/documentQA";
import knowledge, { KnowledgeState } from "./modules/knowledge";
import historyChat, { HistoryChatState } from "./modules/historyChat";
import sign, { SignState } from "./modules/sign";
import model, { ModelState } from "./modules/model";
import countdown, { CountdownState } from "./modules/countdown";
import pdfPreview, { PdfState } from "./modules/pdfPreview";
import dict, { DictState } from "./modules/dict";
import agent, { AgentState } from "./modules/agent";

export type StoreState = {
  // 登录相关: 用户信息(userInfo), 后端接口请求密钥(authorization)
  sign: SignState;
  // 模型相关: 可用模型列表(models), 已选模型(modelType)
  model: ModelState;
  //历史收藏相关
  historyChat: HistoryChatState;
  // 倒计时表
  countdown: CountdownState;
  // 对话相关
  chat: ChatState;
  // pdf预览
  pdfPreview: PdfState;
  // 字典
  dict: DictState;
  documentQA: DocumentQAState;
  knowledge: KnowledgeState;
  // 助手
  agent: AgentState;
};

export default createStore<StoreState>({
  modules: {
    chat,
    documentQA,
    knowledge,
    historyChat,
    sign,
    model,
    countdown,
    pdfPreview,
    dict,
    agent,
  },
});
