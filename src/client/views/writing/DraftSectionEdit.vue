<template>
  <div :class="[$style._, { [$style.add]: isAdd }]">
    <LinkButton :class="$style.close" :icon="CloseIcon" title="取消" @click="cancelEdit" />
    <template v-if="isEdit">
      <h2 :class="$style.header">{{ title }}</h2>
      <div :class="[$md._, $style.br]" v-html="htmlContent" />
    </template>
    <IntelliEditor
      :draft-id="props.draftId"
      :section="props.section"
      :action="props.action"
      :cursor="props.cursor"
      @focus="emitFocus"
      @update-action="updateAction"
      @update-draft="updateDraft"
      @update-stream-state="updateStreamState"
    />
  </div>
</template>
<script lang="ts" setup>
import { ref, computed } from "vue";
import { cancelAction, EditActionCode, StreamState } from "./editActions";
import LinkButton from "./LinkButton.vue";
import { DraftSection, Draft } from "@/client/api/chat";
import parseHeadMarkdown from "./parseHeadMarkdown";
import CloseIcon from "@/client/icons/xmark.svg";
import $md from "./md.module.scss";
import md from "./md";
import IntelliEditor from "./IntelliEditor.vue";

const props = defineProps<{
  draftId: number;
  section: DraftSection;
  action: EditActionCode;
  cursor: number | null;
}>();
const emit = defineEmits<{
  focus: [number];
  updateAction: [EditActionCode];
  updateDraft: [Draft];
  updateStreamState: [StreamState, (() => void)?];
}>();

const content = ref<string>(props.section.content);

const title = computed(() => parseHeadMarkdown(props.section.name));
const htmlContent = computed(() => md.render(content.value));
const isEdit = computed(() => props.action === "edit");
const isAdd = computed(() => props.action === "add");

// 取消编辑
const cancelEdit = () => {
  emit("updateAction", cancelAction.code);
};

const updateDraft = (draft: Draft) => {
  emit("updateDraft", draft);
  cancelEdit();
};

const updateAction = (code: EditActionCode) => {
  emit("updateAction", code);
};

const emitFocus = () => emit("focus", props.section.id);
const updateStreamState = (state: StreamState, abort?: () => void) => {
  emit("updateStreamState", state, abort);
};
</script>
<style lang="scss" module>
@use "src/styles/theme";

._ {
  background: rgba(240, 242, 247, 0.7);
  border-radius: 6px;
  border: 1px solid #e1e1e1;
  padding: 10px 20px 20px;
  display: grid;
  grid-auto-flow: row;
  grid-auto-columns: auto;

  & + & {
    margin-top: 10px;
  }
}

.close {
  grid-row: 1;
  grid-column: 1;
  justify-self: end;
  align-self: start;
  width: 30px;
  height: 30px;
  margin-right: -14px;
}

.add .close {
  margin-top: -10px;
  margin-bottom: -5px;
}

.header {
  grid-row: 1;
  grid-column: 1;
  justify-self: start;
  align-self: start;
  font-weight: bold;
  font-size: 16px;
  color: theme.$text-color-primary;
  line-height: 22px;
  margin: 4px 0;
  text-overflow: ellipsis;
  overflow: hidden;
  padding-right: 10px;
}

.br {
  border-bottom: 1px solid #dddfe3;
  margin-bottom: 12px;
}

.input {
  display: block;
  resize: none;
  width: 100%;
  box-sizing: border-box;
  min-height: 120px;
  background: #fff;
  border-radius: 6px;
  border: 1px solid #e1e1e1;
  font-size: 14px;
  margin-top: 10px;
  padding: 9px;
  line-height: 22px;
  transition:
    border-color 0.3s ease-in-out,
    color 0.3s ease-in-out;

  &::placeholder {
    color: #bbb;
  }

  &:focus {
    border-color: theme.$color-primary;
  }
}
</style>
