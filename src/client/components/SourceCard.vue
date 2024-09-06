<!-- 数据源卡片 -->
<template>
  <div :class="[$style._, { active: isActive, dashed: isDashed, disabled: props.disabled }]">
    <div :class="$style.title" :title="props.data.title">
      <component :is="data.icon.pc" v-if="props.data.icon" :class="$style.icon" />
      <span>{{ props.data.title }}</span>
    </div>
    <div :class="isMobile ? $style.desc_h5 : $style.desc" :title="props.data.desc">
      {{ props.data.desc }}
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Source } from "@/client/const";
import { isMobile } from "@/config";

const props = defineProps<{
  isActive?: boolean;
  isDashed?: boolean;
  disabled?: boolean;
  data: Source;
}>();
</script>
<style lang="scss" module>
@use "src/styles/theme";
@use "src/styles/mixins";

.icon {
  width: 20px;
  flex-grow: 0;
  flex-shrink: 0;
  fill: theme.$text-color-primary;
  margin-right: 3px;
  margin-left: -23px;
}

.title {
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.desc {
  @include mixins.hide-lines(2);
  font-size: theme.$font-size-sm;
  color: theme.$text-color-secondary;
  line-height: 20px;
  font-weight: 400;
}

.desc_h5 {
  font-size: theme.$font-size-sm;
  color: theme.$text-color-secondary;
  line-height: 20px;
  font-weight: 400;
  width: 100% !important;
  word-break: break-word;
  white-space: pre-line;
}

._ {
  display: flex;
  flex-direction: column;
  padding: 8px 4px 8px 28px;
  font-size: theme.$font-size-base;
  color: theme.$text-color-primary;
  line-height: 22px;
  font-weight: 400;
  border: 1px solid transparent;
  cursor: pointer;

  &:hover {
    background: #f0f3fa;
    border-radius: theme.$border-radius-xxl;
  }

  &:global(.active) {
    border: 1px solid theme.$color-primary;
    border-radius: theme.$border-radius-xxl;

    &:hover {
      background: theme.$color-white;
    }
  }

  &:global(.dashed) {
    border: 1px dashed theme.$color-primary;

    &:hover {
      background: theme.$color-white;
    }
  }

  &:global(.disabled) {
    border: none;
    cursor: not-allowed;

    &:hover {
      background: #f0f3fa;
    }
  }
}
</style>
