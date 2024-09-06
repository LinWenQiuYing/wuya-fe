<template>
  <Guide
    :create-chat-topic="createAuditChat"
    :hidden-icp="true"
    :placeholder="auditPlaceholder"
    :AgentParams="auditTooltip"
  >
    <template #recommend>
      <suggested-questions />
    </template>
  </Guide>
</template>

<script setup lang="ts">
import SuggestedQuestions from "@/client/views/audit/components/SuggestedQuestions.vue";
import createAuditChat from "@/client/hooks/createAuditChat";
import Guide from "@/client/views/Guide.vue";
import { AideKey, aideList } from "@/client/const";

const auditPlaceholder = "我是合同审核助手，可以快速审核docx和pdf格式合同";
const auditTooltip = aideList.find((item) => item.key === AideKey.CONTRACT_AUDIT)!;
</script>

<style scoped lang="scss"></style>
