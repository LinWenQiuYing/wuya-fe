<template>
  <div :class="[$style._, { resizable: editorVisible }]">
    <button
      :title="switchButtonTitle"
      type="button"
      :class="[$style.switchBtn, editorVisible ? $style.normal : $style.closed]"
      @click="switchEditorDisplay"
    >
      <ExpandLeftIcon v-if="editorVisible" />
      <MindMappingIcon v-else />
    </button>
    <div v-show="editorVisible" :class="$style.layout">
      <div :class="$style.header">{{ props.optionText?.title || "大纲" }}</div>
      <div ref="containerRef" :class="$style.main" />
      <button type="button" :class="$style.rebuildBtn" @click="generateOutline" v-if="props.isRebuild">
        <VideoPlay :class="$style.playIcon" />
        <span>{{ props.optionText?.btnText || "生成新的内容" }}</span>
      </button>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, onMounted, Ref, computed, watch } from "vue";
import { VideoPlay } from "@element-plus/icons-vue";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import ExpandLeftIcon from "@/client/icons/expand-left.svg";
import MindMappingIcon from "@/client/icons/mind-mapping.svg";
import htmlToMarkdown from "./htmlToMarkdown";
import parseMarkdownToOps from "./parseMarkdownToOps";

type OptionTextState = {
  title: string;
  btnText: string;
};
const props = defineProps<{
  value: string;
  optionText?: OptionTextState;
  isRebuild?: boolean;
  readonly?: boolean;
}>();

const emit = defineEmits<{
  generate: [string];
}>();

const containerRef = ref<HTMLDivElement>();
const editorVisible = ref<boolean>(true);
const editorRef = <Ref<Quill | null>>{ value: null };

const switchButtonTitle = computed(() => {
  return editorVisible.value ? "收起大纲" : "展开大纲";
});

const createEditor = (container: HTMLElement) => {
  return new Quill(container, {
    readOnly: props.readonly,
    modules: {
      toolbar: [{ header: "1" }, { header: "2" }, { header: "3" }, { header: "4" }],
    },
    formats: ["header"],
    theme: "snow",
  });
};

onMounted(() => {
  const container = containerRef.value;
  if (!container) return;
  const quill = createEditor(container);
  editorRef.value = quill;
  if (!props.value) return;
  const ops = parseMarkdownToOps(props.value, !!props.optionText);
  quill.setContents(ops);
});

watch(
  () => props.value,
  (value) => {
    const quill = editorRef.value;
    if (!quill) return;
    const ops = parseMarkdownToOps(value, !!props.optionText);
    quill.setContents(ops);
  },
);

const switchEditorDisplay = () => {
  editorVisible.value = !editorVisible.value;
};

const generateOutline = () => {
  const editor = editorRef.value;
  if (!editor) return;
  const html = editor.getSemanticHTML();
  const markdown = htmlToMarkdown(html);
  emit("generate", markdown);
};
</script>
<style lang="scss" module>
@use "src/styles/theme";

$border-color-outline: #dddfe3;

._ {
  position: relative;
  width: 280px;
  min-height: 32px;

  &:global(.resizable) {
    resize: horizontal;
    overflow-x: auto;
  }
}

.layout {
  height: 600px;
  border-radius: 8px;
  border: 1px solid $border-color-outline;
  padding-top: 16px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;

  :global {
    .ql-toolbar {
      border: 0 none;
      background: #f0f0f0;
      opacity: 0.7;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      font-size: 12px;
      padding: 0 12px;

      & button {
        width: 30px;
        height: 30px;
        padding: 7px;
        position: relative;

        &:hover {
          background: #ddd;
        }
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
      border-bottom: 1px solid $border-color-outline;
    }

    .ql-editor {
      padding: 14px 20px;

      h1,
      h2,
      h3,
      h4 {
        color: theme.$text-color-primary;
      }

      h2,
      h3,
      h4 {
        line-height: 24px;
      }

      h1 {
        line-height: 26px;
        font-size: 18px;
        margin: 16px 0 8px;

        &:first-of-type {
          margin-top: 0;
        }
      }

      h2,
      h3 {
        font-size: 14px;
      }

      h2 {
        font-weight: bold;
      }

      h3 {
        font-weight: normal;
        text-indent: 9px;
      }

      h4 {
        font-size: 14px;
        font-weight: normal;
        text-indent: 23px;
      }

      p {
        font-size: 14px;
      }
    }
  }
}

.header {
  font-size: 16px;
  line-height: 24px;
  color: theme.$text-color-primary;
  height: 32px;
  padding: 0 20px;
  user-select: none;
}

.main {
  flex: 1;
  overflow: auto;
}

.rebuildBtn {
  border: 0 none;
  background: unset;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: theme.$color-primary;
  font-size: 14px;
  font-family: inherit;
  transition: opacity 0.3s ease-in-out;

  &:hover {
    opacity: 0.8;
  }
}

.playIcon {
  width: 18px;
  margin-right: 3px;
}

.switchBtn {
  position: absolute;
  top: 0;
  right: 0;
  width: 50px;
  height: 50px;
  box-sizing: border-box;
  color: theme.$text-color-primary;
  cursor: pointer;
  background: unset;
  display: flex;
  align-items: center;
  transition:
    color 0.3s ease-in-out,
    transform 0.3s ease-in-out;

  &:hover {
    color: theme.$color-primary;
  }

  svg {
    height: 20px;
    fill: currentColor;
    margin: auto;
  }
}

.normal {
  transform: rotateY(180deg);
  border: 1px solid transparent;
}

.closed {
  border-radius: 8px;
  border: 1px solid $border-color-outline;
}
</style>
