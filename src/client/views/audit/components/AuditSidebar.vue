<template>
  <OutlineEditor
    v-if="props.data.answer.auditRule"
    is-rebuild
    :class="$style.warp"
    :option-text="optionText"
    :value="props.data.answer.auditRule"
    @generate="update"
  />
</template>

<script setup lang="ts">
import OutlineEditor from "@/client/components/OutlineEditor/index.vue";
import { AuditRecordState, RecordState } from "@/client/types/chat";
import store from "@/store";
import verifyDoc from "@/client/hooks/verifyDoc";
import useSendQuestion from "@/client/hooks/useSendQuestion";
import { ChatParams } from "@/client/types/api";
import { AideKey } from "@/client/const";
import useActiveModule from "@/client/layout/useActiveModule";
import useSendAudit, { AuditParams } from "@/client/views/audit/useSendAudit";

const props = defineProps<{
  data: RecordState<AuditRecordState>;
}>();

const optionText = {
  title: "审核规则",
  btnText: "重新审核",
};
const activeModule = useActiveModule();
const { send, stop } = useSendQuestion();
const { send: auditSend, auditStop } = useSendAudit();
const query = props.data.question;
const topicId = store.state.chat.chat_id;

const update = async (outline: string) => {
  const create = activeModule.value === "contract" ? auditMenuOutline : qaMenuOutline;
  await create(outline);
};

const auditMenuOutline = async (auditRule: string) => {
  auditStop();
  const files = verifyDoc(["docx", "pdf"], "请选择一份docx或pdf文件");
  if (!files || !query) return;
  const auditData = store.state.chat.auditData;
  const currSurveyData = auditData[auditData.length - 1];
  const fixedSurveyData = {
    ...currSurveyData,
    answer: {
      isProgress: false,
      answerStop: false,
      progress: [],
    },
  };

  store.commit("chat/SET_AUDIT_DATA", [...auditData.slice(0, auditData.length - 1), fixedSurveyData]);
  store.commit("chat/TOGGLE_STARTCHAT", true);
  store.commit("chat/SET_IS_STOP", false);
  const params: AuditParams = { query, audit_rule: auditRule, contract_source: files, regenerate: true };
  if (topicId) params.topic_id = topicId;
  await auditSend(params, !topicId);
};

const qaMenuOutline = async (outline: string) => {
  stop();
  const contractSource = verifyDoc(["docx", "pdf"], "请选择一份docx或pdf文件");
  if (!query || !contractSource) return;
  const chatData = store.state.chat.chatData;
  const curChatData = chatData[chatData.length - 1];
  const fixedSurveyData: RecordState<AuditRecordState> = {
    ...curChatData,
    answer: {
      ...curChatData.answer,
      isProgress: false,
      answerStop: false,
      llm_output: "",
    },
  };
  const params: ChatParams = { query, chat_agent: AideKey.CONTRACT_AUDIT };
  fixedSurveyData.answer.auditRule = outline;
  params.audit_rule = outline;

  params.contract_source = contractSource;
  store.commit("chat/SET_CHAT_DATA", [...chatData.slice(0, chatData.length - 1), fixedSurveyData]);
  if (topicId) params.topic_id = topicId;
  await send(params, !topicId);
};
</script>

<style module lang="scss">
.warp {
  margin-top: 20px;
}
</style>
