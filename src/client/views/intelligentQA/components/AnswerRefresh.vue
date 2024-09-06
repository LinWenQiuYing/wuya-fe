<template>
  <el-popover placement="top" :width="160" :offset="0" :show-arrow="false">
    <template #default>
      <span v-for="(item, index) in models" :key="index" :class="$style.popover" @click="onClick(item.code)">
        <CubeIcon :class="$style.model_icon" />
        <span :class="$style.label" :title="item.description">{{ item.name }}</span>
      </span>
    </template>
    <template #reference>
      <OperationWrapper title="重新生成">
        <Refresh />
      </OperationWrapper>
    </template>
  </el-popover>
</template>
<script setup lang="ts">
import { Refresh } from "@element-plus/icons-vue";
import CubeIcon from "@/client/icons/cube.svg";
import useModels from "@/store/hooks/useModels";
import store from "@/store";
import { ChatParams } from "@/client/types/api";
import { computed } from "vue";
import useSendQuestion from "@/client/hooks/useSendQuestion";
import OperationWrapper from "@/client/views/intelligentQA/components/OperationWrapper.vue";

const props = defineProps<{
  question: string;
}>();

const models = useModels();
const chatId = computed(() => store.state.chat.chat_id);
const chatData = computed(() => store.state.chat.chatData);
const { send } = useSendQuestion();

const onClick = (chat_model: string) => {
  const lastChat = chatData.value.pop();
  store.commit("chat/SET_CHAT_DATA", [
    ...chatData.value,
    {
      ...lastChat,
      question: props.question,
      answer: {
        isProgress: false,
        answerStop: false,
        agentType: lastChat.answer.agentType,
        progress: [],
      },
    },
  ]);
  const params: ChatParams = { query: props.question!, chat_model };
  if (chatId.value) params.topic_id = chatId.value;
  send(params, !chatId.value).catch(console.error);
};
</script>
<style module lang="scss">
@use "src/styles/theme";

.popover {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: theme.$padding-xss;

  &:hover {
    background: #e6f5ff;
    border-radius: 8px;
  }
}

.model_icon {
  flex: 0 0 20px;
  height: 22px;
  fill: theme.$text-color-primary;
}

.label {
  font-size: 14px;
  line-height: 22px;
  color: theme.$text-color-primary;
}
</style>
