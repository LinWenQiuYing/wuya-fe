<template>
  <div :class="$style.pdf_box" ref="boxRef">
    <iframe
      :class="$style.iframe_box"
      ref="iframeRef"
      :src="`/pdfjs/web/viewer.html?file=${props.pdfUrl}`"
      @load="onMouse"
    />
    <div :class="$style.translate" v-show="isShowTranslate" ref="transRef" v-loading="transLoading">
      <div :class="$style.text" v-html="translatedText" />
      <div :class="$style.opera">
        <CopyIcon :class="$style.copy" @click="copyTranslateFn" />
      </div>
    </div>
    <div :class="$style.tip" v-show="isShowTip" ref="tipRef">
      <span @click="onTranslate">翻译</span>
      <span :class="$style.line" />
      <span @click="copyFn">复制</span>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, onBeforeUnmount } from "vue";
import { ElMessage } from "element-plus";
import useIframeEvent from "./hooks/useIframeEvent";
import CopyIcon from "@/client/icons/copy.svg";
import copyToClipboard from "./utils/copyToClipboard";

const props = defineProps<{
  pdfUrl: string;
}>();
const boxRef = ref();
const iframeRef = ref();
const tipRef = ref();
const transRef = ref();
const {
  isShowTip,
  isShowTranslate,
  transLoading,
  selectText,
  translatedText,
  onMouse,
  removeMouse,
  onTranslate,
} = useIframeEvent(boxRef, iframeRef, tipRef, transRef);

const copyFn = () => {
  isShowTip.value = false;
  copyToClipboard(selectText.value);
  ElMessage.success("复制成功");
};

const copyTranslateFn = () => {
  isShowTip.value = false;
  isShowTranslate.value = false;
  copyToClipboard(translatedText.value);
  ElMessage.success("复制成功");
};

onBeforeUnmount(() => {
  removeMouse();
});
</script>

<style lang="scss" module>
@use "src/styles/theme";

.pdf_box {
  position: relative;
  height: 100%;
  width: 100%;
}

.iframe_box {
  border: none;
  width: 100%;
  height: 100%;
}

.translate {
  position: absolute;
  right: 0;
  top: 200px;
  min-width: 120px;
  max-width: 420px;
  min-height: 64px;
  max-height: 400px;
  width: fit-content;
  font-size: theme.$font-size-sm;
  padding: theme.$padding-sm theme.$padding-sm 0;
  background-color: theme.$color-white;
  box-shadow: 6px 6px 12px 6px rgba(45, 54, 77, 0.1);
  border-radius: theme.$border-radius-md;
  display: flex;
  flex-direction: column;

  :global {
    .circular {
      width: 25px;
      height: 25px;
    }

    .el-loading-mask {
      border-radius: theme.$border-radius-md;
    }
  }
}

.text {
  flex: 1;
  line-height: 22px;
  word-break: keep-all;
  word-wrap: break-word;
  white-space: pre-wrap;
  text-align: justify;
  text-justify: inter-ideograph;
  overflow: auto;
}

.opera {
  flex: 0 0 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.copy {
  display: inline-block;
  height: 16px;
  cursor: pointer;
  fill: theme.$text-color-primary;
}

.tip {
  position: absolute;
  left: 0;
  top: 0;
  height: 24px;
  line-height: 24px;
  width: 80px;
  cursor: pointer;
  color: theme.$color-white;
  padding: 0 5px;
  font-size: theme.$font-size-sm;
  background: #2d364d;
  border-radius: theme.$border-radius-md;
  opacity: 0.8;
  display: flex;
  align-items: center;
  justify-content: center;

  > span {
    line-height: 24px;
  }
}

.line {
  width: 1px;
  height: 10px;
  margin: 0 5px;
  background: #6d7588;
}
</style>
