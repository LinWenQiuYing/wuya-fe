import store from "@/store";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import { baseURL } from "@/config";
import { computed } from "vue";
import reloadSessionHistory from "@/client/hooks/reloadSessionHistory";
import formatSurveyResult from "@/client/utils/formatSurveyResult";
import sendSurveyParams from "@/client/views/survey/hooks/sendSurveyParams";
import { BaseSendQuery } from "@/client/types/api";
import { SurveyAnswer } from "@/client/types/chat";
import { once } from "lodash-es";
import { reloadUserPrivileges } from "@/client/hooks/useUserPrivileges";

export type SurveyParams = {
  outline?: string;
  // recordId
  qa_record_id?: number;
  // 公司名
  enterprise_name?: string;
  // 是否修改过大纲
  modify_flag?: boolean;
  // 公司代码
  stock_code?: string;
} & BaseSendQuery;

let controller: AbortController;
export default function useSurvey() {
  const question = computed(() => store.state.chat.question);
  const topicId = computed(() => store.state.chat.chat_id);
  const send = async (params: SurveyParams, refreshHistory: boolean = false) => {
    if (controller) {
      controller.abort(); // 取消上一个请求
    }
    controller = new AbortController();
    const requestParams = sendSurveyParams(params);
    const refresh = once(async () => await reloadUserPrivileges());
    //请求数据
    await fetchEventSource(baseURL + requestParams.url, {
      ...requestParams.params,
      signal: controller.signal,
      onmessage(event) {
        if (event) {
          refresh().catch(console.error);
          const chatData = store.state.chat.surveyData;
          const curChat = chatData.pop();
          if (!curChat) return;
          const res = formatSurveyResult(<SurveyAnswer>JSON.parse(event.data), curChat);
          store.commit("chat/SET_SURVEY_DATA", [...chatData, res]);
        }
      },
      onerror(err) {
        // 服务异常
        controller.abort("服务异常");
        throw err;
      },
      onclose() {
        // 服务关闭
        controller?.abort("服务关闭");
        store.commit("chat/TOGGLE_STARTCHAT", false);
        if (refreshHistory) reloadSessionHistory().catch(console.error);
      },
      openWhenHidden: true,
    });
  };

  const surveyStop = () => {
    controller?.abort("停止回答");
    const data = store.state.chat.surveyData;
    const curData = data.pop();
    if (!curData) return;
    curData.answer.answerStop = true;
    if (curData.answer.preCheckConfirms) delete curData.answer.preCheckConfirms;
    store.commit("chat/SET_SURVEY_DATA", [...data, curData]);
    store.commit("chat/TOGGLE_STARTCHAT", false);
  };
  return {
    question,
    topicId,
    send,
    surveyStop,
  };
}
