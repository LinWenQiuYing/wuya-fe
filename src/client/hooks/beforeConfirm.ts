import store from "@/store";
import handleCompany from "@/client/views/survey/hooks/handleCompany";
import { SurveyRecordState } from "@/client/types/chat";

// @ 尽调助手的情况下 调用此方法确认公司
export default async function (query: string, outline?: string) {
  const data = [...store.state.chat.chatData];
  const curData = data.pop();
  if (!curData) return;
  (<SurveyRecordState>curData.answer).outline = outline;
  const res = await handleCompany(query, curData);
  store.commit("chat/SET_CHAT_DATA", [...data, res]);
}
