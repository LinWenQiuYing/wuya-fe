<!-- 推荐问题 -->
<template>
  <div class="question-wrapper" @click="() => onClick(data)">
    <div class="question-content" :title="data">
      {{ data }}
    </div>
    <Right class="right-icon" />
  </div>
</template>

<script setup lang="ts">
import useSendQuestion from "@/client/hooks/useSendQuestion";
import { Right } from "@element-plus/icons-vue";
import store from "@/store";
import { useRoute } from "vue-router";
import { computed } from "vue";
import { ChatParams } from "@/client/types/api";
import router from "@/router";
import prepareChat from "@/store/hooks/prepareChat";
import { AideKey } from "@/client/const";

const props = defineProps<{
  data: string;
  click?: (query: string) => void;
}>();

const { send } = useSendQuestion();

const chatId = computed(() => store.state.chat.chat_id);
const isChat = computed(() => store.state.chat.isStartChat);
const isStop = computed(() => store.state.chat.isStop);
const route = useRoute();

const onClick = async (query: string) => {
  if (props.click) {
    props.click(query);
    return;
  }
  isChat.value && stop();
  prepareChat(query);
  const newsId = <string>route.params.newId;
  if (!route.path.startsWith("/qa")) {
    await router.push("/qa?backtrack=store");
  }
  const params: ChatParams = {
    query,
    sourceNewsId: newsId,
    chat_agent: AideKey.NO_AGENT,
  };
  //上次对话仍再继续则先关闭
  if (!isStop.value && chatId.value) params.topic_id = chatId.value;
  await send(params, !chatId.value);
};
</script>

<style lang="scss" scoped>
@import "src/styles/theme";
@import "src/styles/mixins";

.question-wrapper {
  height: 50px;
  max-width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;

  & + & {
    border-top: 1px solid #e0e1e5;
  }

  .question-content {
    flex: 1;
    font-size: 16px;
    color: $text-color-primary;
    @include hide-lines(1);
    cursor: pointer;
  }

  .right-icon {
    flex: 0 0 20px;
    width: 20px;
    height: 20px;
    cursor: pointer;
  }
}
</style>
