import store from "@/store";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import { baseURL } from "@/config";
import formatAnalysisResult from "@/client/utils/formatAnalysisResult";
import sendAnalysisParams from "@/client/hooks/sendAnalysisParams";
import { BaseSendQuery } from "@/client/types/api";
import reloadSessionHistory from "@/client/hooks/reloadSessionHistory";

export interface DataAnalysisParams extends BaseSendQuery {
  files?: string[];
  max_round?: number;
  regenerate?: boolean;
}

let controller: AbortController;
const useDataAnalysis = () => {
  const sendDataAnalysis = async (params: DataAnalysisParams, refreshHistory: boolean = false) => {
    if (controller) {
      controller.abort(); // 取消上一个请求
    }
    controller = new AbortController();
    const requestParams = sendAnalysisParams(params);
    //请求数据
    await fetchEventSource(baseURL + requestParams.url, {
      ...requestParams.params,
      signal: controller.signal,
      onmessage(event) {
        if (event) {
          const data = store.state.chat.dataAnalysisData;
          const curData = data.pop();
          if (!curData) return;
          const res = formatAnalysisResult(JSON.parse(event.data), curData);
          store.commit("chat/SET_DATA_ANALYSIS_DATA", [...data, res]);
        }
      },
      onerror(err) {
        // 服务异常
        controller.abort("服务异常");
        throw err;
      },
      onclose() {
        // 服务关闭
        controller.abort("服务关闭");
        store.commit("chat/TOGGLE_STARTCHAT", false);
        if (refreshHistory) reloadSessionHistory().catch(console.error);
      },
      openWhenHidden: true,
    });
  };

  const stopDataAnalysis = () => {
    controller?.abort("停止回答");
    const data = store.state.chat.dataAnalysisData;
    const curData = data.pop()!;
    curData.answer.answerStop = true;
    store.commit("chat/SET_DATA_ANALYSIS_DATA", [...data, curData]);
    store.commit("chat/TOGGLE_STARTCHAT", false);
  };
  return {
    sendDataAnalysis,
    stopDataAnalysis,
  };
};
export default useDataAnalysis;
