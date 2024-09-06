<template>
  <div :class="$style._">
    <Question
      v-for="(question, index) in videoParserQuestions"
      :key="index"
      :data="question"
      @click="() => send(question)"
    />
  </div>
</template>
<script setup lang="ts">
import Question from "@/client/components/Question.vue";
import createParserChat from "@/client/views/video/createParserChat";
import { videoParserQuestions } from "@/client/utils/AgentQuestions";

const props = defineProps<{
  send?: (question: string) => void;
}>();

const send = props.send ?? createParserChat;
</script>
<style module lang="scss">
._ {
  min-height: 200px;
  margin-top: 25px;
  width: 100%;
}
</style>
