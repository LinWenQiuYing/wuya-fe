<template>
  <div :class="$style._">
    <component
      :is="props.icon"
      :class="$style.icon"
      :style="`--animation-play-state: ${props.animated ? 'running' : 'paused'}`"
    />
    <span :class="$style.title">{{ props.title }}</span>
    <slot />
  </div>
</template>
<script setup lang="ts">
import type { Component } from "vue";

const props = defineProps<{
  title?: string;
  icon: Component;
  animated?: boolean;
}>();
</script>
<style lang="scss" module>
@import "src/styles/theme";

._ {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  height: 40px;
  font-size: 18px;
  line-height: 24px;
  color: $text-color-primary;
}

.icon {
  fill: $text-color-primary;
  width: 20px;
  margin-right: 4px;
}

.title {
  padding-left: 3px;
  font-weight: 500;
  margin-right: auto;
}
</style>
