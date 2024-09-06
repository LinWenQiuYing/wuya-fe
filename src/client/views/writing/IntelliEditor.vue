<template>
  <div :class="$style._">
    <IntelliPrompt
      v-model:prompt="prompt"
      :placeholder="promptPlaceholder"
      :action="editAction"
      @focus="focusPrompt"
      @submit="generateByPrompt"
      @reset="cancelEdit"
    />
    <div v-show="quillVisible" :class="$style.quill">
      <div :class="$style.toolbar">
        <LinkButton :icon="H1Icon" :active="isHeader1Selection" title="一级标题" @click="formatToH1" />
        <LinkButton :icon="H2Icon" :active="isHeader2Selection" title="二级标题" @click="formatToH2" />
        <LinkButton :icon="H3Icon" :active="isHeader3Selection" title="三级标题" @click="formatToH3" />
        <LinkButton
          :icon="OrderedListIcon"
          :active="isOrderedListSelection"
          title="有序列表"
          @click="formatToOrderedList"
        />
        <LinkButton
          :icon="UnorderedListIcon"
          :active="isUnorderedListSelection"
          title="无序列表"
          @click="formatToUnorderedList"
        />
        <LinkButton :icon="TextBIcon" :active="isBoldSelection" title="加粗" @click="formatToBold" />
        <LinkButton
          :icon="undoAction.icon"
          :disabled="!quillState.isUndoAvailable"
          :title="undoAction.name"
          @click="undoEdit"
        />
        <LinkButton
          :icon="redoAction.icon"
          :disabled="!quillState.isRedoAvailable"
          :title="redoAction.name"
          @click="redoEdit"
        />
      </div>
      <div ref="containerRef" />
    </div>
  </div>
  <div v-show="quillVisible" :class="$style.bar">
    <LinkButton :icon="RefreshIcon" :disabled="!prompt.length || isStreaming" @click="generateByPrompt">
      <span>重写</span>
    </LinkButton>
    <LinkButton v-if="isAdd" :icon="CheckIcon" :disabled="isStreaming" @click="addContent">
      <span>新增</span>
    </LinkButton>
    <LinkButton v-else :icon="CheckIcon" :disabled="isStreaming" @click="replaceContent">
      <span>替换</span>
    </LinkButton>
  </div>
</template>
<script lang="ts" setup>
import { onMounted, onBeforeUnmount, ref, computed, reactive, watch } from "vue";
import { cancelAction, EditActionCode, intelliAction, StreamState } from "./editActions";
import LinkButton from "./LinkButton.vue";
import {
  DraftSection,
  Draft,
  updateDraftSection,
  regenerateDraftSection,
  SectionRegeneratePayload,
  appendDraftSection,
  SectionAppendPayload,
  SectionUpdatePayload,
  createDraftSection,
  SectionCreatePayload,
  DocumentReference,
  Abort,
} from "@/client/api/chat";
import Quill from "quill";
import type { Op } from "quill-delta";
import "quill/dist/quill.snow.css";
import H1Icon from "@/client/icons/text-h1.svg";
import H2Icon from "@/client/icons/text-h2.svg";
import H3Icon from "@/client/icons/text-h3.svg";
import UnorderedListIcon from "@/client/icons/ul-bold.svg";
import OrderedListIcon from "@/client/icons/ol-bold.svg";
import RefreshIcon from "@/client/icons/refresh.svg";
import CheckIcon from "@/client/icons/check-stroke.svg";
import TextBIcon from "@/client/icons/text-b.svg";
import { undoAction, redoAction, addAction } from "./editActions";
import IntelliPrompt from "./IntelliPrompt.vue";
import { deltaToMarkdown } from "quill-delta-to-markdown";
import { toDelta } from "@slite/quill-delta-markdown";
import clearMarkdown from "./clearMarkdown";
import { ElMessage } from "element-plus";
import sleep from "./sleep";

const props = defineProps<{
  draftId: number;
  action: EditActionCode;
  cursor: number | null;
  section: DraftSection;
}>();
const emit = defineEmits<{
  focus: [];
  updateAction: [EditActionCode];
  updateDraft: [Draft];
  updateStreamState: [StreamState, Abort?];
}>();

type QuillListType = "ordered" | "bullet";

