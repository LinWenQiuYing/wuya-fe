import beforeSendHandleService from "@/client/views/customerService/beforeSendHandleService";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import { baseURL } from "@/config";
import store from "@/store";
import reloadSessionHistory from "@/client/hooks/reloadSessionHistory";
import { ServiceAnswer } from "@/client/types/chat";
import formatServiceResult from "@/client/views/customerService/formatServiceResult";

let controller: AbortController;
export type ServiceParams = {
  query: string;
  topic_id?: number;
};
export default function useSendServiceQuery() {
  const send = async (params: ServiceParams, refreshHistory: boolean = false) => {
    if (controller) {
      controller.abort(); // 取消上一个请求
    }
    controller = new AbortController();
    const requestParams = beforeSendHandleService(params);
    await fetchEventSource(baseURL + requestParams.url, {
      ...requestParams.params,
      signal: controller.signal,
      onmessage(event) {
        if (event) {
          const recordList = [...store.state.chat.serviceData];
          const lastData = recordList.pop();
          if (!lastData) return;
          const res = formatServiceResult(<ServiceAnswer>JSON.parse(event.data), lastData);
          store.commit("chat/SET_SERVICE_DATA", [...recordList, res]);
        }
      },
      onerror(err) {
        controller.abort("服务异常");
        throw err;
      },
      onclose() {
        controller?.abort("服务关闭");
        store.commit("chat/TOGGLE_STARTCHAT", false);
        refreshHistory && reloadSessionHistory();
      },
      openWhenHidden: true,
    });
  };

  const stopServiceChat = () => {
    controller?.abort("停止回答");
    const data = store.state.chat.serviceData;
    const curData = data.pop();
    if (!curData) return;
    curData.answer.answerStop = true;
    store.commit("chat/SET_SERVICE_DATA", [...data, curData]);
    store.commit("chat/TOGGLE_STARTCHAT", false);
  };

  return {
    send,
    stopServiceChat,
  };
}
