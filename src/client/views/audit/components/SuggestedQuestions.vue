<template>
  <div :class="$style._">
    <Question v-for="(question, index) in contractAuditQuestions" :key="index" :data="question" />
  </div>
</template>
<script setup lang="ts">
import { contractAuditQuestions } from "@/client/utils/AgentQuestions";
import Question from "@/client/components/Question.vue";
</script>
<style module lang="scss">
._ {
  min-height: 200px;
  margin-top: 25px;
  width: 100%;
}
</style>
