<!-- 资讯详情 -->
<template>
  <div :class="[isMobile ? $style.h5 : $style.pc, $style._]">
    <AsideDynamicVisibleFilter>
      <ChatHeader :class="$style.header" />
    </AsideDynamicVisibleFilter>
    <preview-drawer :class="$style.body">
      <scroll-observer>
        <div :class="$style.qa_chat_box">
          <ChatBox />
        </div>
      </scroll-observer>
    </preview-drawer>
  </div>
</template>

<script setup lang="ts">
import ChatBox from "@/client/views/intelligentQA/components/ChatBox.vue";
import ChatHeader from "@/client/views/intelligentQA/components/ChatHeader.vue";
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import store from "@/store";
import AsideDynamicVisibleFilter from "@/client/layout/AsideDynamicVisibleFilter.vue";
import { isMobile } from "@/config";
import ScrollObserver from "@/client/components/ScrollObserver.vue";
import PreviewDrawer from "@/client/components/PreviewDrawer.vue";

const router = useRouter();

onMounted(async () => {
  if (!store.state.chat.question || store.state.chat.question === "") {
    await router.replace("/news");
  }
});
</script>

<style lang="scss" module>
@use "src/styles/theme";

._ {
  width: 100%;
  height: 100%;
}

.pc {
  .body {
    &:first-child {
      height: 100%;
    }

    &:not(:first-child) {
      height: calc(100% - 52px);
      border-top-left-radius: 14px;
    }
  }

  .qa_chat_box {
    max-width: 1100px;
    margin: 0 auto;
    height: 100%;
    padding: 20px 36px;
  }
}

.body {
  flex: 1;
}

.header {
  position: sticky;
  z-index: 10;
  top: 0;
}

.h5 {
  .header {
    display: none;
  }

  .body {
    display: flex;
    flex-direction: column;
  }
}
</style>
