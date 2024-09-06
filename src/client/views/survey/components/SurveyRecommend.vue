<template>
  <p :class="$style.title">热门报告<FlameIcon :class="$style.icon" /></p>
  <div :class="$style._">
    <PresetProblem
      v-for="(question, index) in surveyQuestions"
      :key="index"
      :data="question"
      @click="() => create(question)"
    />
  </div>
</template>
<script setup lang="ts">
import { surveyQuestions } from "@/client/utils/AgentQuestions";
import PresetProblem from "@/client/views/survey/components/PresetProblem.vue";
import createSurveyTopic from "@/client/hooks/createSurveyTopic";
import FlameIcon from "@/client/icons/flame.svg";

const props = defineProps<{
  send?: (question: string, options?: { rule?: string }) => void;
}>();

const send = props.send ?? createSurveyTopic;

const create = (question: string) => {
  send(question);
};
</script>
<style module lang="scss">
.title {
  width: 100%;
  margin: 25px 0 10px;
  text-align: left;
  font-weight: bold;
}

.icon {
  width: 22px;
  vertical-align: bottom;
}
._ {
  min-height: 200px;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: repeat(3, min-content);
  grid-auto-rows: minmax(100px, auto);
  grid-column-gap: 10px;
  grid-row-gap: 8px;
}
</style>
