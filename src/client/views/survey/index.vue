<template>
  <Guide
    :hidden-icp="true"
    :placeholder="placeholder"
    :AgentParams="surveyTooltip"
    :create-chat-topic="createSurveyTopic"
  >
    <template #recommend>
      <SurveyRecommend />
    </template>
  </Guide>
</template>
<script setup lang="ts">
import createSurveyTopic from "@/client/hooks/createSurveyTopic";
import { AideKey, aideList } from "@/client/const";
import Guide from "@/client/views/Guide.vue";
import SurveyRecommend from "@/client/views/survey/components/SurveyRecommend.vue";

const surveyTooltip = aideList.find((item) => item.key === AideKey.ENTERPRISE_RESEARCH)!;
const placeholder = "请输入公司名";
</script>
<style lang="scss" module>
@use "src/styles/theme";

.question {
  margin: theme.$margin-xss;
}
</style>
