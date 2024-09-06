import { RecordState, SurveyRecordState } from "@/client/types/chat";
import store from "@/store";
import { beforeSendConfirm } from "@/client/api/chat";

const handleCompany = async (query: string, chat?: RecordState<SurveyRecordState>) => {
  const chatData = [...store.state.chat.surveyData];
  store.commit("chat/SET_QUESTION", query);
  const res = await beforeSendConfirm(query).catch(console.error);

  let curChat = chat;
  if (!chat) {
    curChat = chatData.pop();
  }
  if (!curChat) return;

  if (!res || res.code === 500) {
    curChat.answer.answerStop = true;
    curChat.answer.llm_output = res!.message;
    store.commit("chat/TOGGLE_STARTCHAT", false);
  } else {
    if (res.data.topic_id) store.commit("chat/SET_CHAT_ID", res.data.topic_id);
    curChat.answer.preCheckConfirms = res.data.candidate_enterprise_info;
    curChat.answer.recordId = res.data.qa_record_id;
  }

  if (!chat) store.commit("chat/SET_SURVEY_DATA", [...chatData, curChat]);
  return curChat;
};

export default handleCompany;
