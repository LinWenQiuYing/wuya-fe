<template>
  <div :class="$style._">
    <div :class="$style.header">
      <ControlBar :class="$style.bar" />
      <button type="button" :class="$style.close" @click.stop="hideAside">
        <CloseIcon />
      </button>
    </div>
    <div :class="$style.body">
      <el-tabs v-model="activeTab">
        <el-tab-pane v-if="sourcesVisible" name="sources" label="知识源" />
        <el-tab-pane v-if="historyVisible" name="history" label="历史收藏" />
      </el-tabs>
      <KnowledgeSource
        v-if="sourcesVisible"
        v-show="activeTab === 'sources'"
        :is-readonly="sourcesIsReadonly"
        :class="$style.sources"
      />
      <HistoryChat v-if="historyVisible" v-show="activeTab === 'history'" :class="$style.history" />
    </div>
  </div>
</template>
<script lang="ts" setup>
import CloseIcon from "@/client/icons/xmark.svg";
import { computed, ref } from "vue";
import getSidecarVisible from "@/client/layout/getSidecarVisible";
import KnowledgeSource from "@/client/layout/components/KnowledgeSource.vue";
import HistoryChat from "@/client/layout/components/HistoryChat.vue";
import ControlBar from "@/client/layout/ControlBar.vue";
import { useRoute } from "vue-router";

const asideVisible = defineModel<boolean>("visible", { required: true });

const route = useRoute();
const sourcesVisible = computed(() => getSidecarVisible("sources", route.meta.sidecar));
const historyVisible = computed(() => getSidecarVisible("history", route.meta.sidecar));
const activeTab = ref(sourcesVisible.value ? "sources" : "history");
const sourcesIsReadonly = computed(() => sourcesVisible.value === "readonly");

const hideAside = () => (asideVisible.value = false);
</script>
<style lang="scss" module>
@use "src/styles/theme";

._ {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: flex-start;
  padding-top: 5px;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 5px;
}

.close {
  width: 44px;
  height: 44px;
  padding: 0;
  box-sizing: border-box;
  border: 0 none;
  box-shadow: none;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: transparent;
  outline: 0 none;
  margin-left: auto;
  color: #404040;

  > svg {
    width: 20px;
    display: block;
    fill: currentColor;
  }
}

.body {
  padding: 0 10px;
  overflow: hidden;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.bar {
  margin-top: auto;
  flex: 1;
}
</style>
