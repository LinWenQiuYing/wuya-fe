<template>
  <div :class="$style.pdf_preview">
    <div :class="$style.header">
      <Close :class="$style.close" @click="onClose" />
    </div>
    <div v-loading="pdfLoading" :class="$style.content">
      <PdfComponent :pdf-url="<string>pdfUrl" />
    </div>
  </div>
</template>
<script setup lang="ts">
import PdfComponent from "@/client/components/pdfComponent/index.vue";
import { Close } from "@element-plus/icons-vue";
import useDrawer from "@/client/hooks/useDrawer";
import usePdfPreview from "@/store/hooks/usePdfPreview";

const { pdfUrl, pdfLoading } = usePdfPreview();
const { closeDrawer } = useDrawer();
const onClose = () => {
  pdfUrl.value = null;
  closeDrawer();
};
</script>

<style lang="scss" module>
@use "src/styles/theme";

.pdf_preview {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
}

.header {
  z-index: 99;
  position: absolute;
  right: 2px;
  top: 2px;
  width: 28px;
  height: 28px;
  background-color: #323639;
  border-radius: 2px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: #dddedf;

    .close {
      color: theme.$text-color-primary;
    }
  }
}

.close {
  width: 18px;
  height: 18px;
  color: #fff;
}

.title {
  flex: 1;
  font-size: theme.$font-size-xl;
  font-weight: 700;
}

.content {
  height: 100%;
  width: 100%;
}
</style>
