import store from "@/store";
import { AnalysisAnswer, AnalysisRecordState, RecordState } from "@/client/types/chat";

export default function formatAnalysisResult(result: AnalysisAnswer, data: RecordState<AnalysisRecordState>) {
  if (result.topic_id) {
    //问答id
    store.commit("chat/SET_CHAT_ID", result.topic_id);
  }
  if (result.record_id) {
    data.recordId = result.record_id;
  }
  if (result.outline) {
    data.answer.outline = result.outline;
  }
  if (result.text) {
    const text = data.answer.agent ?? "";
    data.answer.agent = text + (result.text as string);
  }
  if ("result" in result) {
    const agent = data.answer.agent ?? "";
    data.answer.agent = agent + result.result + "\n";
  }
  if ("answer" in result) {
    if (!data.answer.isProgress) data.answer.isProgress = true;
    data.answer.answer = result.answer;
    data.answer.answerStatus = 1;
    // store.commit("chat/SET_DATA_ANALYSIS_DATA", [...data, data]);
  }
  return data;
}
