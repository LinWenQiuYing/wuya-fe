import { AuditAnswer, AuditRecordState, RecordState } from "@/client/types/chat";
import store from "@/store";

export default function formatAuditResult(result: AuditAnswer, data: RecordState<AuditRecordState>) {
  if ("topic_id" in result) {
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
  // 进度关键字
  if (result.keywords) {
    const storage = data.answer.progress || [];
    storage.push(result.keywords);
    data.answer.progress = storage;
  }
  if (result.audit_rule) {
    // 审核规则
    const auditRule = result.audit_rule.replace(/(#+)/g, "\n$1 ");
    data.answer.auditRule = data.answer.auditRule ? data.answer.auditRule + auditRule : auditRule;
  }
  if (result.reference && result.reference.length > 0) {
    data.answer.reference = result.reference;
  }
  if (result.citations && result.citations.length) {
    let llm_output = data.answer.llm_output ?? "";
    const citationsStr = result.citations
      .map((identity) => `<span class="corner-mark">${1 + identity}</span>`)
      .join("");
    if (data.answer.llm_output?.slice(-1) === "。") {
      llm_output = llm_output.slice(0, -1) + citationsStr + "。";
    } else {
      llm_output = llm_output + citationsStr;
    }
    data.answer.llm_output = llm_output;
  }
  if ("llm_output" in result) {
    //回答
    if (!data.answer.isProgress) data.answer.isProgress = true;
    if (result.llm_output) {
      const llm_output = result.llm_output.replace(/(#+)/g, "$1 ");
      const formatOutput = llm_output.replace(/## \n\n/g, "\n\n");
      const output = data.answer.llm_output ? data.answer.llm_output + formatOutput : formatOutput;
      data.answer.llm_output = output.replace(/```|markdown/g, "");
    }
  }

  if ("status" in result) {
    data.answer.answerStatus = 1;
  }
  return data;
  // store.commit("chat/SET_AUDIT_DATA", [...data, data]);
}
