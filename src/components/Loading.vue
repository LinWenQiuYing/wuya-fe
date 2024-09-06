<template>
  <div :class="$style.edit_loading">
    <div :class="$style.loading" :style="inlineStyles"></div>
    <span :class="$style.text">{{ text }}</span>
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";

const props = withDefaults(
  defineProps<{
    size?: number;
    text?: number;
  }>(),
  {
    size: 45,
    text: "正在加载中...",
  },
);

const inlineStyles = computed(() => ({
  width: `${props.size}px`,
  height: `${props.size}px`,
}));
</script>

<style lang="scss" module>
.loading {
  display: inline-block;
  padding: 0;
  border-radius: 100%;
  border: 2px solid #086df4;
  border-right-color: rgba(0, 0, 0, 0.1);
  border-bottom-color: rgba(0, 0, 0, 0.1);
  animation: loading-animation 1s ease-in-out infinite;
}

.edit_loading {
  display: flex;
  align-items: center;
  font-size: 18px;
}

.text {
  margin-left: 10px;
}

@keyframes loading-animation {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}
</style>
