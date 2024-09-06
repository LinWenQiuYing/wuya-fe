<template>
  <div class="question-wrapper">
    <div class="question-content" :title="props.data?.title">
      <span class="type-title">{{ getType(props.data?.type) }}</span>
      <span>
        {{ props.data?.title }}
      </span>
    </div>
    <Right class="right-icon" />
  </div>
</template>

<script setup lang="ts">
import { Right } from "@element-plus/icons-vue";
import { HotQuestionsState } from "@/client/hooks/useRecommendedQuestions";

const props = defineProps<{ data?: HotQuestionsState }>();

const getType = (type: string = "") => {
  switch (type) {
    case "hot":
      return "财经";
    case "realtime":
      return "资讯";
    case "report":
      return "年报";
    default:
      return "";
  }
};
</script>

<style lang="scss" scoped>
@import "src/styles/theme";
@import "src/styles/mixins";

.question-wrapper {
  height: 40px;
  padding: 0 $padding-md;
  background: #edeff3;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;

  &:hover {
    .question-content {
      font-weight: 700;
    }

    .right-icon {
      color: $color-primary;
    }
  }

  .question-content {
    flex: 1;
    font-size: $font-size-base;
    color: $text-color-primary;
    font-weight: 400;
    @include hide-lines(1);
  }

  .type-title {
    font-weight: bold;
    font-size: 14px;
    margin-right: 8px;
    font-style: normal;
    background: linear-gradient(225.70731937895295deg, #1776ff 0%, #6ac9ff 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    color: transparent;
  }

  .right-icon {
    flex: 0 0 20px;
    width: 20px;
    height: 20px;
  }
}
</style>
