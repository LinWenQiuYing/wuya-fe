<template>
  <div>
    <StrokeButton :icon="previewAction.icon" @click="previewDraft">{{ previewAction.name }}</StrokeButton>
    <ExportPopover v-model:loading="loading" @click="exportDraft" />
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { previewAction } from "./transformActions";
import ExportPopover from "./ExportPopover.vue";
import StrokeButton from "./StrokeButton.vue";
import downloadBlobByLink from "./downloadBlobByLink";
import initWritingTopicById from "./initWritingTopicById";
import useWriting from "./useWriting";
import { ExportTypeCode } from "./exportableTypes";
import { Draft, DraftExportPayload, exportWritingDraft, previewWritingDraft } from "@/client/api/chat";

const props = defineProps<{
  readonly topicId: number;
  readonly recordId: number;
  draft: Draft;
}>();

const loading = ref(false);

const router = useRouter();
const { records } = useWriting();

// 返回预览
const previewDraft = async () => {
  await previewWritingDraft({ record_id: props.recordId, draft_id: props.draft.id }).catch(console.error);
  records.value = [];
  await initWritingTopicById(props.topicId).catch(console.error);
  await router.replace(`/writing/topic/${props.topicId}`).catch(console.error);
};

// 导出草稿
const exportDraft = async (type: ExportTypeCode) => {
  loading.value = true;
  const payload: DraftExportPayload = {
    draft_id: props.draft.id,
    export_format: type,
    with_citation: false,
  };
  const blob = await exportWritingDraft(payload).catch(console.error);
  loading.value = false;
  if (!blob) return;
  const name = props.draft.title.replace(/^#+\s+/, "").replace(/\n*$/, "");
  const filename = `${name}.${type}`;
  downloadBlobByLink(filename, blob);
};
</script>
