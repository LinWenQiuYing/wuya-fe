import { RecordState, SurveyAnswer, SurveyRecordState } from "@/client/types/chat";
import store from "@/store";

export default function formatSurveyResult(result: SurveyAnswer, data: RecordState<SurveyRecordState>) {
  if ("topic_id" in result) {
    //问答id
    store.commit("chat/SET_CHAT_ID", result.topic_id);
  }
  //TODO 统一放在data下面
  if (result.qa_record_id) data.answer.recordId = result.qa_record_id;
  if (result.agent) {
    //进度
    const storage = data.answer.progress || [];
    data.answer.progress = [...storage, result.agent];
  }
  // 进度关键字
  if (result.keywords) {
    const storage = data.answer.progress || [];
    storage.push(result.keywords);
    data.answer.progress = storage;
  }
  if (result.outline) {
    //大纲
    const outline = result.outline.replace(/(#+)/g, "$1 ");
    data.answer.outline = data.answer.outline ? data.answer.outline + outline : outline;
  }
  if (result.reference?.length) {
    // 参考
    data.answer.reference = result.reference;
  }

  if (result.citations?.length) {
    // 引用
    const citations = result.citations
      .map((identity) => `<span class="corner-mark">${1 + identity}</span>`)
      .join("");
    const llm_output = data.answer.llm_output ?? "";
    data.answer.llm_output = llm_output + citations;
  }

  if ("llm_output" in result) {
    //回答
    if (!data.answer.isProgress) data.answer.isProgress = true;
    if (result.llm_output) {
      const llm_output = result.llm_output.replace(/(#+)/g, "$1 ");
      const formatOutput = data.answer.llm_output ? data.answer.llm_output + llm_output : llm_output;
      data.answer.llm_output = replaceStrFn(formatOutput);
    }
  }

  if ("status" in result) {
    data.answer.answerStatus = 1;
  }
  return data;
  // store.commit("chat/SET_SURVEY_DATA", [...chatData, data]);
}

const replaceStrFn = (str: string) => {
  return str.replace(/```/g, "").replace(/##\s+背景|##\s+分析|##\s+结论/g, "");
};
