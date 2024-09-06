<template>
  <div :class="$style._">
    <TopicGenerateButton v-if="generatorVisible" :class="$style.btn" />
    <KnowledgeSource v-show="sourcesVisible" :class="$style.sources" :is-readonly="sourcesIsReadonly" />
    <div v-show="sourcesVisible" :class="$style.divider"></div>
    <HistoryChat v-show="historyVisible" :class="$style.history" />
  </div>
</template>
<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import TopicGenerateButton from "./components/TopicGenerateButton.vue";
import KnowledgeSource from "./components/KnowledgeSource.vue";
import HistoryChat from "./components/HistoryChat.vue";
import getSidecarVisible from "@/client/layout/getSidecarVisible";

const route = useRoute();
const generatorVisible = computed(() => getSidecarVisible("topicGenerator", route.meta.sidecar));
const sourcesVisible = computed(() => getSidecarVisible("sources", route.meta.sidecar));
const historyVisible = computed(() => getSidecarVisible("history", route.meta.sidecar));
const sourcesIsReadonly = computed(() => sourcesVisible.value === "readonly");
</script>
<style lang="scss" module>
@use "src/styles/theme";

._ {
  flex: 1;
  width: 272px;
  height: 100%;
  padding: 6px theme.$padding-md;
  display: flex;
  flex-direction: column;
}

.btn {
  flex: 0 0 40px;
  height: 40px;
}

.sources {
  max-height: calc((100% - 40px) / 2);
  overflow: hidden;
  padding-top: 25px;
}

.divider {
  height: 1px;
  width: 100%;
  background: #e0e4f1;
}

.history {
  flex: 1;
  padding: theme.$padding-md 0;
}
</style>
