<template>
  <ExportDropMenu :disabled="!isFinish" @click="downloadAnswer">
    <el-button :disabled="!isFinish" :icon="exportAction.icon">{{ exportAction.name }}</el-button>
  </ExportDropMenu>
  <OutlineEditor v-if="initOutline" :class="$style.outline" :value="initOutline" :readonly="true" />
</template>
<script setup lang="ts">
import { exportAction } from "@/client/views/writing/transformActions";
import OutlineEditor from "@/client/components/OutlineEditor/index.vue";
import ExportDropMenu from "@/client/views/writing/ExportDropMenu.vue";
import { AnalysisRecordState, RecordState } from "@/client/types/chat";
import { computed } from "vue";
import { ExportTypeCode } from "@/client/views/writing/exportableTypes";
import { exportFinancialReport } from "@/client/api/chat";
import downloadBlobByLink from "@/client/views/writing/downloadBlobByLink";

const props = defineProps<{ data: RecordState<AnalysisRecordState> }>();
const isFinish = computed(() => props.data.answer?.answerStatus === 1);

const download = async (name: string, recordId: number, type: ExportTypeCode) => {
  const blob = await exportFinancialReport({
    export_format: type,
    with_citation: true,
    qa_record_id: recordId,
  });
  downloadBlobByLink(`${name}.${type}`, blob);
};

const downloadAnswer = async (type: ExportTypeCode) => {
  const recordId = props.data.recordId;
  if (!recordId) return;
  await download(props.data.question, recordId, type);
};

const regex = /^(#+.*?)(?:\n|$)/gm;

const getChatOutline = () => {
  let line = "";
  if ("agent" in props.data.answer && props.data.answer.outline) {
    const matches = props.data.answer.outline.matchAll(regex);
    for (const match of matches) {
      line += match[0];
    }
  }
  return line;
};
// 初始化的大纲
const initOutline = computed(getChatOutline);
</script>

<style module lang="scss">
.outline {
  margin-top: 20px;
}
</style>
