import store from "@/store";
import { RecordState, ServiceAnswer, ServiceRecordState } from "@/client/types/chat";

export default function formatServiceResult(result: ServiceAnswer, data: RecordState<ServiceRecordState>) {
  if (result.topic_id) {
    //问答id
    store.commit("chat/SET_CHAT_ID", result.topic_id);
  }

  if (result.record_id) {
    data.recordId = result.record_id;
  }

  if (result.agent) {
    //进度
    const storage = data.answer.progress || [];
    data.answer.progress = [...storage, result.agent];
  }

  if ("llm_output" in result) {
    //回答
    if (!data.answer.isProgress) data.answer.isProgress = true;
    if (result.llm_output === null) {
      data.answer.answerStatus = 1;
    } else {
      // todo 返回链接时 以）为中断符 添加空格
      const llm_output = result.llm_output!.replace(/(#+)/g, "$1 ");
      const output = data.answer.llm_output ? data.answer.llm_output + llm_output : llm_output;
      data.answer.llm_output = output.replace(/(https?:\/\/[^\s）]+)(）| \))/g, "$1 $2");
    }
  }
  if (result.related_query) {
    const storage = data.answer.query || [];
    storage.push(result.related_query);
    data.answer.query = storage;
  }

  if ("status" in result) {
    data.answer.answerStatus = 1;
  }

  return data;
}