type QuillSelectionFormat = {
  header?: 1 | 2 | 3;
  list?: QuillListType;
  bold?: boolean;
};

type QuillState = {
  isUndoAvailable?: boolean;
  isRedoAvailable?: boolean;
};

const prompt = ref("");
const markdown = ref("");
// 文档引用
const references = ref<DocumentReference[]>([]);
// 是否已生存过内容
const generated = ref(false);
const streamState = ref<StreamState>();
const abortRef: { value: null | Abort } = { value: null };
const isStreaming = computed(() => streamState.value === "pending" || streamState.value === "streaming");

const containerRef = ref<HTMLDivElement>();
const quillRef: { value: Quill | null } = { value: null };
const quillSelectionFormat = ref<QuillSelectionFormat>({});
const quillState = reactive<QuillState>({});

const isAdd = computed(() => props.action === "add");
const editAction = computed(() => (isAdd.value ? addAction : intelliAction));
const promptPlaceholder = computed(() =>
  isAdd.value ? "请在此输入对新段落的新增要求" : "请在此输入对当前段落的修改要求",
);
const isHeader1Selection = computed(() => quillSelectionFormat.value.header === 1);
const isHeader2Selection = computed(() => quillSelectionFormat.value.header === 2);
const isHeader3Selection = computed(() => quillSelectionFormat.value.header === 3);
const isOrderedListSelection = computed(() => quillSelectionFormat.value.list === "ordered");
const isUnorderedListSelection = computed(() => quillSelectionFormat.value.list === "bullet");
const isBoldSelection = computed(() => quillSelectionFormat.value.bold);
const cursor = computed(() => props.cursor);
const quillVisible = computed(() => {
  // 开始时quill不可见
  // 只要生成过内容quill就可见
  return generated.value;
});

const focusPrompt = () => {
  const quill = quillRef.value;
  if (!quill) return;
  if (quill.isEnabled()) {
    quill.disable();
    quill.blur();
  }
};

const createEditor = (container: HTMLElement) => {
  return new Quill(container, {
    modules: {
      toolbar: false,
      history: {
        maxStack: 3000,
      },
    },
    theme: "snow",
    placeholder: "正在生成内容...",
  });
};

const refreshQuillState = () => {
  const quill = quillRef.value;
  if (!quill) return;
  quillState.isRedoAvailable = quill.history.stack.redo.length > 0;
  quillState.isUndoAvailable = quill.history.stack.undo.length > 0;
};

// 光标移动或者选中文本时, 将这部分文本的格式暴露出来, 以反射到标题栏上
const reflectSelection = () => {
  const quill = quillRef.value;
  if (!quill) return;
  if (!quill.isEnabled()) return;
  quillSelectionFormat.value = quill.getFormat();
};

const undoEdit = () => {
  const quill = quillRef.value;
  if (!quill) return;
  quill.history.undo();
  reflectSelection();
};

const redoEdit = () => {
  const quill = quillRef.value;
  if (!quill) return;
  quill.history.redo();
  reflectSelection();
};

// 再度激活quill
const enableQuillAgain = () => {
  const quill = quillRef.value;
  if (!quill) return;
  if (!quill.isEnabled()) {
    quill.enable();
    quill.update("silent");
    quill.focus();
    // 申领光标
    emit("focus");
  }
};

const formatToHeader = (level: number) => {
  const quill = quillRef.value;
  if (!quill) return;
  quill.format("header", level.toString());
  reflectSelection();
};

const formatToH1 = () => formatToHeader(1);
const formatToH2 = () => formatToHeader(2);
const formatToH3 = () => formatToHeader(3);

const formatToList = (type: QuillListType) => {
  const quill = quillRef.value;
  if (!quill) return;
  quill.format("list", type);
  reflectSelection();
};

const formatToOrderedList = () => formatToList("ordered");
const formatToUnorderedList = () => formatToList("bullet");

const formatToBold = () => {
  const quill = quillRef.value;
  if (!quill) return;
  quill.format("bold", true);
  reflectSelection();
};

// 更新流的状态
const updateStreamState = (state: StreamState, abort?: Abort) => {
  if (streamState.value === state) return;
  streamState.value = state;
  emit("updateStreamState", state, abort);
};

