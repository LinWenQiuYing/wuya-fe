import { ChatParams } from "@/client/types/api";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import { baseURL } from "@/config";
import store from "@/store";
import reloadSessionHistory from "@/client/hooks/reloadSessionHistory";
import { formatQaResult } from "@/client/utils/formatQaResult";
import sendQaParams from "@/client/utils/sendQaParams";
import { AideKey } from "@/client/const";
import sendSurveyParams from "@/client/views/survey/hooks/sendSurveyParams";
import sendAnalysisParams from "@/client/hooks/sendAnalysisParams";
import formatSurveyResult from "@/client/utils/formatSurveyResult";
import formatAnalysisResult from "@/client/utils/formatAnalysisResult";
import formatAuditResult from "@/client/views/audit/formatAuditResult";
import sendAuditParams from "@/client/views/audit/sendAuditParams";
import beforeSendHandleVideo from "@/client/views/video/beforeSendHandleVideo";
import formatVideoResult from "@/client/views/video/formatVideoResult";
import sendFinancialReportParams from "@/client/hooks/sendFinancialReportParams";
import formatServiceResult from "@/client/views/customerService/formatServiceResult";
import beforeSendHandleService from "@/client/views/customerService/beforeSendHandleService";
import reAuth from "@/sign/reAuth";
import { once } from "lodash-es";
import { reloadUserPrivileges } from "@/client/hooks/useUserPrivileges";

let controller: AbortController;
export default function useSendQuestion() {
  const send = async (chatParams: ChatParams, refreshHistory: boolean = false) => {
    if (controller) {
      controller.abort(); // 取消上一个请求
    }
    controller = new AbortController();
    let requestParams;
    switch (chatParams.chat_agent) {
      case AideKey.ENTERPRISE_RESEARCH:
        requestParams = sendSurveyParams(chatParams);
        break;
      case AideKey.DATA_ANALYSIS:
        requestParams = sendAnalysisParams(chatParams);
        break;
      case AideKey.CONTRACT_AUDIT:
        requestParams = sendAuditParams(chatParams);
        break;
      case AideKey.VIDEO_PARSE:
        requestParams = beforeSendHandleVideo(chatParams);
        break;
      case AideKey.CUSTOMER_SERVICE:
        requestParams = beforeSendHandleService(chatParams);
        break;
      case AideKey.FINANCIAL_ANALYSIS:
        requestParams = sendFinancialReportParams(chatParams);
        break;
      default:
        requestParams = sendQaParams(chatParams);
    }
    // 初始化状态
    store.commit("chat/TOGGLE_STARTCHAT", true);
    store.commit("chat/SET_IS_STOP", false);
    //请求数据
    const refresh = once(async () => await reloadUserPrivileges());
    await fetchEventSource(baseURL + requestParams.url, {
      ...requestParams.params,
      signal: controller.signal,
      onopen(response) {
        // 401 拦截
        if (response.status === 401) {
          throw new Error("401");
        }
        return Promise.resolve();
      },
      onmessage(event) {
        if (event) {
          const agentType = chatParams.chat_agent;
          if ([AideKey.CONTRACT_AUDIT, AideKey.ENTERPRISE_RESEARCH].includes(agentType)) {
            refresh().catch(console.error);
          }
          const RecordList = store.state.chat.chatData;
          const lastData = RecordList.pop();
          if (!lastData) return;
          let fn;
          switch (agentType) {
            case AideKey.ENTERPRISE_RESEARCH:
              fn = formatSurveyResult;
              break;
            case AideKey.DATA_ANALYSIS:
            case AideKey.FINANCIAL_ANALYSIS:
              fn = formatAnalysisResult;
              break;
            case AideKey.CONTRACT_AUDIT:
              fn = formatAuditResult;
              break;
            case AideKey.VIDEO_PARSE:
              fn = formatVideoResult;
              break;
            case AideKey.CUSTOMER_SERVICE:
              fn = formatServiceResult;
              break;
            default:
              fn = formatQaResult;
          }
          const res = fn(JSON.parse(event.data), lastData);
          store.commit("chat/SET_CHAT_DATA", [...RecordList, res]);
        }
      },
      onerror(err: Error) {
        // 服务异常
        controller.abort("服务异常");
        if (err.message === "401") {
          reAuth().catch(console.error);
        }
        throw err;
      },
      onclose() {
        // 服务关闭
        controller.abort("服务关闭");
        store.commit("chat/TOGGLE_STARTCHAT", false);
        if (refreshHistory) reloadSessionHistory().catch(console.error);
        if (chatParams.callback)
          chatParams.callback(store.state.chat.question, chatParams.key).catch(console.error);
      },
      openWhenHidden: true,
    });
  };

  const stop = () => {
    controller?.abort("停止回答");
    const data = store.state.chat.chatData;
    const curData = data.pop();
    if (!curData) return;
    if ("preCheckConfirms" in curData.answer) delete curData.answer.preCheckConfirms;
    curData.answer.answerStop = true;
    store.commit("chat/SET_CHAT_DATA", [...data, curData]);
    store.commit("chat/TOGGLE_STARTCHAT", false);
  };
  return {
    send,
    stop,
  };
}
