<template>
  <div v-show="props.show" :class="$style._">
    <el-skeleton v-if="isLoading" :class="$style.skeleton" animated>
      <template #template>
        <el-skeleton-item style="width: 100%" variant="p" />
        <el-skeleton-item style="width: 70%" variant="p" />
        <el-skeleton-item style="width: 35%" variant="p" />
      </template>
    </el-skeleton>
    <div v-else>
      <div :class="$style.header">
        <el-icon @click="onClose">
          <Close />
        </el-icon>
      </div>
      <div ref="contentRef">
        <Markdown :html="translateMarkdown" />
      </div>
      <div :class="$style.operation" @click="copyText">
        <CopyIcon :class="$style.operation_icon" />
        <span :class="$style.title">复制</span>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { Close } from "@element-plus/icons-vue";
import CopyIcon from "@/client/icons/copy.svg";
import { watch, ref } from "vue";
import useTranslate from "@/client/hooks/useTranslate";
import { ElMessage } from "element-plus";
import "highlight.js/styles/a11y-light.css";
import Markdown from "./Markdown.vue";

const props = defineProps<{
  language: string;
  data: string;
  show: boolean;
  formatEnMarkdown: (value: string) => string;
}>();

const emit = defineEmits(["closeTranslation"]);
const contentRef = ref<HTMLElement>();
const { isLoading, translateMarkdown, toTranslate } = useTranslate();

watch([() => props.show, () => props.language], async ([, language]) => {
  if (props.data && language) {
    const data = props.data.replaceAll(/(<span class="corner-mark">)(\d+)(<\/span>)/g, replacer);
    await toTranslate(data, language);
  }
});
const onClose = () => {
  emit("closeTranslation", false);
};
const copyText = () => {
  const answerElement = contentRef.value;
  if (answerElement) {
    const data = props.formatEnMarkdown(answerElement.innerText);
    const textarea = document.createElement("textarea");
    textarea.value = data;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
    ElMessage.success("复制成功");
  }
};

function replacer(match: string, p1: string, p2: string, p3: string): string {
  return `[${p2}]`;
}
</script>
<style module lang="scss">
@use "src/styles/theme";

._ {
}

.skeleton {
  padding-top: theme.$padding-xxl;
}

.header {
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  cursor: pointer;

  &:hover {
    color: theme.$color-primary;
  }
}

.operation_icon {
  fill: theme.$text-color-primary;
  height: 15px;
}

.operation {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  cursor: pointer;

  &:hover {
    color: theme.$color-primary;

    .operation_icon {
      fill: theme.$color-primary;
    }
  }
}

.title {
  padding: 0 theme.$padding-md 0 2px;
  font-size: theme.$font-size-base;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
