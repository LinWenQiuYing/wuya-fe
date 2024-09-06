import store from "@/store";
import { WritingEventStreamMessage, WritingRecord } from "@/store/modules/chat";
import reflectRouteTopicId from "./reflectRouteTopicId";

export default function formatWriteResult(result: WritingEventStreamMessage, data: WritingRecord) {
  if ("topic_id" in result) {
    //问答id
    store.commit("chat/SET_CHAT_ID", result.topic_id);
    reflectRouteTopicId(result.topic_id).catch(console.error);
    return { ...data, topicId: result.topic_id, recordId: result.record_id };
  }
  if (result.record_id) {
    //当前问题id
    data.recordId = result.record_id;
  }
  if ("agent" in result) {
    //进度
    const storage = data.answer["progress"] || [];
    storage.push(result.agent);
    data.answer["progress"] = storage;
  }
  if ("outline" in result && result.outline !== null) {
    //大纲
    const outline = result.outline.replace(/(#+)/g, "$1 ");
    data.answer.outline = (data.answer.outline ?? "") + outline;
  }
  if ("reference" in result && result.reference.length > 0) {
    data.answer.reference = result.reference;
  }
  if ("citations" in result && result.citations.length) {
    data.answer.text =
      data.answer.text +
      result.citations.map((identity) => `<span class="corner-mark">${1 + identity}</span>`).join("");
  }

  if ("text" in result) {
    //回答
    if (!data.answer.isProgress) data.answer.isProgress = true;
    if (result.text === null) {
      data.answer.answerStatus = 1;
    } else {
      const text = result.text.replace(/(#+)/g, "$1 ");
      data.answer.text = data.answer.text ? data.answer.text + text : text;
    }
  }

  if ("status" in result) {
    if (result.status === "ok") {
      data.answer.answerStatus = 1;
    } else if (result.status === "error") {
      data.answer.answerStatus = 0;
      data.answer.error = result.detail;
    }
  }
  return data;
}
