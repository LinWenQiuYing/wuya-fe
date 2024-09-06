<template>
  <div :class="[$style._, isMobile ? $style.h5 : $style.pc]">
    <CheckAgent v-show="showAgentSelect" />
    <div :class="[!isMobile && $style.agent_pc_warp]">
      <textarea
        v-model="question"
        autofocus
        type="textarea"
        maxlength="1000"
        :placeholder="textPlaceholder"
        @input="handleChange"
        @keydown.shift.enter.prevent.exact="handleShiftEnter"
        @keydown.enter.prevent.exact="(e: KeyboardEvent) => handleKeyEnter(e, send)"
      />
      <div :class="$style.bar">
        <SourcesSelect />
        <el-tooltip
          placement="top"
          :disabled="!isAnonymous"
          content="请登录后使用"
          :offset="3"
          effect="light"
        >
          <template #content>
            请<router-link
              :to="preferSignEntry"
              :class="$style.rth_link"
              @click="() => reAuth({ remote: false })"
              >登录</router-link
            >后使用
          </template>
          <div :class="[$style.upload, isAnonymous && $style.disabled]">
            <CurriedUpload @change="submitUpload">
              <button v-if="isMobile" :class="$style.addBtn" type="button">
                <AddIcon />
              </button>
              <template v-else>
                <Upload :class="$style.uploadIcon" />
                <span :class="$style.uploadTitle">{{ uploadFile.name }}</span>
              </template>
              <span v-if="uploadFile.state" :class="$style.moreText">
                {{ getFilesNumStr() }}
              </span>
              <el-icon v-if="uploadFile.state === UploadState.FAIL" :class="$style.uploadState">
                <DeleteFilled :class="$style.failIcon" @click.stop="resetFileUpload" />
              </el-icon>
              <el-icon
                v-if="uploadFile.state === UploadState.UPLOADING"
                class="is-loading"
                :class="$style.uploadState"
              >
                <Loading />
              </el-icon>
              <el-icon v-if="uploadFile.state === UploadState.SUCCESS" :class="$style.uploadState">
                <SuccessFilled :class="$style.success" />
              </el-icon>
            </CurriedUpload>
          </div>
        </el-tooltip>
        <button v-if="isMobile" type="button" :disabled="sendState" :class="$style.touchBtn" @click="send">
          <CircleAirplaneIcon />
        </button>
        <SendButtonFilter v-else>
          <template #survey>
            <SurveySendButton ref="surveyBtn" :disabled="sendState" :send="sendQuestion" />
          </template>
          <template #audit>
            <AuditSendButton ref="auditBtn" :send-disabled="sendState" :send="sendQuestion" />
          </template>
          <template #default>
            <el-button :disabled="sendState" :class="$style.sendBtn" @click="send">
              <AirplaneIcon />
            </el-button>
          </template>
        </SendButtonFilter>
      </div>
      <div v-show="showAgentSelect && agentList.length" :class="$style.agent_select">
        <AgentSelect
          v-model:query="question"
          v-model:visible="agentListVisible"
          :questions="props.questions"
          :list="agentList"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { UploadState } from "@/client/types";
