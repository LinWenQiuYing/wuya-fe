<template>
  <div :class="$style._">
    <ChatHeader :class="$style.chat_header" />
    <preview-drawer :class="$style.wrapper">
      <scroll-observer>
        <div :class="$style.chat_box">
          <ChatBox />
        </div>
      </scroll-observer>
    </preview-drawer>
  </div>
</template>
<script setup lang="ts">
import ChatBox from "./components/ChatBox.vue";
import ChatHeader from "@/client/views/intelligentQA/components/ChatHeader.vue";
import { onMounted } from "vue";
import store from "@/store";
import { useRouter } from "vue-router";
import ScrollObserver from "@/client/components/ScrollObserver.vue";
import PreviewDrawer from "@/client/components/PreviewDrawer.vue";

const router = useRouter();

onMounted(async () => {
  if (store.state.chat.surveyData.length < 1) {
    await router.push("/survey");
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
</style>
