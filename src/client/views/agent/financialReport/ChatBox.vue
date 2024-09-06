<template>
  <div class="chat-box">
    <div class="chat-items">
      <div
        v-for="(item, index) in chatData"
        :key="index"
        class="chat-box-item"
        :class="{ 'last-chat': chatData?.length - 1 === index }"
      >
        <div class="chat-question-left">
          <h2 v-show="item?.question" class="chat-question">{{ item?.question }}</h2>
          <ResponseProgress hidden="p" title="财务解析" class="progress" :chatdata="item" :show="true" />
          <div v-if="item.answer.answer" class="answer-box">
            <AnswerBox
              :reference="item.answer.reference"
              :show-operation="item.answer.answerStatus === 1"
              :show-refresh="false"
              :hidden-rebuild="true"
              :index="index"
              :is-stop="item.answer.answerStop"
              class="answer-box-inner"
              data-hidden="h5,h6"
              :content="item.answer.answer"
              :record-id="item?.recordId"
              :comment-on="item?.commentOn"
              :comment="item?.comment"
            />
          </div>
        </div>
        <div v-show="!showDrawer" class="chat-question-right">
          <div class="sticky-wrapper">
            <Sidebar :data="item" />
          </div>
        </div>
      </div>
    </div>
    <div class="chat-input" :style="{ width: pdfData.chatInputWidth }">
      <ChatInput />
      <div class="chat-bottom">内容由AI生成，仅供参考</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import AnswerBox from "@/client/views/intelligentQA/components/AnswerBox.vue";
import ResponseProgress from "@/client/views/intelligentQA/components/ResponseProgress.vue";
import { computed } from "vue";
import store from "@/store";
import ChatInput from "./InputBox.vue";
import useDrawer from "@/client/hooks/useDrawer";
import Sidebar from "./Sidebar.vue";

const { showDrawer } = useDrawer();
const chatData = computed(() => store.state.chat.financialReportData);
const chatId = computed(() => store.state.chat.chat_id);

const pdfData = computed(() => {
  const showDrawer = store.state.chat.showDrawer;
  const chatInputWidth = showDrawer ? "100%" : "calc(100% - 300px)";
  return { showDrawer, chatInputWidth };
});
</script>

<style lang="scss" scoped>
@use "src/styles/theme";

.chat-box {
  width: 100%;
  height: 100%;
  position: relative;
}

.chat-items {
  min-height: calc(100% - 40px);
  width: 100%;

  .chat-box-item {
    display: flex;
    margin-bottom: 30px;
  }

  .last-chat {
    min-height: 50vh;
  }
}

.chat-question-left {
  flex: 1;
  width: calc(100% - 300px);
  padding: 4px theme.$padding-md;

  .progress {
    margin-top: theme.$margin-md;
    width: 100%;

    &:deep(.title-wrapper) {
      font-size: 16px;
    }
  }

  .references {
    margin-top: 20px;
  }
}

.chat-question-right {
  flex: 0 0 300px;
  width: 300px;
  padding: var(--padding);
  position: relative;

  .sticky-wrapper {
    margin-left: 8px;
    margin-top: 23px;
    position: sticky;
    top: 40px;
  }
}

.chat-question {
  color: theme.$text-color-primary;
  font-size: 28px;
  line-height: 1.4;
  white-space: pre-wrap;
  word-break: break-all;
  margin: 14px 0 0;
  font-weight: bold;
  text-align: justify;
}

.answer-box {
  margin-top: 20px;
}

.chat-input {
  position: sticky;
  padding: 0 theme.$padding-md;
  z-index: 10;
  /* background-color: $background-color-light; */
  bottom: 0;

  .chat-bottom {
    padding-top: 27px;
    height: 48px;
    text-align: center;
    font-size: theme.$font-size-sm;
    color: theme.$text-color-secondary;
    background: linear-gradient(to top, #fff 0%, #fff 33%, transparent 100%);
  }
}
</style>