// 重新生成内容
const rewriteContent = async () => {
  const quill = quillRef.value;
  if (!quill) return;
  if (!quill.isEnabled()) {
    quill.enable();
  }
  quill.setText("", "silent");
  markdown.value = "";
  references.value = [];
  const { promise, resolve, reject } = Promise.withResolvers<string>();

  const payload: SectionRegeneratePayload = {
    draft_id: props.draftId,
    section_id: props.section.id,
    target_ordinal: props.section.ordinal,
    user_prompt: prompt.value,
    concise: false,
    list_form: false,
  };
  const [ssePromise, abort] = regenerateDraftSection(payload, (data) => {
    if (!generated.value) {
      generated.value = true;
    }
    if ("text" in data && data.text !== null) {
      markdown.value = clearMarkdown(markdown.value + data.text);
      const ops = <Op[]>toDelta(markdown.value);
      quill.setContents(ops, "silent");
    }
    if ("reference" in data) {
      references.value.push(...data.reference);
    }
    if ("status" in data) {
      if (data.status === "ok") {
        updateStreamState("finished");
        resolve(markdown.value);
      } else {
        updateStreamState("failed");
        reject(data.detail);
      }
    } else {
      updateStreamState("streaming", abort);
    }
  });
  updateStreamState("pending", abort);
  ssePromise.catch(reject);
  return promise;
};

// 创建新的内容
const createContent = async () => {
  const quill = quillRef.value;
  if (!quill) return;
  if (!quill.isEnabled()) {
    quill.enable();
  }
  quill.setText("", "silent");
  markdown.value = "";
  const { promise, resolve, reject } = Promise.withResolvers<string>();

  const payload: SectionCreatePayload = {
    draft_id: props.draftId,
    target_ordinal: props.section.ordinal + 1,
    user_prompt: prompt.value,
    concise: false,
    list_form: false,
  };
  const [ssePromise, abort] = createDraftSection(payload, (data) => {
    if (!generated.value) {
      generated.value = true;
    }
    if ("text" in data && data.text !== null) {
      markdown.value = clearMarkdown(markdown.value + data.text);
      const ops = <Op[]>toDelta(markdown.value);
      quill.setContents(ops, "silent");
    }
    if ("reference" in data) {
      references.value.push(...data.reference);
    }
    if ("status" in data) {
      if (data.status === "ok") {
        updateStreamState("finished");
        resolve(markdown.value);
      } else {
        updateStreamState("failed");
        reject(data.detail);
      }
    } else {
      updateStreamState("streaming", abort);
    }
  });
  updateStreamState("pending", abort);
  ssePromise.catch(reject);
  return promise;
};

// 根据 prompt 生成内容
const generateByPrompt = async () => {
  if (isStreaming.value) return;
  const processError = (err: "aborted" | Error) => {
    if (err === "aborted") {
      updateStreamState("aborted");
    } else {
      ElMessage.error(err);
    }
  };
  if (isAdd.value) {
    await createContent().catch(processError);
  } else {
    await rewriteContent().catch(processError);
  }
};

// 替换内容
const replaceContent = async () => {
  const quill = quillRef.value;
  if (!quill) return;
  const delta = quill.getContents();
  const source = deltaToMarkdown(delta.ops).replaceAll(/\n/g, "\n\n");
  const payload: SectionUpdatePayload = {
    section_id: props.section.id,
    updated_content: source,
    updated_references: references.value,
  };
  const draft = await updateDraftSection(payload);
  emit("updateDraft", draft);
};

// 新增内容
const addContent = async () => {
  const quill = quillRef.value;
  if (!quill) return;
  const delta = quill.getContents();
  const source = deltaToMarkdown(delta.ops).replaceAll(/\n/g, "\n\n");
  const payload: SectionAppendPayload = {
    draft_id: props.draftId,
    content: source,
    references: references.value,
    target_ordinal: props.section.ordinal + 1,
  };
  const draft = await appendDraftSection(payload);
  emit("updateDraft", draft);
};

const cancelEdit = () => emit("updateAction", cancelAction.code);