import { DeleteFilled, Loading, SuccessFilled, Upload } from "@element-plus/icons-vue";
import { computed, reactive, ref } from "vue";
import store from "@/store";
import { ElMessage } from "element-plus";
import useTree from "../hooks/useTree";
import { uploadFiles } from "@/client/api/knowSource";
import { batchProgress } from "@/api/knowledgeRequst";
import AirplaneIcon from "@/client/icons/airplane.svg";
import CircleAirplaneIcon from "@/client/icons/circle-fill-airplane.svg";
import AddIcon from "@/client/icons/add-circle.svg";
import { StatusNumber } from "@/admin/view/knowledgeBase/const";
import CurriedUpload from "@/client/components/CurriedUpload.vue";
import getNamesSummary from "@/client/utils/getNamesSummary";
import formatInputText from "@/client/utils/formatInputText";
import convertVideoIfExist from "@/client/utils/convertVideoIfExist";
import { isMobile } from "@/config";
import SourcesSelect from "./SourcesSelect.vue";
import AgentSelect from "@/client/components/AgentSelect.vue";
import { HotQuestionsState } from "@/client/hooks/useRecommendedQuestions";
import CheckAgent from "@/client/components/CheckAgent.vue";
import useActiveModule, { ModuleCode } from "@/client/layout/useActiveModule";
import { AideKey, aideList } from "@/client/const";
import { isAnonymous } from "@/store/hooks/useUserInfo";
import getPreferSignEntry from "@/sign/getPreferSignEntry";
import reAuth from "@/sign/reAuth";
import SurveySendButton from "@/client/components/SurveySendButton.vue";
import verifyDoc from "@/client/hooks/verifyDoc";
import verifySurveyOrAuditCount from "@/client/hooks/verifySurveyOrAuditCount";
import SendButtonFilter from "@/client/components/SendButtonFilter.vue";
import AuditSendButton from "@/client/components/AuditSendButton.vue";
import handleKeyEnter from "@/client/utils/handleKeyEnter";

const emit = defineEmits<{
  send: [string, { rule?: string; key?: string }];
}>();

const props = defineProps<{
  inputPlaceholder?: string;
  questions?: HotQuestionsState[];
  isAgent?: boolean;
}>();

const { isCheckSource } = useTree();
const preferSignEntry = getPreferSignEntry();
const activeModule = useActiveModule();
const surveyBtn = ref<{ click: () => void }>();
const auditBtn = ref<{ click: () => void }>();
const agentType = computed(() => store.state.agent.type);
const agentSelectStr = ref<string>("");
const agentListVisible = ref<boolean>(false);
const showAgentSelect = computed(() => props.isAgent && activeModule.value === "qa");

const defaultQuestionMap = new Map<ModuleCode, string>([
  ["parser", "请总结这个视频"],
  ["contract", "请审核这份合同，确认是否符合所有规则"],
  ["financialAnalysis", "请审核这份财务报表"],
]);
// 不同助手的默认问题
const defaultQuestion = defaultQuestionMap.get(activeModule.value) ?? "";
const question = ref<string>(defaultQuestion); // 问题
const uploadFile = reactive<{ name: string; state: UploadState | null }>({
  name: "点击上传文件",
  state: null,
});
const fileList = ref<File[]>([]);
const fileNum = reactive({
  savedNum: 0,
  failNum: 0,
});
const parseLoading = ref<boolean>(false); // 解析语音状态
const { refreshPerson, checkNodes, getPrivateTreeNode /*, clickCardSource*/ } = useTree();

const handleShiftEnter = () => {
  question.value = question.value + "\n";
};

const textPlaceholder = computed(() =>
  parseLoading.value ? "语音转换中，请稍候…" : props.inputPlaceholder || "您可以提任何问题…",
);
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

const sendState = computed(() => {
  return !question.value || (Boolean(uploadFile.state) && uploadFile.state !== UploadState.SUCCESS);
});

const send = () => {
  if (agentListVisible.value || !verifySurveyOrAuditCount(activeModule.value, agentType.value)) return;
  if (activeModule.value === "contract" || agentType.value === AideKey.CONTRACT_AUDIT) {
    auditBtn.value?.click();
  } else if (activeModule.value === "survey" || agentType.value === AideKey.ENTERPRISE_RESEARCH) {
    surveyBtn.value?.click();
  } else {
    if (isCheckSource() && (activeModule.value === "parser" || agentType.value === AideKey.VIDEO_PARSE)) {
      const source = verifyDoc(["avi", "mp4", "flv", "wmv", "mkv", "weba"], "仅支持勾选一个视频");
      if (!source) return;
    }
    sendQuestion();
  }
};

const sendQuestion = (auditRule?: string) => {
  const fixedQuestion = formatInputText(question.value);
  if (!fixedQuestion) return;
  resetFileUpload();
  emit("send", fixedQuestion, { rule: auditRule });
};

