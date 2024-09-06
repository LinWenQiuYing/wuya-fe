<template>
  <div v-show="showDrawer" :class="$style.preview">
    <div :class="$style.header">
      <div :class="$style.title">图谱预览</div>
      <button :class="$style.button" title="关闭" @click="closeDrawer">
        <Close :class="$style.close" />
      </button>
    </div>
    <div :class="$style.content">
      <iframe
        ref="atlasRef"
        style="width: 100%; height: 100%; border: none"
        :src="iframeUrl"
        name="kge"
        @load="handleIframeLoad(cmd)"
      ></iframe>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, watch, ref, onMounted, onBeforeUnmount } from "vue";
import { Close } from "@element-plus/icons-vue";
import useDrawer from "@/client/hooks/useDrawer";
import useClearChat from "@/store/hooks/useClearChat";
import useSendQuestion from "@/client/hooks/useSendQuestion";
import useHistoryType from "@/client/layout/useHistoryType";
import useGetHistoryChat from "@/client/hooks/useGetHistoryChat";
import { baseURL } from "@/config";
import store from "@/store";

let messageEventListener: any = null;
const { clearChat } = useClearChat();
const { send } = useSendQuestion();
const type = useHistoryType();
const { getHistoryChats } = useGetHistoryChat();
const cmd = computed(() => store.state.chat.cmd);
const atlasRef = ref();
const { showDrawer, closeDrawer } = useDrawer();
const iframeUrl = computed(() => {
  const name = store.state.chat.graphName;
  return `${baseURL}/manager/home#/newQuery?graph.name=${name}&&enable.embedded=true&&only.show.graph=true`;
});

const handleIframeLoad = (value: string) => {
  atlasRef.value.contentWindow.postMessage(
    JSON.stringify({
      type: "query",
      cmd: `${value};`,
    }),
  );
};
const sendQuery = async (query: string) => {
  clearChat();
  store.commit("chat/SET_QUESTION", query);
  store.commit("chat/SET_CHAT_DATA", [
    {
      question: query,
      answer: {
        isProgress: false,
        answerStop: false,
        progress: [],
      },
    },
  ]);
  await send({ query }).then(() => getHistoryChats(type.value, 1, false));
};

onMounted(() => {
  messageEventListener = (e: any) => {
    const data = typeof e.data === "string" ? JSON.parse(e.data) : e.data;
    if (data?.type === "clickCompany") {
      sendQuery(data.value);
    }
  };
  window.addEventListener("message", messageEventListener);
});

onBeforeUnmount(() => {
  if (messageEventListener) {
    window.removeEventListener("message", messageEventListener);
  }
});

watch(
  () => cmd.value,
  (value) => {
    if (value) {
      handleIframeLoad(value);
    }
  },
);
</script>

<style lang="scss" module>
@use "src/styles/theme";

.preview {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.header {
  height: 48px;
  padding: 0 theme.$padding-sm 0 theme.$padding-md;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.title {
  flex: 1;
  font-size: theme.$font-size-xl;
  font-weight: 700;
}

.button {
  display: flex;
  width: 30px;
  height: 30px;
  align-items: center;
  justify-content: center;
  border: 0 none;
  padding: 0;
  background-color: white;

  &:hover {
    .close {
      color: theme.$color-primary;
    }
  }
}

.close {
  width: 18px;
  height: 18px;
}

.content {
  height: calc(100% - 48px);
  width: 100%;
}
</style>
