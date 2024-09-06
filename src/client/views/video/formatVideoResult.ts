import store from "@/store";
import { RecordState, VideoAnswer, VideoRecordState } from "@/client/types/chat";

export default function formatVideoResult(result: VideoAnswer, data: RecordState<VideoRecordState>) {
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

  if ("text" in result) {
    //回答
    if (!data.answer.isProgress) data.answer.isProgress = true;
    if (result.text === null) {
      data.answer.answerStatus = 1;
    } else {
      const text = result.text!.replace(/(#+)/g, "$1 ");
      data.answer.text = data.answer.text ? data.answer.text + text : text;
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
