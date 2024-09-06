<template>
  <div :class="$style.main">
    <div :class="[$style.left, isMobile && $style.h5_left]">
      <slot />
    </div>
    <div v-if="showDrawer" :class="[$style.right, isMobile && $style.mobile_drawer]">
      <PdfPreview v-if="drawerType === 'pdf'" />
      <AtlasPreview v-else-if="drawerType === 'atlas'" />
    </div>
  </div>
</template>
<script setup lang="ts">
import AtlasPreview from "@/client/views/intelligentQA/components/AtlasPreview.vue";
import PdfPreview from "@/client/views/intelligentQA/components/PdfPreview.vue";
import useDrawer from "@/client/hooks/useDrawer";
import { onBeforeUnmount, watch } from "vue";
import store from "@/store";
import { isMobile } from "@/config";

const { showDrawer, drawerType, closeDrawer } = useDrawer();

onBeforeUnmount(() => {
  closeDrawer();
});
// 通过chat_id判断是否话题切换，然后关闭抽屉
watch(
  () => store.state.chat.chat_id,
  () => {
    showDrawer.value && closeDrawer();
  },
);
</script>

<style module lang="scss">
@use "src/styles/theme";

.main {
  height: 100%;
  width: 100%;
  display: flex;
  background: white;
}

.left {
  flex: 1;
  width: 50%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: auto;
}

.mobile_drawer {
  position: fixed;
  top: 0;
  z-index: 9999;
}

.h5_left {
  width: 100%;
}

.right {
  flex: 1;
  width: 50%;
  height: 100%;
}
</style>
