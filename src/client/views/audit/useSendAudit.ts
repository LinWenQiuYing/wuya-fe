import store from "@/store";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import { baseURL } from "@/config";
import { computed } from "vue";
import formatAuditResult from "@/client/views/audit/formatAuditResult";
import sendAuditParams from "@/client/views/audit/sendAuditParams";
import { BaseSendQuery } from "@/client/types/api";
import reloadSessionHistory from "@/client/hooks/reloadSessionHistory";
import { AuditAnswer } from "@/client/types/chat";
import { CheckIdState } from "@/store/modules/documentQA";
import { once } from "lodash-es";
import { reloadUserPrivileges } from "@/client/hooks/useUserPrivileges";

export type AuditParams = {
  contract_source?: CheckIdState | null;
  audit_rule?: string;
  regenerate?: boolean;
} & BaseSendQuery;

let controller: AbortController;
export default function useSendAudit() {
  const question = computed(() => store.state.chat.question);
  const topicId = computed(() => store.state.chat.chat_id);
  const send = async (params: AuditParams, refreshHistory: boolean = false) => {
    if (controller) {
      controller.abort(); // 取消上一个请求
    }
    const refresh = once(async () => await reloadUserPrivileges());
    controller = new AbortController();
    store.commit("chat/SET_QUESTION", params.query);
    const requestParams = sendAuditParams(params);
    //请求数据
    await fetchEventSource(baseURL + requestParams.url, {
      ...requestParams.params,
      signal: controller.signal,
      onmessage(event) {
        if (event) {
          refresh().catch(console.error);
          const chatData = store.state.chat.auditData;
          const curChat = chatData.pop();
          const result = <AuditAnswer>JSON.parse(event.data);
          if (!curChat) return;
          const res = formatAuditResult(result, curChat);
          store.commit("chat/SET_AUDIT_DATA", [...chatData, res]);
        }
      },
      onerror(err) {
        // 服务异常
        controller.abort("服务异常");
        throw err;
      },
      onclose: () => {
        // 服务关闭
        controller?.abort("服务关闭");

        if (refreshHistory) reloadSessionHistory().catch(console.error);
        store.commit("chat/TOGGLE_STARTCHAT", false);
      },
      openWhenHidden: true,
    });
  };

  const auditStop = () => {
    controller?.abort("停止回答");
    const data = store.state.chat.auditData;
    const curData = data.pop()!;
    curData.answer.answerStop = true;
    store.commit("chat/SET_AUDIT_DATA", [...data, curData]);
    store.commit("chat/TOGGLE_STARTCHAT", false);
  };
  return {
    question,
    topicId,
    send,
    auditStop,
  };
}
