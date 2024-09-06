import store from "@/store";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import { baseURL } from "@/config";
import { computed } from "vue";
import reloadSessionHistory from "@/client/hooks/reloadSessionHistory";
import { FetchEventSourceInit } from "@microsoft/fetch-event-source/lib/cjs/fetch";
import { WritingEventStreamMessage, WritingRecord } from "@/store/modules/chat";
import sendWriteParams from "./sendWriteParams";
import formatWriteResult from "./formatWriteResult";

export type WriteQuery = {
  query: string;
  outline?: string;
  topic_id?: number | null;
  record_id?: number | null;
};
let controller: AbortController;
export default function useWriting() {
  const question = computed<string>(() => store.state.chat.writeQuestion);
  const topicId = computed<number | null>(() => store.state.chat.chat_id);
  const records = computed<WritingRecord[]>({
    get() {
      return store.state.chat.writeData;
    },
    set(value) {
      store.commit("chat/SET_WRITE_DATA", value);
    },
  });
  const lastRecord = computed<WritingRecord | null>(() => {
    const list = store.state.chat.writeData;
    return list.length ? list[list.length - 1] : null;
  });
  const send = async (params: WriteQuery, refreshHistory: boolean = false, index?: number) => {
    if (controller) {
      controller.abort(); // 取消上一个请求
    }
    controller = new AbortController();
    const requestParams = sendWriteParams(params);
    //请求数据
    await fetchEventSource(baseURL + requestParams.url, {
      ...requestParams.params,
      signal: controller.signal,
      onmessage(event) {
        if (event) {
          const result = <WritingEventStreamMessage>JSON.parse(event.data);
          const chatData = [...store.state.chat.writeData];
          const curChat = typeof index === "number" ? chatData[index] : chatData.pop();
          if (!curChat) return;
          const res = formatWriteResult(result, curChat);
          if (typeof index === "number") {
            chatData.splice(index, 1, res);
            store.commit("chat/SET_WRITE_DATA", chatData);
          } else {
            store.commit("chat/SET_WRITE_DATA", [...chatData, res]);
          }
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
        refreshHistory && reloadSessionHistory().catch(console.error);
      },
      openWhenHidden: true,
    } satisfies FetchEventSourceInit);
  };

  // 不传index就当最后一项
  const writingStop = (index?: number) => {
    const data = store.state.chat.writeData;
    const curData = typeof index === "number" ? data[index] : data.pop();
    if (!curData) return;
    if (curData.answer.answerStatus !== undefined) return;
    controller?.abort("停止回答");
    curData.answer.answerStop = true;
    if (typeof index === "number") {
      data.splice(index, 1, curData);
      store.commit("chat/SET_WRITE_DATA", data);
    } else {
      store.commit("chat/SET_WRITE_DATA", [...data, curData]);
    }
    store.commit("chat/TOGGLE_STARTCHAT", false);
  };
  return {
    question,
    topicId,
    records,
    lastRecord,
    send,
    writingStop,
  };
}