onMounted(() => {
  const container = containerRef.value;
  if (!container) return;
  const quill = createEditor(container);
  quillRef.value = quill;
  container.addEventListener("click", enableQuillAgain, { capture: true });
  quill.on("selection-change", reflectSelection);
  quill.on("text-change", refreshQuillState);
  if (props.cursor === null) {
    // 申领光标
    // emit("focus");
  }
  if (props.cursor === null || props.cursor === props.section.id) {
    // quill.focus();
  }
  quill.insertText(0, props.section.name + "\n" + props.section.content + "\n");
  // 不希望回滚到初始化前的状态, 所以初始化完毕了后重置了 undo stack
  quill.history.stack.undo = [];
  refreshQuillState();
});

onBeforeUnmount(() => {
  const container = containerRef.value;
  if (!container) return;
  const quill = quillRef.value;
  if (!quill) return;
  container.removeEventListener("click", enableQuillAgain, { capture: true });
  quill.off("selection-change", reflectSelection);
  quill.off("text-change", refreshQuillState);
});

watch(cursor, (value, prev) => {
  const quill = quillRef.value;
  if (!quill) return;

  // 无人申领光标(value === null)时, 且光标之前的占用者不是自身, 申领光标
  if (value === null && prev !== props.section.id) {
    // 申领光标
    emit("focus");
    return;
  }

  // 申领到光标(value === props.section.id)后, 当前编辑器没激活则激活当前编辑器
  // 注意, 未申领到光标就直接激活, 可能会导致多个编辑器来回抢夺光标
  if (value === props.section.id && !quill.isEnabled()) {
    quill.enable();
    quill.focus();
    return;
  }

  // 光标被竞争走了后(value !== props.section.id), 移除自身对光标的控制权
  if (value !== props.section.id && quill.isEnabled()) {
    // disable 当前quill实例, 主要是为了移除光标的控制权, 以便其它quill实例控制光标
    quill.disable();
    return;
  }
});
</script>
<style lang="scss" module>
@use "src/styles/theme";

._ {
  border-radius: 6px;
  border: 1px solid #e1e1e1;
  background: #fff;

  :global {
    .ql-toolbar {
      border: 0 none;
      display: flex;
      align-items: center;
      justify-content: start;
      font-size: 12px;
      border-bottom: 1px solid #dddfe3;
      margin: 0 16px;
      height: 40px;
      padding: 0;

      & button {
        width: 30px;
        height: 30px;
        padding: 7px;
        box-sizing: border-box;
        position: relative;
      }

      button + button::before {
        content: " ";
        width: 0;
        height: 14px;
        line-height: 14px;
        border-left: 1px solid #e1e1e1;
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
      }
    }

    .ql-container {
      border: 0 none;
    }

    .ql-editor {
      padding: 12px 16px;
      line-height: 24px;
      font-size: 16px;

      h1,
      h2,
      h3,
      h4 {
        color: theme.$text-color-primary;
      }

      h2,
      h3,
      h4 {
        line-height: 26px;
      }

      h1 {
        line-height: 28px;
        font-size: 20px;
        margin: 16px 0 8px;

        &:first-of-type {
          margin-top: 0;
        }
      }

      h2,
      h3 {
        font-size: 16px;
      }

      h2 {
        font-weight: bold;
      }

      h3 {
        font-weight: normal;
        text-indent: 9px;
      }

      h4 {
        font-size: 16px;
        font-weight: normal;
        text-indent: 23px;
      }

      p,
      li {
        font-size: 16px;
        line-height: 24px;
        margin: 10px 0;
      }

      hr {
        background-color: #dddfe3;
        border: 0;
        height: 1px;
      }
    }

    .ql-blank::before {
      font-size: 13px;
      line-height: 24px;
      margin: 10px 0;
    }
  }
}

.quill {
  border-top: 1px solid #edeff3;
}

.toolbar {
  display: grid;
  grid-column-gap: 5px;
  grid-auto-columns: min-content;
  grid-auto-flow: column;
  align-items: center;
  height: 40px;
  padding: 0 10px;

  > button {
    width: 32px;
    height: 32px;
  }
}

.bar {
  display: flex;
  align-items: center;
  justify-content: end;
  margin: 10px -8px -10px 0;

  > button {
    position: relative;
    padding: 0 10px;

    &:not(:first-child)::before {
      position: absolute;
      left: 0;
      top: 50%;
      transform: translate(-50%, -50%);
      content: " ";
      height: 13px;
      border-left: 1px solid #ced0d6;
      align-self: center;
    }
  }
}
</style>
