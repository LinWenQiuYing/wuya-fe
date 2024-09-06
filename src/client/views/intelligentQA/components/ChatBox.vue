<template>
  <div class="chat-box" :class="isMobile ? 'chat-box-h5' : 'chat-box-pc'">
    <div class="chat-items">
      <div
        v-for="(item, index) in chats"
        :key="index"
        :class="{ 'last-chat': chatData?.length - 1 === index }"
        class="chat-box-item"
      >
        <div class="answer-text">
          <H5ChatHeader
            v-if="isMobile"
            class="chat-question-title"
            :show-collect="index === 0"
            :question="item.question"
          >
            <ViewImg
              v-if="agentImgSrc.has(item.answer.agentType!)"
              :src="agentImgSrc.get(item.answer.agentType!)![1]"
              class="chat-agent-icon"
            />
          </H5ChatHeader>
          <div v-else class="chat-question-title">
            <div v-show="backtrack && index === 0" class="chat-question-return" @click="onBack">
              <span class="chat-question-return-btn"><Back />返回至</span>
              <span class="chat-question-return-question">{{ chatData[0].question }}</span>
            </div>
            <div v-show="item?.question" class="question-wrapper">
              <ViewImg
                v-if="agentImgSrc.has(item.answer.agentType!)"
                :src="agentImgSrc.get(item.answer.agentType!)!.square"
                class="chat-agent-icon"
              />
              <h2 class="chat-question">{{ item?.question }}</h2>
            </div>
          </div>
          <ResponseProgress
            hidden="h1"
            :title="getAgentItem(item.answer.agentType)?.progressTitle || '问题解读'"
            :show="[AideKey.DATA_ANALYSIS, AideKey.FINANCIAL_ANALYSIS].includes(item.answer.agentType)"
            class="progress"
            :chatdata="item"
          />
          <ChatSkeleton v-if="showChatSkeleton(item.answer)" />
          <div v-else-if="!('preCheckConfirms' in item.answer)">
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
                :agent-type="item.answer.agentType!"
                :show-operation="item.answer.answerStatus === 1"
                :show-refresh="isShowRefresh(index)"
                :hidden-rebuild="item.answer.agentType === AideKey.DATA_ANALYSIS"
                :hidden-vote="['news'].includes(activeModule)"
                class="answer-box-inner"
                hidden="h1,h2,h4,h5,h6"
                :index="index"
                :is-stop="item.answer.answerStop ?? false"
                :content="getContent(item)"
                :question="item?.question"
                :record-id="item?.recordId"
                :comment-on="item?.commentOn"
                :comment="item?.comment"
              >
                <template v-if="item.answer.agentType === AideKey.DATA_ANALYSIS" #rebuild>
                  <div class="operation" @click="rebuildChat(item.question)">
                    <Refresh class="operation_icon" />
                    <span class="title">重新生成</span>
                  </div>
                </template>
              </AnswerBox>
            </div>
            <RelatedProblem
              v-if="item.answer.query"
              class="related-problem"
              :questions="item.answer.query"
              :title="item.answer.agentType === AideKey.CUSTOMER_SERVICE ? '大家还在搜' : '相关问题'"
            />
          </div>
          <div v-if="isDivide(chats.length, index)" class="divide"></div>
        </div>
        <div v-if="!isMobile" v-show="!pdfData.showDrawer" class="answer-media">
          <div class="sticky-wrapper">
            <StickyFilter :chat-record="item" />
          </div>
        </div>
      </div>
    </div>
    <div v-if="isMobile" class="footer">
      <ChatInput />
      <div class="tips">内容由AI生成，仅供参考</div>
    </div>
    <div v-else class="chat-input" :style="{ width: pdfData.chatInputWidth }">
      <ChatInput />
      <div class="chat-bottom">内容由AI生成，仅供参考</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import ChatSkeleton from "@/client/components/ChatSkeleton.vue";
import useSendQuestion from "@/client/hooks/useSendQuestion";
import ChatInput from "./ChatInputBox.vue";
import RelatedProblem from "./RelatedProblem.vue";
import store from "@/store";
import { Back, Refresh } from "@element-plus/icons-vue";
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import AnswerBox from "./AnswerBox.vue";
import References from "./References.vue";
import ResponseProgress from "./ResponseProgress.vue";
import { isMobile } from "@/config";
import getAgentItem from "@/client/utils/getAgentItem";
import { AideKey } from "@/client/const";
import StickyFilter from "@/client/views/intelligentQA/components/StickyFilter.vue";
import { AnalysisRecordState, ChatDataState, QaRecordState, VideoRecordState } from "@/client/types/chat";
import { ChatParams } from "@/client/types/api";
import { agentImgSrc } from "@/components/utils";
import ViewImg from "@/components/ViewImg.vue";
import H5ChatHeader from "@/client/views/intelligentQA/components/H5ChatHeader.vue";
import useActiveModule from "@/client/layout/useActiveModule";

