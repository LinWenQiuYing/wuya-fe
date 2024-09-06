<template>
  <div class="input-warp">
    <div
      class="agent-select"
      :style="{
        width: !isStop && isStartChat ? 'calc(100% - 50px)' : '100%',
      }"
    >
      <AgentSelect
        v-if="agentList.length"
        v-model="question"
        v-model:query="question"
        v-model:visible="agentListVisible"
        :list="agentList"
      />
    </div>
    <div class="input-box">
      <StopButton v-if="!isStop && isStartChat" class="stop-button" @click="onClickStop" />
      <div :class="['query-box', checkAgent ? 'agent-radius' : 'chat-radius']">
        <CheckAgent is-agent />
        <div class="chat-input">
          <div v-if="activeModule === 'qa'" class="icon-wrapper">
            <CurriedUpload v-if="!uploadFile.name" @change="submitUpload">
              <CirclePlus class="add-icon" />
            </CurriedUpload>
            <el-popover v-else :width="320" placement="top-start" trigger="hover" popper-style="padding: 0;">
              <div class="upload-title">附件文件</div>
              <ul class="list-content">
                <li>
                  <span class="text"
                    >{{ uploadFile.name }} <span v-if="uploadFile.state">{{ getFilesNumStr() }}</span></span
                  >
                  <el-icon v-if="uploadFile.state === UploadState.FAIL" class="pdf_icon">
                    <DeleteFilled class="fail-icon" @click.stop="clearFile" />
                  </el-icon>
                  <el-icon v-if="uploadFile.state === UploadState.UPLOADING" class="is-loading pdf_icon">
                    <Loading />
                  </el-icon>
                  <el-icon v-if="uploadFile.state === UploadState.SUCCESS" class="pdf_icon">
                    <SuccessFilled class="success-color" />
                  </el-icon>
                </li>
              </ul>
              <template #reference>
                <div class="add-box">
                  <CurriedUpload @change="submitUpload">
                    <DocumentAdd class="cat-list-icon" />
                  </CurriedUpload>
                </div>
              </template>
            </el-popover>
          </div>
          <div class="textarea-wrapper">
            <el-input
              v-model="question"
              class="input-textarea"
              :input-style="{ fontSize: '14px' }"
              type="textarea"
              :autosize="{ maxRows: 5 }"
              resize="none"
              maxlength="1000"
              :placeholder="textPlaceholder"
              @input="handleChange"
              @keydown.enter.prevent.exact="(e: KeyboardEvent) => handleKeyEnter(e, sendQuestion)"
              @keydown.shift.enter.prevent.exact="handleShiftEnter"
            />
          </div>
          <SendButtonFilter>
            <template #survey>
              <SurveySendButton ref="surveyBtn" :disabled="isCanSend" :send="onClickSend" />
            </template>
            <template #audit>
              <div class="chat-input-right">
                <AuditSendButton ref="auditBtn" :send-disabled="isCanSend" :send="onClickSend" />
              </div>
            </template>
            <template #default>
              <div class="chat-input-right">
                <el-button :disabled="isCanSend" class="send-icon" @click.prevent="sendQuestion">
                  <AirplaneIcon />
                </el-button>
              </div>
            </template>
          </SendButtonFilter>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CirclePlus, DeleteFilled, DocumentAdd, Loading, SuccessFilled } from "@element-plus/icons-vue";
import StopButton from "../../../components/StopButton.vue";
import useSendQuestion from "@/client/hooks/useSendQuestion";
import { computed, reactive, ref } from "vue";
import { ChatParams } from "@/client/types/api";
import { ElMessage } from "element-plus";
import { UploadState } from "@/client/types";
import useTree from "@/client/hooks/useTree";
import { uploadFiles } from "@/client/api/knowSource";
import { batchProgress } from "@/api/knowledgeRequst";
import useActiveModule from "@/client/layout/useActiveModule";
import AirplaneIcon from "@/client/icons/airplane.svg";
import { StatusNumber } from "@/admin/view/knowledgeBase/const";
import CurriedUpload from "@/client/components/CurriedUpload.vue";
import getNamesSummary from "@/client/utils/getNamesSummary";
import store from "@/store";
import { useRoute } from "vue-router";
import formatInputText from "@/client/utils/formatInputText";
import router from "@/router";
import AgentSelect from "@/client/components/AgentSelect.vue";
import CheckAgent from "@/client/components/CheckAgent.vue";
import prepareChat from "@/store/hooks/prepareChat";
import { AideKey, aideList } from "@/client/const";
import SurveySendButton from "@/client/components/SurveySendButton.vue";
import beforeConfirm from "@/client/hooks/beforeConfirm";
import verifyDoc from "@/client/hooks/verifyDoc";
import verifySurveyOrAuditCount from "@/client/hooks/verifySurveyOrAuditCount";
import SendButtonFilter from "@/client/components/SendButtonFilter.vue";
import AuditSendButton from "@/client/components/AuditSendButton.vue";
import handleKeyEnter from "@/client/utils/handleKeyEnter";

