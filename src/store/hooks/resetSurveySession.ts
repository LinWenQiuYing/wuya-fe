import store from "..";

// 重置尽调会话
export default function resetSurveySession() {
  store.commit("chat/RESET_SURVEY_SESSION");
}
