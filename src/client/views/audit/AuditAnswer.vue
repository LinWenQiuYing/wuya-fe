<template>
  <div :class="$style._">
    <ChatHeader :class="$style.chat_header" />
    <div :class="$style.wrapper">
      <scroll-observer>
        <div :class="$style.chat_box">
          <ChatBox />
        </div>
      </scroll-observer>
      <div v-show="showDrawer" :class="$style.right">
        <PdfPreview v-if="drawerType === 'pdf'" />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import ChatBox from "./components/ChatBox.vue";
import ChatHeader from "@/client/views/intelligentQA/components/ChatHeader.vue";
import { onMounted } from "vue";
import store from "@/store";
import { useRouter } from "vue-router";
import PdfPreview from "@/client/views/intelligentQA/components/PdfPreview.vue";
import useDrawer from "@/client/hooks/useDrawer";
import ScrollObserver from "@/client/components/ScrollObserver.vue";

const { showDrawer, drawerType } = useDrawer();

const router = useRouter();

onMounted(async () => {
  if (store.state.chat.auditData.length < 1) {
    await router.push("/contract");
  }
});
</script>

<style lang="scss" module>
@use "src/styles/theme";

._ {
  overflow: auto;
  width: 100%;
  height: 100%;
}

.chat_header {
  position: sticky;
  z-index: 99;
  top: 0;
}

.header_input {
  height: 60px;
  line-height: 60px;
}

.wrapper {
  display: flex;
  width: 100%;
  height: calc(100% - 52px);
  background: #fff;
  border-top-left-radius: 14px;
}

.chat_box {
  width: 100%;
  margin: 0 auto;
  height: calc(100% - 52px);
  padding: theme.$padding-md;
  max-width: 1100px;
}

.left {
  flex: 1;
  width: 100%;
  height: 100%;
  overflow: auto;
  transition: width 3s;
}

.right {
  border-left: 1px solid #e0e4f1;
  flex: 1;
  width: 100%;
  height: 100%;
}
</style>
