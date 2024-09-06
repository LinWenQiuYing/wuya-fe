import { QaAnswer, QaRecordState, RecordState } from "@/client/types/chat";
import store from "@/store";

const regex = /##\s+关键信息|##\s+分析/g;

function formatMarkdown(data: string) {
  return data.replace(regex, "");
}

export const formatQaResult = (result: QaAnswer, data: RecordState<QaRecordState>) => {
  if (result.topic_id) {
    //问答id
    store.commit("chat/SET_CHAT_ID", result.topic_id);
  }
  if (result.record_id) {
    data.recordId = result.record_id;
  }
  if ("company" in result) {
    data.answer.company = result.company;
  }
  if ("industry_chain" in result) {
    data.answer.industry_chain = result.industry_chain;
  }
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
  if (result.reference && result.reference.length > 0) {
    //参考
    data.answer.reference = result.reference;
  }
  if (result.related_stocks) {
    //股票
    data.answer.related_stocks = result.related_stocks;
  }
  if ("llm_output" in result) {
    if (result.llm_output === "null") return;
    if (result.llm_output === null) {
      data.answer.answerStatus = 1;
    } else {
      const llmOutputAndCitations = {
        ...result,
        llm_output: result.llm_output!.replaceAll("- **", "\n\n- **"),
      };
      if (!data.answer.isProgress) data.answer.isProgress = true;
      let curAnswer = "";
      const citations = llmOutputAndCitations?.citations;
      if (citations && citations.length > 0) {
        citations.forEach((item: number) => {
          curAnswer = curAnswer + `<span class="corner-mark">${item + 1}</span>`;
        });
      }
      curAnswer = curAnswer + llmOutputAndCitations.llm_output;
      data.answer.llm_output = formatMarkdown((data.answer.llm_output ?? "") + curAnswer);
    }
  }
  if (result.related_query) {
    const storage = data.answer.query || [];
    storage.push(result.related_query);
    data.answer.query = storage;
  }
  return data;
  // store.commit("chat/SET_CHAT_DATA", [...data, data]);
};
