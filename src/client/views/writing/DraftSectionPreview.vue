<template>
  <div :class="{ [$style.split]: split }">
    <h2 :id="id" :class="$style.title">{{ title }}</h2>
    <div :class="$md._" v-html="content"></div>
    <div :class="$style.bar">
      <LinkButton :icon="IntelliEditIcon" @click="() => reportAction(intelliAction.code)">{{
        intelliAction.name
      }}</LinkButton>
      <SectionEditDropMenu
        :actions="moreEditActions"
        :curr-section-index="props.index"
        :section-nums="props.sectionNums"
        @click="reportAction"
      />
      <LinkButton v-if="references.length" :icon="ReferencesIcon" @click="toggleReferencesFolded">
        <span>{{ references.length }}条参考</span>
        <ArrowDownIcon :class="$style.arrow" />
      </LinkButton>
    </div>
    <References
      v-if="references.length && !referencesFolded"
      :references="references"
      :class="$style.references"
    />
  </div>
</template>
<script lang="ts" setup>
import { computed, ref } from "vue";
import { DraftSection, Draft } from "@/client/api/chat";
import SectionEditDropMenu from "./SectionEditDropMenu.vue";
import References from "./References.vue";
import LinkButton from "./LinkButton.vue";
import { EditActionCode, intelliAction } from "./editActions";
import parseHeadMarkdown from "./parseHeadMarkdown";
import md from "./md";
import $md from "./md.module.scss";
import ReferencesIcon from "@/client/icons/book-open.svg";
import ArrowDownIcon from "@/client/icons/arrow-down-outline.svg";
import IntelliEditIcon from "@/client/icons/pencil-outline-stars.svg";
import clearMarkdown from "./clearMarkdown";

const props = defineProps<{
  draftId: number;
  section: DraftSection;
  action?: EditActionCode;
  index: number;
  sectionNums: number;
}>();

const emit = defineEmits<{
  updateAction: [EditActionCode];
  updateDraft: [Draft];
}>();

const referencesFolded = ref(true);

const last = computed(() => props.index === props.sectionNums - 1);
const isAdd = computed(() => props.action === "add");
// 新增的时候不加线, 最后一章节不加线
const split = computed(() => !isAdd.value && !last.value);
const moreEditActions: EditActionCode[] = ["move-up", "move-down", "add", "delete"];

const id = computed(() => props.section.id.toString(16));
const title = computed(() => parseHeadMarkdown(props.section.name));
const content = computed(() => md.render(clearMarkdown(props.section.content)));
const references = computed(() => props.section.reference ?? []);

const reportAction = (code: EditActionCode) => emit("updateAction", code);
const toggleReferencesFolded = () => (referencesFolded.value = !referencesFolded.value);
</script>
<style lang="scss" module>
@use "src/styles/theme";

.split {
  border-bottom: 1px solid #dddfe3;
  margin-bottom: 20px;
  padding-bottom: 4px;
}

.title {
  font-weight: bold;
  font-size: 16px;
  margin: 20px 0 10px 0;
  line-height: 22px;
}

.bar {
  margin-top: -4px;
  margin-bottom: 6px;
  font-size: 14px;
  display: grid;
  grid-column-gap: 16px;
  grid-auto-columns: min-content;
  grid-auto-flow: column;
  align-items: center;
}

.arrow {
  width: 14px;
}

.references {
  margin: 6px 4px 12px 0;
}
</style>
