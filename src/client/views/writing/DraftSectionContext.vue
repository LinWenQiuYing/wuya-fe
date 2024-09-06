<template>
  <DraftSectionPreview
    v-if="isPreview || isAdd"
    :section-nums="props.sectionNums"
    :draft-id="props.draftId"
    :action="props.action!"
    :index="props.index"
    :section="props.section"
    @update-action="updateAction"
  />
  <DraftSectionEdit
    v-if="isEdit || isAdd"
    :draft-id="props.draftId"
    :action="props.action!"
    :section="props.section"
    :cursor="props.cursor"
    @update-action="updateAction"
    @update-draft="updateDraft"
    @update-stream-state="updateStreamState"
    @focus="emitFocus"
  />
</template>
<script lang="ts" setup>
import { computed } from "vue";
import { EditActionCode, StreamState } from "./editActions";
import DraftSectionPreview from "./DraftSectionPreview.vue";
import DraftSectionEdit from "./DraftSectionEdit.vue";
import { ReflectAction } from "./useRouteReflectAction";
import {
  deleteWritingDraftSection,
  DraftSection,
  moveWritingDraftSectionDown,
  moveWritingDraftSectionUp,
  Draft,
} from "@/client/api/chat";

const props = defineProps<{
  action?: EditActionCode;
  // 分配了光标的章节, 如果光标分配给了别的章节, 则当前章节如果是编辑视图等则不可获得光标的使用权
  cursor: number | null;
  draftId: number;
  section: DraftSection;
  index: number;
  sectionNums: number;
}>();

const emit = defineEmits<{
  focus: [number];
  updateAction: [ReflectAction];
  updateDraft: [Draft];
  updateStreamState: [StreamState, number, (() => void)?];
}>();

const isPreview = computed(() => !props.action);
const isEdit = computed(() => props.action === "edit");
const isAdd = computed(() => props.action === "add");

const emitFocus = () => emit("focus", props.section.id);
const updateDraft = (draft: Draft) => emit("updateDraft", draft);

const moveSectionUp = async () => {
  const draft = await moveWritingDraftSectionUp(props.section.id);
  updateDraft(draft);
};

const moveSectionDown = async () => {
  const draft = await moveWritingDraftSectionDown(props.section.id).catch(console.error);
  if (!draft) return;
  updateDraft(draft);
};

const deleteCurrentSection = async () => {
  const draft = await deleteWritingDraftSection(props.section.id).catch(console.error);
  if (!draft) return;
  updateDraft(draft);
};

const updateAction = async (code: EditActionCode) => {
  switch (code) {
    case "move-up":
      return await moveSectionUp();
    case "move-down":
      return await moveSectionDown();
    case "delete":
      return await deleteCurrentSection();
    default:
      emit("updateAction", { code, id: props.section.id });
  }
};

const updateStreamState = (state: StreamState, abort?: () => void) => {
  emit("updateStreamState", state, props.section.id, abort);
};
</script>