const chatData = computed(() => store.state.chat.chatData); // 问答数据
const chatNewsId = computed(() => store.state.documentQA.newsId);
const { stop, send } = useSendQuestion();
const isStartChat = computed(() => store.state.chat.isStartChat);
const isStop = computed(() => store.state.chat.isStop);
const chatId = computed(() => store.state.chat.chat_id);
const router = useRouter();
const route = useRoute();
const backtrack = computed(() => route.query.backtrack);
const chats = computed(() => {
  const data = store.state.chat.chatData;
  if (backtrack.value) {
    return data.slice(1);
  } else if (route.path.startsWith("/new/")) {
    // 资讯详情页只展示资讯的解析-不带上后面的追问
    return data.slice(0, 1);
  }
  return data;
}); // 问答数据
const activeModule = useActiveModule();
const showChatSkeleton = (answer: ChatDataState["answer"]) => {
  // 数据分析不显示
  if (answer.agentType === AideKey.DATA_ANALYSIS) return false;
  if ("llm_output" in answer) return !answer.llm_output && !answer.reference && !answer.answerStop;
  if ("text" in answer) return !answer.reference && !answer.answerStop && !answer.text;
};

// 设置为 false: 只显示资讯的解析-不带上后面的追问
const onBack = async () => {
  // 先停止回答
  if (!isStop.value && isStartChat.value) {
    stop();
    store.commit("chat/SET_IS_STOP", true);
  }
  // 防止从历史进入的问答，没有chatNewsId的情况出现：历史收藏不存newsId
  if (chatNewsId.value) {
    await router.push(`/new/${chatNewsId.value}`);
  } else {
    await router.push(`/new/history`);
  }
};

const pdfData = computed(() => {
  const showDrawer = store.state.chat.showDrawer;
  const chatInputWidth = showDrawer ? "100%" : "calc(100% - 300px)";
  return { showDrawer, chatInputWidth };
});
// 是否显示重新问答
const isShowRefresh = (index: number) => {
  if (chats.value.length <= 1) {
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

const rebuildChat = async (question: string) => {
  const lastChat = chatData.value.pop();
  store.commit("chat/SET_CHAT_DATA", [
    ...chatData.value,
    {
      ...lastChat,
      question,
      answer: {
        agentType: AideKey.DATA_ANALYSIS,
        isProgress: false,
        answerStop: false,
        progress: [],
      },
    },
  ]);
  const params: ChatParams = { query: question, chat_agent: AideKey.DATA_ANALYSIS };
  if (chatId.value) params.topic_id = chatId.value;
  await send(params);
};

const getContent = (item: ChatDataState) => {
  if ([AideKey.DATA_ANALYSIS, AideKey.FINANCIAL_ANALYSIS].includes(item.answer.agentType))
    return (<AnalysisRecordState>item.answer).answer;
  if (item.answer.agentType === AideKey.VIDEO_PARSE) return (<VideoRecordState>item.answer).text;
  return (<QaRecordState>item.answer).llm_output;
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
    width: calc(100% - 300px);
    padding-right: 24px;
  }

  .chat-question-title {
    display: flex;
    flex-wrap: wrap;
  }
}

.question-wrapper {
  display: flex;
  align-items: start;
  margin: 14px 0 0;

  .chat-agent-icon {
    width: 28px;
    margin-right: 10px;
    margin-top: 5px;
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
    top: 40px;
    position: sticky;
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

.answer-box {
  margin-top: 20px;

  .operation {
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding-right: $padding-md;

    .operation_icon {
      width: 16px;
      fill: $color-primary;
    }

    &:hover {
      cursor: pointer;
      color: $color-primary;

      .operation_icon {
        fill: $color-primary;
      }
    }
  }
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

.chat-box-h5 {
  padding: 0 15px 72px;

  .chat-question-title {
    position: sticky;
    top: 0;
    z-index: 9;
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    margin-left: -15px;
    margin-right: -15px;
  }

  .chat-question {
    font-weight: 600;
    font-size: 20px;
    color: #2d364d;
    line-height: 28px;
    flex: 1;
    padding-top: 5px;
  }

  .footer {
    position: fixed;
    width: 100%;
    bottom: 10px;
    left: 0;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: center;

    .tips {
      padding-top: 10px;
      line-height: 15px;
      text-align: center;
      font-size: 11px;
      color: #b3b9c7;
    }
  }

  .related-problem:nth-last-child {
    padding-bottom: 60px;
  }
}
</style>