const route = useRoute();
const { isCheckSource } = useTree();
const { stop, send } = useSendQuestion();
const activeModule = useActiveModule();
const { refreshPerson, checkNodes, getPrivateTreeNode } = useTree();
const isStartChat = computed(() => store.state.chat.isStartChat);
const isStop = computed(() => store.state.chat.isStop);
const checkAgent = computed(() => store.state.agent.type);
const question = ref<string>("");
const parseLoading = ref<boolean>(false);
const agentSelectStr = ref<string>("");
const agentListVisible = ref<boolean>(false);
const surveyBtn = ref<{ click: () => void }>();
const auditBtn = ref<{ click: () => void }>();
const chatId = computed(() => store.state.chat.chat_id);
const agentList = computed(() => {
  if (!agentSelectStr.value) {
    return aideList;
  }
  const agent = aideList.filter((item) => item.name.includes(agentSelectStr.value));
  if (!agent.length) {
    return [];
  }
  return agent;
});
const uploadFile = reactive({
  name: "",
  state: "",
});
const fileNum = reactive({
  savedNum: 0,
  failNum: 0,
});

const fileList = ref<File[]>([]);
const handleShiftEnter = () => {
  question.value = question.value + "\n";
};

// 判断是否可以发送
const isCanSend = computed(
  () =>
    !question.value ||
    store.state.chat.isStartChat ||
    (Boolean(uploadFile.state) && uploadFile.state !== UploadState.SUCCESS),
);

const onClickStop = () => {
  stop();
  store.commit("chat/SET_IS_STOP", true);
};
const textPlaceholder = computed(() => (parseLoading.value ? "语音转换中，请稍候…" : "继续追问"));

const onClickSend = async (auditRule?: string) => {
  if (store.state.chat.isStartChat) return;
  const newsId = <string>route.params.newId;
  if (!route.path.startsWith("/qa")) {
    await router.push("/qa?backtrack=store");
  }
  const fixedQuestion = formatInputText(question.value);
  const agent = store.state.agent.type;
  let contractSource;
  let source;
  if (agent === AideKey.CONTRACT_AUDIT) {
    contractSource = verifyDoc(["docx", "pdf"], "请选择一份docx或pdf文件");
  }
  if (agent === AideKey.VIDEO_PARSE && isCheckSource()) {
    source = verifyDoc(["avi", "mp4", "flv", "wmv", "mkv", "weba"], "仅支持勾选一个视频");
    if (!source) return;
  }
  if (!fixedQuestion) return;
  uploadFile.state = "";
  uploadFile.name = "";
  prepareChat(fixedQuestion);
  question.value = "";
  store.commit("agent/SET_TYPE", null);
  if (agent === AideKey.ENTERPRISE_RESEARCH) {
    await beforeConfirm(fixedQuestion, auditRule).catch(console.error);
    return;
  }
  const params: ChatParams = {
    query: fixedQuestion,
    sourceNewsId: newsId,
    chat_agent: agent || AideKey.NO_AGENT,
    contract_source: contractSource,
    audit_rule: auditRule,
    video_source: source,
  };

  if (!isStop.value && chatId.value) params.topic_id = chatId.value;
  await send(params, !chatId.value);
};

const clearFile = () => {
  uploadFile.name = "";
  uploadFile.state = "";
  fileList.value = [];
};

