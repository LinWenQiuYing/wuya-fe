import store from "@/store";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import { baseURL } from "@/config";
import formatAnalysisResult from "@/client/utils/formatAnalysisResult";
import sendFinancialReportParams from "@/client/hooks/sendFinancialReportParams";
import { ChatParams } from "@/client/types/api";
import reloadSessionHistory from "@/client/hooks/reloadSessionHistory";

let controller: AbortController;
const useFinancialReport = () => {
  const sendFinancialReport = async (params: ChatParams, refreshHistory: boolean = false) => {
    if (controller) {
      controller.abort(); // 取消上一个请求
    }
    controller = new AbortController();
    const requestParams = sendFinancialReportParams(params);
    //请求数据
    await fetchEventSource(baseURL + requestParams.url, {
      ...requestParams.params,
      signal: controller.signal,
      onmessage(event) {
        if (event) {
          const data = store.state.chat.financialReportData;
          const curData = data.pop();
          if (!curData) return;
          const res = formatAnalysisResult(JSON.parse(event.data), curData);
          store.commit("chat/SET_FINANCIAL_REPORT", [...data, res]);
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
        refreshHistory && reloadSessionHistory();
      },
      openWhenHidden: true,
    });
  };

  const stopFinancialReport = () => {
    controller?.abort("停止回答");
    const data = store.state.chat.financialReportData;
    const curData = data.pop()!;
    curData.answer.answerStop = true;
    store.commit("chat/SET_FINANCIAL_REPORT", [...data, curData]);
    store.commit("chat/TOGGLE_STARTCHAT", false);
  };
  return {
    sendFinancialReport,
    stopFinancialReport,
  };
};
export default useFinancialReport;
