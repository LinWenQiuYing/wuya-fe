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
          <ResponseProgress hidden="p" title="写作需求解读" class="progress" :chatdata="item" />
          <div v-if="!('preCheckConfirms' in item.answer)">
            <ChatSkeleton v-if="!item.answer.llm_output && !item.answer.answerStop" title="生成中" />
            <div v-else>
              <References
                v-show="!!item.answer.reference"
                class="references"
                :reference="item.answer.reference"
                :chat-position="index"
              />
              <div class="answer-box">
                <AnswerBox
                  :key="item?.answer.recordId"
                  :reference="item.answer.reference"
                  :show-operation="item.answer.answerStatus === 1"
                  :show-refresh="false"
                  :index="index"
                  :is-stop="item.answer.answerStop"
                  class="answer-box-inner"
                  data-hidden="h5,h6"
                  :content="item.answer.llm_output"
                  :record-id="item?.answer.recordId"
                  :comment-on="item?.commentOn"
                  :comment="item?.comment"
                />
              </div>
            </div>
          </div>
        </div>
        <div v-show="!showDrawer" class="chat-question-right">
          <div class="right-sticky">
            <SurveySidebar :data="item" />
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
import ChatSkeleton from "@/client/components/ChatSkeleton.vue";
import { computed } from "vue";
import store from "@/store";
import ChatInput from "./InputBox.vue";
import References from "@/client/views/intelligentQA/components/References.vue";
import useDrawer from "@/client/hooks/useDrawer";
import SurveySidebar from "@/client/views/survey/components/SurveySidebar.vue";

const { showDrawer } = useDrawer();
const chatData = computed(() => store.state.chat.surveyData);
const pdfData = computed(() => {
  const showDrawer = store.state.chat.showDrawer;
  const chatInputWidth = showDrawer ? "100%" : "calc(100% - 300px)";
  return { showDrawer, chatInputWidth };
});
</script>

<style lang="scss" scoped>
@import "src/styles/theme";

.chat-box {
  width: 100%;
  max-width: 100%;
  height: 100%;
  position: relative;
}

.chat-items {
  min-height: calc(100% - 40px);

  .chat-box-item {
    display: flex;
    margin-bottom: 30px;
  }

  .last-chat {
    min-height: 50vh;
  }
}

.divide {
  width: 100%;
  height: 1px;
  margin: 48px auto 0;
  background-color: #e0e4f1;
}

.chat-question-left {
  flex: 1;
  width: calc(100% - 300px);
  padding: 4px $padding-md;

  .progress {
    margin-top: $margin-md;
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
  width: 300px;
  padding: var(--padding);
  position: relative;

  .sticky-wrapper {
    padding-top: 5px;
    position: sticky;
    top: 20px;

    .atlas {
      height: 200px;
      margin-top: $margin-sm;
    }

    .stock {
      padding-top: $padding-sm;
    }
  }

  .close-btn {
    position: absolute;
    top: 0;
    left: -26px;
    padding: 15px 5px;
    background-color: #fff;
    border-radius: 8px 0 0 8px;

    .close-btn-icon {
      width: 16px;
      height: 16px;
    }
  }
}

.chat-question {
  color: $text-color-primary;
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
  padding: 0 $padding-md;
  z-index: 10;
  /* background-color: $background-color-light; */
  bottom: 0;

  .chat-bottom {
    padding-top: 27px;
    height: 48px;
    text-align: center;
    font-size: $font-size-sm;
    color: $text-color-secondary;
    background: linear-gradient(to top, #fff 0%, #fff 33%, transparent 100%);
  }
}

.related-problem {
  margin-top: 20px;
  border-top: 1px solid #e0e1e5;
  padding-top: 20px;
}

.divider {
  width: 100%;
  height: 1px;
  background-color: #e0e4f1;
}

.right-sticky {
  position: sticky;
  top: 40px;
}

.outline {
  margin-top: 20px;
}
</style>