const sendQuestion = async () => {
  const agent = store.state.agent.type;
  if (agentListVisible.value || !verifySurveyOrAuditCount(activeModule.value, agent)) return;

  if (agent === AideKey.CONTRACT_AUDIT) {
    auditBtn.value?.click();
  } else if (agent === AideKey.ENTERPRISE_RESEARCH) {
    surveyBtn.value?.click();
  } else {
    await onClickSend();
  }
};

// 上传批量文档
const submitUpload = async (fileArray: File[]) => {
  const formData = new FormData();
  for (const file of fileArray) {
    formData.append("files", file);
  }
  const filenames = fileArray.map((file) => file.name);
  uploadFile.name = getNamesSummary(filenames);
  uploadFile.state = UploadState.UPLOADING;
  fileList.value = fileArray;
  const taskId = await uploadFiles(formData).catch(() => {
    uploadFile.state = UploadState.FAIL;
    fileNum.failNum = fileArray.length;
  });
  if (!taskId) return;
  const task = await batchProgress(taskId);
  const files = task.data.documents;
  const isSaved = files.every((file) => file.fileStatus === StatusNumber.saved);

  const failIds = files.filter((file) => file.fileStatus !== StatusNumber.saved).map((f) => f.id);
  const savedIds = files.filter((file) => file.fileStatus === StatusNumber.saved).map((f) => f.id);
  fileNum.savedNum = savedIds.length;
  fileNum.failNum = failIds.length;
  if (savedIds.length) {
    store.commit("documentQA/SET_CHECK_DOC_ID", savedIds);
    // store.commit("documentQA/SET_KNOWLEDGE_SOURCE", [KnowledgeSourceType.PERSONAL]);
  }
  uploadFile.state = isSaved ? UploadState.SUCCESS : UploadState.FAIL;
  if (failIds.length) {
    ElMessage.error(`${failIds.length}个文件上传失败`);
  }
  const privateTree = getPrivateTreeNode()!;

  // isLeaf 变为true 表示个人知识库下没有内容了 需要手动添加上传内容
  if (privateTree.isLeaf) {
    const children = files
      .filter((file) => file.fileStatus === StatusNumber.saved)
      .map((data) => ({
        ...data,
        isLeaf: true,
        repositoryId: privateTree.data.id,
        parentId: privateTree.data.id,
        type: privateTree.data.type,
        isPrivate: true,
        category: 2,
      }));
    privateTree.setData({
      ...privateTree.data,
      children,
    });
  }
  refreshPerson();
  if (savedIds.length) checkNodes();
};

const getFilesNumStr = () => {
  if (uploadFile.state === UploadState.UPLOADING) {
    return `等${fileList.value.length}个文件`;
  } else {
    if (!fileNum.failNum || !fileNum.savedNum) {
      return `等${fileNum.savedNum || fileNum.failNum}个文件`;
    } else {
      return `等${fileNum.savedNum}个文件成功, ${fileNum.failNum}个文件失败`;
    }
  }
};

const handleChange = () => {
  if (/@$/.test(question.value)) {
    agentListVisible.value = true;
    agentSelectStr.value = "";
    return;
  }
  if (!agentList.value.length || !question.value) {
    agentListVisible.value = false;
  }
  const lastAtIndex = question.value.lastIndexOf("@");
  if (lastAtIndex !== -1 && lastAtIndex < question.value.length - 1) {
    agentSelectStr.value = question.value.substring(lastAtIndex + 1);
  }
};
</script>

<style lang="scss" scoped>
@import "src/styles/theme";
@import "src/styles/mixins";

.input-warp {
  position: relative;
}
.agent-select {
  margin-bottom: 10px;
}

.input-box {
  display: flex;
  align-items: center;
  .stop-button {
    flex: 0 0 36px;
    width: 36px;
    height: 36px;
    margin-right: $margin-md;
  }
  .query-box {
    flex: 1;
    border: 3px solid #dddfe3;
    overflow: hidden;
  }

  .agent-radius {
    border-radius: 8px;
  }

  .chat-radius {
    border-radius: 28px;
  }

  .chat-input {
    width: 100%;
    display: flex;
    background: $color-white;

    min-height: 50px;
    max-height: 182px;
    padding: 0 16px;

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
      //flex: 0 0 80px;
      //width: 80px;
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
          width: 16px;
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
