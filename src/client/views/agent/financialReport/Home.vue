<template>
  <Guide
    :create-chat-topic="createFinancialReport"
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
import createFinancialReport from "@/client/hooks/createFinancialReport";
import RecommendQuestions from "./RecommendQuestions.vue";
import { AideKey, aideList } from "@/client/const";

const analysisPlaceholder = "我是财报审核助手，可以审核包含资产负债表、利润表和现金流量表的年报和季度报";
const analysisTooltip = aideList.find((item) => item.key === AideKey.FINANCIAL_ANALYSIS)!;
</script>
<style lang="scss" module></style>
