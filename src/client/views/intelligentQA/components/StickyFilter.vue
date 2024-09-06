<template>
  <component :is="SideBar" :data="props.chatRecord" />
</template>

<script setup lang="ts">
import { ChatDataState } from "@/client/types/chat";
import { computed } from "vue";
import { AideKey } from "@/client/const";
import FinancialSidebar from "@/client/views/agent/financialReport/Sidebar.vue";
import SurveySidebar from "@/client/views/survey/components/SurveySidebar.vue";
import AuditSidebar from "@/client/views/audit/components/AuditSidebar.vue";
import QaSidebar from "@/client/views/intelligentQA/components/QaSidebar.vue";

const props = defineProps<{
  chatRecord: ChatDataState;
}>();

const SideBar = computed(() => {
  const type = props.chatRecord.answer.agentType;
  if (!type || type === AideKey.NO_AGENT) {
    return QaSidebar;
  }
  switch (props.chatRecord.answer.agentType) {
    case AideKey.ENTERPRISE_RESEARCH:
      return SurveySidebar;
    case AideKey.FINANCIAL_ANALYSIS:
      return FinancialSidebar;
    case AideKey.CONTRACT_AUDIT:
      return AuditSidebar;
    default:
      return null;
  }
});
</script>
