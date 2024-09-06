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
          <ResponseProgress hidden="p" title="数据解析" class="progress" :chatdata="item" :show="true" />
          <div>
            <!--            <ChatSkeleton v-if="!item.answer.answer" title="数据解析中" />-->
            <div v-if="item.answer.answer" class="answer-box">
              <AnswerBox
                :key="item?.recordId"
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
              >
                <template #rebuild>
                  <OperationWrapper @click="rebuildChat(item.question)">
                    <Refresh />
                  </OperationWrapper>
                </template>
              </AnswerBox>
            </div>
          </div>
        </div>
        <div v-show="!showDrawer" class="chat-question-right"></div>
      </div>
    </div>
    <div class="chat-input" :style="{ width: pdfData.chatInputWidth }">
      <ChatInput class="chat-input-inner" />
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
import useDataAnalysis, { DataAnalysisParams } from "@/client/hooks/useDataAnalysis";
import { Refresh } from "@element-plus/icons-vue";
import { getCheckedFile } from "@/client/hooks/sendAnalysisParams";
import { ElMessage } from "element-plus";
import prepareDataAnalysis from "@/store/hooks/prepareDataAnalysis";
import OperationWrapper from "@/client/views/intelligentQA/components/OperationWrapper.vue";

const { showDrawer } = useDrawer();
const { sendDataAnalysis } = useDataAnalysis();
const chatData = computed(() => store.state.chat.dataAnalysisData);
const chatId = computed(() => store.state.chat.chat_id);

const pdfData = computed(() => {
  const showDrawer = store.state.chat.showDrawer;
  const chatInputWidth = showDrawer ? "100%" : "calc(100% - 300px)";
  return { showDrawer, chatInputWidth };
});

const rebuildChat = async (question: string) => {
  const { files, hasOtherFileType } = getCheckedFile(["xlsx", "csv"]);
  if (files.length <= 0 || hasOtherFileType) return ElMessage.error("仅支持xlsx和csv格式文件");
  const lastChat = chatData.value.pop();
  store.commit("chat/TOGGLE_STARTCHAT", true);
  store.commit("chat/SET_IS_STOP", false);
  store.commit("chat/SET_DATA_ANALYSIS_DATA", [
    ...chatData.value,
    {
      ...lastChat,
      question,
      answer: {
        isProgress: false,
        answerStop: false,
        progress: [],
      },
    },
  ]);
  const params: DataAnalysisParams = { query: question, files };
  if (chatId.value) params.topic_id = chatId.value;
  await sendDataAnalysis(params);
};
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

.divide {
  width: 100%;
  height: 1px;
  margin: 48px auto 0;
  background-color: #e0e4f1;
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
    padding-top: 5px;
    position: sticky;
    top: 20px;

    .atlas {
      height: 200px;
      margin-top: theme.$margin-sm;
    }

    .stock {
      padding-top: theme.$padding-sm;
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

.outline {
  margin-top: 100px;
  margin-left: 8px;
  position: sticky;
  top: 20px;
}
</style>
