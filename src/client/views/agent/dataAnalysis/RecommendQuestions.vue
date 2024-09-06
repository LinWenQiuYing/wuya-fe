<template>
  <div :class="$style._">
    <Question
      v-for="(question, index) in analysisQuestions"
      :key="index"
      :data="question"
      @click="() => send(question)"
    />
  </div>
</template>
<script setup lang="ts">
import Question from "@/client/components/Question.vue";
import createDataAnalysis from "@/client/hooks/createDataAnalysis.js";
import { analysisQuestions } from "@/client/utils/AgentQuestions";

const props = defineProps<{
  send?: (question: string) => void;
}>();

const send = props.send ?? createDataAnalysis;
</script>
<style module lang="scss">
@use "src/styles/theme";

._ {
  min-height: 200px;
  margin-top: 25px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: repeat(3, min-content);
  grid-auto-rows: minmax(100px, auto);
  grid-column-gap: 10px;
  grid-row-gap: 8px;
}
</style>
