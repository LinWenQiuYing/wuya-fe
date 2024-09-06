<template>
  <template v-if="agent && agent !== AideKey.NO_AGENT">
    <component :is="questionsCom" :send="send" />
  </template>
  <slot v-else></slot>
</template>

<script setup lang="ts">
import store from "@/store";
import { computed } from "vue";
import { AideKey } from "@/client/const";
import createChatTopic from "@/client/hooks/createChatTopic";
import SurveyRecommend from "@/client/views/survey/components/SurveyRecommend.vue";
import Questions from "@/client/views/video/components/Questions.vue";
import RecommendQuestions from "@/client/views/agent/dataAnalysis/RecommendQuestions.vue";
import SuggestedQuestions from "@/client/views/audit/components/SuggestedQuestions.vue";
import ServiceQuestion from "@/client/views/customerService/components/Questions.vue";
import FinancialQuestions from "@/client/views/agent/financialReport/RecommendQuestions.vue";

const agent = computed(() => store.state.agent.type);

const questionsCom = computed(() => {
  switch (agent.value) {
    case AideKey.ENTERPRISE_RESEARCH:
      return SurveyRecommend;
    case AideKey.VIDEO_PARSE:
      return Questions;
    case AideKey.DATA_ANALYSIS:
      return RecommendQuestions;
    case AideKey.CUSTOMER_SERVICE:
      return ServiceQuestion;
    case AideKey.FINANCIAL_ANALYSIS:
      return FinancialQuestions;
    default:
      return SuggestedQuestions;
  }
});

const send = async (query: string, options?: { rule?: string }) => {
  await createChatTopic(query, options);
};
</script>

<style scoped lang="scss"></style>
