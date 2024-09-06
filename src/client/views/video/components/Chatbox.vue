<template>
  <div :class="['chat-box-pc', 'chat-box']">
    <div class="chat-items">
      <div
        v-for="(item, index) in chatData"
        :key="index"
        :class="{ 'last-chat': chatData?.length - 1 === index }"
        class="chat-box-item"
      >
        <div class="answer-text">
          <h2 class="chat-question">{{ item?.question }}</h2>
          <ResponseProgress hidden="h1" title="问题解读" class="progress" :chatdata="item" />
          <ChatSkeleton v-if="!item.answer.text && !item.answer.reference && !item.answer.answerStop" />
          <div v-else>
            <References
              v-show="!!item.answer.reference"
              class="references"
              :reference="item.answer.reference"
              :chat-position="index"
            />
            <div class="answer-box">
              <AnswerBox
                :key="item?.recordId"
                :reference="item.answer.reference"
                :show-operation="item.answer.answerStatus === 1"
                :show-refresh="isShowRefresh(index)"
                class="answer-box-inner"
                hidden="h1,h2,h4,h5,h6"
                :index="index"
                :agent-type="item.answer.agentType"
                :is-stop="item.answer.answerStop ?? false"
                :content="item.answer.text"
                :question="item?.question"
                :record-id="item?.recordId"
                :comment-on="item?.commentOn"
                :comment="item?.comment"
              />
            </div>
            <RelatedProblem
              v-if="item.answer.query"
              class="related-problem"
              :questions="item.answer.query"
              :send="onClickSend"
              title="相关问题"
            />
          </div>
          <div v-if="isDivide(chatData.length, index)" class="divide"></div>
        </div>
        <div v-show="!pdfData.showDrawer" class="answer-media"></div>
      </div>
    </div>

    <div class="chat-input" :style="{ width: pdfData.chatInputWidth }">
      <ChatInput class="chat-input-inner" />
      <div class="chat-bottom">内容由AI生成，仅供参考</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import ChatSkeleton from "@/client/components/ChatSkeleton.vue";
import store from "@/store";
import { computed } from "vue";
import ResponseProgress from "@/client/views/intelligentQA/components/ResponseProgress.vue";
import ChatInput from "./InputBox.vue";
import References from "@/client/views/intelligentQA/components/References.vue";
import RelatedProblem from "@/client/views/intelligentQA/components/RelatedProblem.vue";
import AnswerBox from "@/client/views/intelligentQA/components/AnswerBox.vue";
import formatInputText from "@/client/utils/formatInputText";
import prepareVideo from "@/store/hooks/prepareVideo";
import useSendVideoQuery, { VideoParams } from "@/client/views/video/components/useSendVideoQuery";

const { stopService, send } = useSendVideoQuery();
const chatData = computed(() => store.state.chat.videoData); // 问答数据
const chatId = computed(() => store.state.chat.chat_id);
const isStop = computed(() => store.state.chat.isStop);
const pdfData = computed(() => {
  const showDrawer = store.state.chat.showDrawer;
  const chatInputWidth = showDrawer ? "100%" : "calc(100% - 300px)";
  return { showDrawer, chatInputWidth };
});
// 是否显示重新问答
const isShowRefresh = (index: number) => {
  if (chatData.value.length <= 1) {
    return true;
  } else if (index > 1) {
    return true;
  }
  return false;
};
// 是否显示分割线
const isDivide = (length: number, index: number) => {
  return length > 1 && index + 1 < length;
};

const onClickSend = async (query: string) => {
  if (store.state.chat.isStartChat) stopService();
  const fixedQuestion = formatInputText(query);
  if (!fixedQuestion) return;
  prepareVideo(fixedQuestion);
  const params: VideoParams = {
    query: fixedQuestion,
  };
  if (!isStop.value && chatId.value) params.topic_id = chatId.value;
  await send(params, !chatId.value);
};
</script>

<style lang="scss" scoped>
@import "src/styles/theme";

.chat-box-pc.chat-box {
  width: 100%;
  height: 100%;
  position: relative;
}

.chat-box-pc {
  .chat-items {
    min-height: calc(100% - 40px);
  }

  .chat-box-item {
    display: flex;
    margin-bottom: 30px;
  }

  .last-chat {
    min-height: 50vh;
  }

  .chat-question {
    color: $text-color-primary;
    font-size: 28px;
    line-height: 1.4;
    white-space: pre-wrap;
    word-break: break-all;
    font-weight: bold;
    text-align: justify;
    flex: 1;
  }

  .chat-question-return {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-start;
    background: #f0f2f7;
    border-radius: 8px;
    padding: 11px 16px;
    margin-bottom: 10px;

    &-btn {
      width: 100%;
      height: 22px;
      display: flex;
      color: #6d7587;
      cursor: pointer;
      font-size: 12px;
      align-items: center;
      margin-bottom: 2px;
      user-select: none;

      svg {
        width: 16px;
        height: 16px;
        margin-right: 2px;
      }
    }

    &-question {
      font-size: 16px;
      color: #2d364d;
      line-height: 24px;
      font-weight: 700;
    }
  }

  .answer-text {
    flex: 1;
    width: 100%;
    padding-right: 24px;
  }

  .chat-question-title {
    display: flex;
    flex-wrap: wrap;
  }
}

.question-wrapper {
  display: flex;
  align-items: center;
  margin: 14px 0 0;

  .chat-agent-icon {
    width: 30px;
    margin-right: 10px;
  }
}

.divide {
  width: 100%;
  height: 1px;
  margin: 48px auto 0;
  background-color: #e0e4f1;
}

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

.answer-media {
  width: 300px;
  padding: var(--padding);
  position: relative;

  .sticky-wrapper {
    padding-top: 5px;
    position: sticky;

    .atlas {
      height: 200px;
      margin-top: $margin-sm;
    }

    .stock {
      padding-top: $padding-sm;
    }
  }
}

.answer-box {
  margin-top: 20px;
}

.chat-input {
  position: sticky;
  padding-right: $padding-xl;
  bottom: 0;
  z-index: 10;

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
</style>
