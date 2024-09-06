<template>
  <div :class="$style._">
    <header :class="$style.head">{{ draft.query }}</header>
    <div :class="$style.main">
      <TitleBar title="回答" :icon="BubbleIcon" :animated="false" />
      <h1 :class="$style.title">{{ title }}</h1>
      <DraftSectionContext
        v-for="(section, index) in draft.sections"
        :key="section.id"
        :draft-id="draft.id"
        :section="section"
        :action="actions[section.id]"
        :cursor="cursor"
        :index="index"
        :section-nums="draft.sections.length"
        @update-draft="updateDraft"
        @update-action="reflectAction"
        @update-stream-state="updateStreamState"
        @focus="setCursor"
      />
    </div>
    <DraftEditBar
      :class="$style.bar"
      :draft="props.draft"
      :topic-id="props.topicId"
      :record-id="props.recordId"
    />
    <OutlineNavigator :class="$style.aside" :list="draft.sections" />
    <BlockButton v-if="isStreaming" plain :class="$style.streaming" :icon="StopIcon" @click="abortStreaming">
      <span>停止生成</span>
    </BlockButton>
    <p :class="$style.annotation">内容由AI生成，仅供参考</p>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import type { Draft } from "@/client/api/chat";
import TitleBar from "@/client/views/intelligentQA/components/TitleBar.vue";
import OutlineNavigator from "./OutlineNavigator.vue";
import DraftSectionContext from "./DraftSectionContext.vue";
import BlockButton from "./BlockButton.vue";
import DraftEditBar from "./DraftEditBar.vue";
import parseHeadMarkdown from "./parseHeadMarkdown";
import useRouteReflectAction, { ReflectAction } from "./useRouteReflectAction";
import { cancelAction, raceCursorActions, StreamState } from "./editActions";
import BubbleIcon from "@/client/icons/bubble.svg";
import StopIcon from "@/client/icons/circle-square-outline.svg";

const props = defineProps<{
  readonly topicId: number;
  readonly recordId: number;
  draft: Draft;
}>();

const draft = ref<Draft>(props.draft);

type StreamStateMeta = {
  state: StreamState;
  abort: null | (() => void);
  sectionId: number;
};
type StreamStateMap = Record<number, StreamStateMeta>;
const streamStateMap = ref<StreamStateMap>({});
const isStreaming = computed(() => {
  return Object.values(streamStateMap.value).some((sectionState) => sectionState.state === "streaming");
});

/**
 * cursor: 竞争光标的章节的id
 * - `null` 表示无人竞争, 谁都可以用
 * - 值为某章节的id表示光标的使用已经被该section申领, 该section获得和可以使用光标
 *
 * 如何申领光标:
 * - 编辑动作(./editAction.ts)中设置`raceCursor: true`的动作, 可以在展开时自动申领光标
 * - 在点击编辑器的时候, 该章节(的编辑器)会重新申领光标
 *
 * 光标的申领是竞争态, 后申领者胜.
 * 任意时刻只有一个章节能申领到光标
 */
const cursor = ref<number | null>(null);
const setCursor = (value: number | null) => (cursor.value = value);

const title = parseHeadMarkdown(draft.value.title);

const updateDraft = (value: Draft) => {
  draft.value = value;
};

// 各个章节的编辑状态 (存储在地址栏中)
const [actions, setActions] = useRouteReflectAction();

// 更新光标状态
const updateCursor = ({ code, id }: ReflectAction) => {
  // 取消操作时
  if (cancelAction.code === code) {
    // 如果光标正被当前章节申领
    if (cursor.value === id) {
      // 则放弃对光标的申领
      setCursor(null);
      return;
    }
  }
  // 如果当前操作竞争光标的使用, 则将光标的使用权移给它
  else if (raceCursorActions.includes(code)) {
    setCursor(id);
  }
};

const abortStreamingById = (id: number) => {
  if (!(id in streamStateMap.value)) return;
  const abort = streamStateMap.value[id].abort;
  if (abort !== null) abort();
  streamStateMap.value = {
    ...streamStateMap.value,
    [id]: {
      sectionId: id,
      abort: null,
      state: "aborted",
    },
  };
};

// 保存编辑动作
const reflectAction = async ({ code, id }: ReflectAction) => {
  updateCursor({ code, id });
  await setActions({ ...actions.value, [id]: code });
  if (code === cancelAction.code) {
    abortStreamingById(id);
  }
};

const updateStreamState = (state: StreamState, sectionId: number, abort?: () => void) => {
  streamStateMap.value = {
    ...streamStateMap.value,
    [sectionId]: { state, abort: abort ?? null, sectionId },
  };
};

const abortStreaming = () => {
  const streamingSectionIds = Object.keys(streamStateMap.value).map((id) => Number.parseInt(id));
  if (!streamingSectionIds.length) return;
  abortStreamingById(cursor.value ?? streamingSectionIds[0]);
};
</script>

<style lang="scss" module>
@use "src/styles/theme";

._ {
  display: grid;
  grid-template-columns: 1fr 300px;
  grid-template-rows: minmax(50px, auto) 1fr;
  grid-column-gap: 32px;
}

.head {
  grid-column: 1;
  grid-row: 1;
  color: theme.$text-color-primary;
  font-size: 28px;
  line-height: 40px;
  white-space: pre-wrap;
  word-break: break-all;
  margin: 0;
  padding: 20px 0;
  font-weight: bold;
  text-align: justify;
  background: linear-gradient(
    to bottom,
    #fff 0%,
    #fff 60%,
    rgba(255, 255, 255, 0.9) 70%,
    rgba(255, 255, 255, 0.8) 80%,
    rgba(255, 255, 255, 0.2) 100%
  );
  pointer-events: none;
}

.bar {
  grid-column: 2;
  grid-row: 1;
  display: flex;
  gap: 8px;
  align-items: start;
  padding: 26px 0;
}

.main {
  grid-column: 1;
  grid-row: 2;
  font-size: 16px;
  color: theme.$text-color-primary;
  line-height: 24px;
  overflow-y: auto;
  scroll-behavior: smooth;
  padding-bottom: 50px;
}

.aside {
  grid-column: 2;
  grid-row: 2;
  overflow-y: auto;
  scroll-behavior: smooth;
}

.title {
  font-weight: bold;
  font-size: 20px;
  margin: 10px 0;
}

.annotation {
  grid-column: 1;
  grid-row: 2;
  justify-self: stretch;
  align-self: end;
  font-size: 12px;
  color: theme.$text-color-secondary;
  line-height: 20px;
  padding: 16px 0;
  margin: 0;
  user-select: none;
  text-align: center;
  pointer-events: none;
  z-index: 1;
  background: linear-gradient(
    to top,
    #fff 0%,
    rgba(255, 255, 255, 0.9) 30%,
    rgba(255, 255, 255, 0.85) 60%,
    transparent 100%
  );
}

.streaming {
  grid-column: 1;
  grid-row: 2;
  justify-self: center;
  align-self: end;
  width: 112px;
  height: 40px;
  border-radius: 20px;
  margin-bottom: 50px;
  z-index: 1;
}
</style>
