<template>
  <slot v-if="inSurvey" name="survey"></slot>
  <slot v-else-if="inAudit" name="audit"></slot>
  <slot v-else name="default"></slot>
</template>

<script setup lang="ts">
import useActiveModule from "@/client/layout/useActiveModule";
import { computed } from "vue";
import store from "@/store";
import { AideKey } from "@/client/const";

const activeModule = useActiveModule();
const agent = computed(() => store.state.agent.type);

const inSurvey = computed(
  () => activeModule.value === "survey" || agent.value === AideKey.ENTERPRISE_RESEARCH,
);
const inAudit = computed(() => activeModule.value === "contract" || agent.value === AideKey.CONTRACT_AUDIT);
</script>

<style scoped lang="scss"></style>
