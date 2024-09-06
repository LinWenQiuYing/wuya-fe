<template>
  <div :class="$style.outline_warp">
    <ExportDropMenu
      v-if="props.data.answer.isProgress"
      :disabled="!isFinish"
      :class="$style.export"
      @click="(type) => downloadAnswer(type, props.data)"
    >
      <el-button :disabled="!isFinish" :icon="exportAction.icon">{{ exportAction.name }}</el-button>
    </ExportDropMenu>
    <OutlineEditor v-if="initOutline" :value="initOutline" />
  </div>
</template>

<script setup lang="ts">
import { exportAction } from "@/client/views/writing/transformActions";
import OutlineEditor from "@/client/components/OutlineEditor/index.vue";
import ExportDropMenu from "@/client/views/writing/ExportDropMenu.vue";
import { RecordState, SurveyRecordState } from "@/client/types/chat";
import { ExportTypeCode } from "@/client/views/writing/exportableTypes";
import { exportToPdfOrDocx } from "@/client/api/chat";
import downloadBlobByLink from "@/client/views/writing/downloadBlobByLink";
import { computed } from "vue";

const props = defineProps<{
  data: RecordState<SurveyRecordState>;
}>();

const regex = /^(#+.*?)(?:\n|$)/gm;
const getChatOutline = () => {
  let line = "";
  if ("llm_output" in props.data.answer && props.data.answer.outline) {
    const matches = props.data.answer.outline.matchAll(regex);
    for (const match of matches) {
      line += match[0];
    }
  }
  return line;
};

const initOutline = computed(getChatOutline);
const isFinish = computed(() => props.data.answer?.answerStatus === 1);

const downloadPDF = async (name: string, recordId: number) => {
  const blob = await exportToPdfOrDocx({
    export_format: "pdf",
    with_citation: true,
    qa_record_id: recordId,
  });
  downloadBlobByLink(`${name}.pdf`, blob);
};

const downloadDocx = async (name: string, recordId: number) => {
  const blob = await exportToPdfOrDocx({
    export_format: "docx",
    with_citation: true,
    qa_record_id: recordId,
  });
  downloadBlobByLink(`${name}.docx`, blob);
};

const downloadAnswer = async (type: ExportTypeCode, record: RecordState<SurveyRecordState>) => {
  if (!record.answer.recordId) return;
  if (type === "pdf") {
    await downloadPDF(record.question, record.answer.recordId);
  } else {
    await downloadDocx(record.question, record.answer.recordId);
  }
};
</script>

<style module lang="scss">
.outline_warp {
  margin-top: 20px;
}
.export {
  margin-bottom: 20px;
}
</style>
