<template>
  <div class="input-box">
    <StopButton v-if="!isStop && isChat" class="stop-button" @click="onClickStop" />
    <div class="chat-input">
      <div class="textarea-wrapper">
        <el-input
          v-model="question"
          class="input-textarea"
          :input-style="{ fontSize: '14px' }"
          type="textarea"
          :autosize="{ maxRows: 5 }"
          resize="none"
          maxlength="1000"
          placeholder="继续追问"
          @keydown.enter.prevent.exact="(e: KeyboardEvent) => handleKeyEnter(e, onClickSend)"
          @keydown.shift.enter.prevent.exact="handleShiftEnter"
        />
      </div>
      <div class="chat-input-right">
        <el-button :disabled="isCanSend" class="send-icon" @click="onClickSend">
          <AirplaneIcon />
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import StopButton from "@/client/components/StopButton.vue";
import { computed, ref } from "vue";
import store from "@/store";
import AirplaneIcon from "@/client/icons/airplane.svg";
import formatInputText from "@/client/utils/formatInputText";
import prepareFinancialReport from "@/store/hooks/prepareFinancialReport";
import useFinancialReport from "@/client/hooks/useFinancialReport";
import { ChatParams } from "@/client/types/api";
import { fileTypes, getSourcesFile } from "@/client/hooks/sendFinancialReportParams";
import { ElMessage } from "element-plus";
import handleKeyEnter from "@/client/utils/handleKeyEnter";

const { sendFinancialReport, stopFinancialReport } = useFinancialReport();

const isChat = computed(() => store.state.chat.isStartChat);
const isStop = computed(() => store.state.chat.isStop);
const question = ref<string>("");
const chatId = computed(() => store.state.chat.chat_id);

// 判断是否可以发送
const isCanSend = computed(() => !question.value || store.state.chat.isStartChat);

const onClickStop = () => {
  stopFinancialReport();
  store.commit("chat/SET_IS_STOP", true);
};
const handleShiftEnter = () => {
  question.value = question.value + "\n";
};
const onClickSend = async () => {
  if (store.state.chat.isStartChat) return;
  const { sources, hasOtherFileType } = getSourcesFile(fileTypes);
  if (sources.length <= 0 || hasOtherFileType)
    return ElMessage.error(
      "请勾选包含资产负债表、利润表和现金流量表的年度财报或季度财报，格式为PDF或者Excel",
    );
  const fixedQuestion = formatInputText(question.value);
  if (!fixedQuestion) return;
  prepareFinancialReport(fixedQuestion, false);
  const params = {
    query: fixedQuestion,
    sources,
  } as ChatParams;
  if (!isStop.value && chatId.value) params.topic_id = chatId.value;
  question.value = "";
  await sendFinancialReport(params);
};
</script>

<style lang="scss" scoped>
@import "src/styles/theme";
@import "src/styles/mixins";

.input-box {
  display: flex;
  align-items: center;

  .stop-button {
    flex: 0 0 36px;
    width: 36px;
    height: 36px;
    margin-right: $margin-md;
  }

  .chat-input {
    flex: 1;
    display: flex;
    align-items: flex-end;
    background: $color-white;
    border: 3px solid #dddfe3;
    border-radius: 28px;
    min-height: 50px;
    max-height: 182px;
    padding: 0 $padding-md;

    .icon-wrapper {
      flex: 0 0 16px;
      height: 50px;
      display: flex;
      align-items: center;

      .add-icon {
        width: 16px;
        height: 16px;
      }

      .add-box {
        display: grid;
        place-items: center;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        cursor: pointer;
        background-color: #ecedf0;

        &:hover {
          .cat-list-icon {
            color: #306bec;
          }
        }

        .cat-list-icon {
          flex: 0 0 16px;
          width: 13px;
          height: 15px;
        }
      }
    }

    .chat-input-right {
      flex: 0 0 80px;
      width: 80px;
      height: 50px;
      display: flex;
      align-items: center;
      justify-content: flex-end;

      .send-icon {
        flex: 0 0 32px;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        background-color: $color-primary;
        display: flex;
        align-items: center;
        justify-content: center;

        svg {
          height: 16px;
          fill: $color-white;
        }

        &:hover {
          background-color: $color-primary;
        }
      }
    }

    .textarea-wrapper {
      flex: 1;
      min-height: 50px;
      display: flex;
      align-items: center;
      padding: 4px 0;

      .input-textarea {
        flex: 1;

        textarea {
          resize: none;
          border: none;
          outline: none;
          box-shadow: none;
          min-height: 40px !important;
          font-size: $font-size-base;
          color: $text-color-primary;
          white-space: pre-line;
          word-break: break-all;
          font-weight: 400;
          overflow: auto;

          ::-webkit-input-placeholder {
            color: $text-color-secondary;
          }

          :-moz-placeholder {
            color: $text-color-secondary;
          }
        }
      }
    }
  }
}

:deep(.el-textarea__inner) {
  box-shadow: none;
  padding-right: 0;
  color: $text-color-primary;
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
  ::-webkit-scrollbar {
    display: none;
  }

  &:focus {
    box-shadow: none;
  }

  &:hover {
    box-shadow: none;
  }
}

.upload-title {
  height: 35px;
  line-height: 35px;
  border-bottom: 1px solid #e0e1e5;
  padding: 0 12px;
}

.list-content {
  li {
    display: flex;
    height: 45px;
    align-items: center;
    padding: 0 12px;
  }

  .pdf_icon {
    width: 16px;
    height: 16px;
    line-height: 16px;
  }

  .text {
    flex: 1;
    line-height: 1;
    @include hide-lines();
  }
}

.fail-icon {
  color: $red_color;
}

.success-color {
  color: $green_color;
}
</style>

<style lang="scss" scoped>
:deep(.upload .el-upload-dragger) {
  display: flex;
  align-items: center;
  border: none;
  padding: 0;
}
</style>
