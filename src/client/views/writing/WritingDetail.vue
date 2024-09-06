<template>
  <WritingTopicContext>
    <div :class="$style._">
      <ChatHeader :class="$style.chat_header" />
      <div :class="$style.wrapper">
        <preview-drawer>
          <scroll-observer>
            <div :class="$style.chat_box">
              <ChatBox :outline-visible="!showDrawer" />
            </div>
          </scroll-observer>
        </preview-drawer>
      </div>
    </div>
  </WritingTopicContext>
</template>
<script setup lang="ts">
import ChatBox from "./ChatBox.vue";
import ChatHeader from "@/client/views/intelligentQA/components/ChatHeader.vue";
import useDrawer from "@/client/hooks/useDrawer";
import ScrollObserver from "@/client/components/ScrollObserver.vue";
import PreviewDrawer from "@/client/components/PreviewDrawer.vue";
import WritingTopicContext from "./WritingTopicContext.vue";

const { showDrawer } = useDrawer();
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
  overflow: hidden;
}

.chat_box {
  width: 100%;
  margin: 0 auto;
  height: calc(100% - 52px);
  padding: theme.$padding-md;
  max-width: 1100px;
}
</style>
