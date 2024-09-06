<template>
  <div :class="$style._">
    <Question
      v-for="(question, index) in customerServiceQuestions"
      :key="index"
      :data="question"
      @click="() => send(question)"
    />
  </div>
</template>
<script setup lang="ts">
import Question from "@/client/components/Question.vue";
import { customerServiceQuestions } from "@/client/utils/AgentQuestions";
import createServiceChat from "@/client/views/customerService/createServiceChat";

const props = defineProps<{
  send?: (question: string) => void;
}>();

const send = props.send ?? createServiceChat;
</script>
<style module lang="scss">
._ {
  min-height: 200px;
  margin-top: 25px;
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: repeat(3, min-content);
  grid-auto-rows: minmax(100px, auto);
  grid-column-gap: 10px;
  grid-row-gap: 8px;
}
</style>