// 上传批量文档
const submitUpload = async (fileArray: File[]) => {
  const formData = new FormData();
  for (const file of fileArray) {
    const videoContext = await convertVideoIfExist(file).catch(console.error);
    formData.append("files", videoContext || file);
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

  uploadFile.state = isSaved ? UploadState.SUCCESS : UploadState.FAIL;
  fileList.value = [];
};

const resetFileUpload = () => {
  uploadFile.name = "请上传文件";
  uploadFile.state = null;
  fileList.value = [];
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
  if (!showAgentSelect.value) return;
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

<style lang="scss" module>
@use "src/styles/theme";
@import "src/styles/mixins";

._ {
  position: relative;
  border-radius: 8px;

  :global(.el-upload-dragger) {
    padding: 0;
    border: 0;
    display: flex;
    align-items: center;
  }

  textarea {
    width: 100%;
    box-sizing: border-box;
    resize: none;
    box-shadow: none;
    border: none;
    outline: none;
    font-size: theme.$font-size-base;
    color: theme.$text-color-primary;
    line-height: 22px;
    font-weight: 400;
    border-radius: 8px;

    ::placeholder {
      color: theme.$text-color-secondary;
    }
  }
}
.agent_pc_warp {
  padding: 12px 16px;
}
.pc {
  border: 3px solid #dddfe3;
  background: #fff;
  width: 100%;
  min-width: 185px;
  box-sizing: border-box;
  textarea {
    height: 72.5px;
    padding: 0 8px;
  }
}

.h5 {
  background: #fff;
  box-shadow: 0 2px 6px 0 rgba(215, 213, 213, 0.12);
  padding: 10px 10px 5px;
  border: 2px solid #e5e5ec;
  margin: 0 15px;

  textarea {
    padding: 0 5px;
    height: 65.5px;
  }
}

.mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
}

.bar {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  font-size: theme.$font-size-base;
  color: theme.$text-color-primary;
}

.moreText {
  color: theme.$text-color-primary;
}

.uploadIcon {
  flex: 0 0 16px;
  width: 16px;
  height: 16px;
  color: inherit;
}

.upload {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  height: 30px;
  line-height: 30px;
  min-width: 30px;
  overflow: hidden;
  color: theme.$text-color-primary;

  span {
    color: inherit;
  }

  &:hover {
    color: theme.$color-primary;
  }
}

.pc .upload {
  padding-left: theme.$padding-md;
}

.failIcon {
  color: theme.$red_color;
}

.uploadTitle {
  flex: 1;
  padding-left: theme.$padding-xss;
  font-weight: 400;
  color: theme.$text-color-primary;
  cursor: pointer;
  @include hide-lines();
}

.sendBtn {
  width: 32px;
  height: 32px;
  background: theme.$color-primary;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: auto;
  --el-button-disabled-bg-color: #306bec;
  --el-button-hover-bg-color: #306bec;

  svg {
    width: 22px;
    fill: theme.$color-white;
  }
}

.margin_warp {
  margin-left: auto;
}

.touchBtn {
  width: 32px;
  height: 32px;
  border: 0 none;
  outline: 0 none;
  box-shadow: none;
  background: unset;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: auto;
  margin-right: -5px;

  svg {
    display: block;
    width: 32px;
    margin-top: 4px;
    --color-bg: #206cf1;
    --color-fg: #fff;
  }

  &:disabled svg {
    --color-bg: #e5e5ec;
    --color-fg: #ccc;
  }
}

.uploadState {
  height: 16px;
  margin-left: 3px;
}

.success {
  color: theme.$green_color;
}

.addBtn {
  border: 0 none;
  outline: 0 none;
  box-shadow: none;
  width: 40px;
  height: 40px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: unset;
  margin-right: -10px;

  svg {
    width: 16px;
    display: block;
    fill: currentColor;
  }
}

.agent_select {
  position: absolute;
  z-index: 10;
  left: 0;
  width: 100%;
  margin-top: 20px;
}

.rth_link {
  color: #0a6efa;
}

.disabled span {
  color: #6d7588;
}
</style>
