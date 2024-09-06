import beforeSendHandleVideo from "@/client/views/video/beforeSendHandleVideo";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import { baseURL } from "@/config";
import store from "@/store";
import reloadSessionHistory from "@/client/hooks/reloadSessionHistory";
import formatVideoResult from "@/client/views/video/formatVideoResult";
import { VideoAnswer } from "@/client/types/chat";
import { CheckIdState } from "@/store/modules/documentQA";

let controller: AbortController;
export type VideoParams = {
  query: string;
  topic_id?: number;
  video_source?: CheckIdState | null;
};
export default function useSendVideoQuery() {
  const send = async (params: VideoParams, refreshHistory: boolean = false) => {
    if (controller) {
      controller.abort(); // 取消上一个请求
    }
    controller = new AbortController();
    const requestParams = beforeSendHandleVideo(params);
    await fetchEventSource(baseURL + requestParams.url, {
      ...requestParams.params,
      signal: controller.signal,
      onmessage(event) {
        if (event) {
          const recordList = [...store.state.chat.videoData];
          const lastData = recordList.pop();
          if (!lastData) return;
          const res = formatVideoResult(<VideoAnswer>JSON.parse(event.data), lastData);
          store.commit("chat/SET_VIDEO_DATA", [...recordList, res]);
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

  const stopService = () => {
    controller?.abort("停止回答");
    const data = store.state.chat.videoData;
    const curData = data.pop();
    if (!curData) return;
    curData.answer.answerStop = true;
    store.commit("chat/SET_VIDEO_DATA", [...data, curData]);
    store.commit("chat/TOGGLE_STARTCHAT", false);
  };

  return {
    send,
    stopService,
  };
}
