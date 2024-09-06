<template>
  <Guide
    :create-chat-topic="createDataAnalysis"
    :hidden-icp="true"
    :placeholder="analysisPlaceholder"
    :AgentParams="analysisTooltip"
  >
    <template #recommend>
      <recommend-questions />
    </template>
  </Guide>
</template>
<script setup lang="ts">
import Guide from "@/client/views/Guide.vue";
import createDataAnalysis from "@/client/hooks/createDataAnalysis";
// import { onBeforeUnmount, onMounted } from "vue";
// import store from "@/store";
// import { AgentKey } from "@/client/const";
import RecommendQuestions from "./RecommendQuestions.vue";
import { AideKey, aideList } from "@/client/const";

const analysisPlaceholder = "我是数据分析助手，可以深入研究xlsx和csv格式数据，快速给出解答";
const analysisTooltip = aideList.find((item) => item.key === AideKey.DATA_ANALYSIS)!;
// onMounted(() => {
//   store.commit("agent/SET_TYPE", AgentKey.ANALYSIS);
// });
//
// onBeforeUnmount(() => {
//   store.commit("agent/SET_TYPE", "");
// });
</script>
<style lang="scss" module></style>
