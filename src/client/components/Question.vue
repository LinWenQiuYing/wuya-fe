<!-- 推荐问题 -->
<template>
  <div class="question-wrapper">
    <div class="question-content" :title="data">
      {{ data }}
    </div>
    <Right class="right-icon" />
  </div>
</template>

<script setup lang="ts">
import { Right } from "@element-plus/icons-vue";

const props = withDefaults(
  defineProps<{
    data?: string;
  }>(),
  {
    data: "",
  },
);
</script>

<style lang="scss" scoped>
@import "../../styles/theme";
@import "../../styles/mixins";

.question-wrapper {
  height: 40px;
  padding: 0 $padding-md;
  max-width: 100%;
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

  .right-icon {
    flex: 0 0 20px;
    width: 20px;
    height: 20px;
  }
}
</style>
