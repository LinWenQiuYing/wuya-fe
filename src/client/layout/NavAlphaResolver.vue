<template>
  <slot v-if="visible" :mark="props.alpha ? $style._ : null" />
</template>
<script lang="ts" setup>
import getAlphaVisible from "@/utils/getAlphaVisible";

const props = defineProps<{
  readonly alpha?: boolean;
}>();

// 如果是alpha阶段(alpha: true), 根据环境过滤可见性
// 如果不是alpha阶段(alpha: false), 永远可见
const visible = props.alpha ? getAlphaVisible() : true;
</script>
<style lang="scss" module>
@use "src/styles/theme";

._ {
  position: relative;

  &::before {
    content: "Alpha";
    font-size: 8px;
    line-height: 12px;
    height: 12px;
    position: absolute;
    top: 0;
    left: calc(30% + 10px);
    background: linear-gradient(
        311deg,
        rgba(249, 232, 233, 0) 0%,
        rgba(250, 239, 240, 0.5) 39%,
        rgba(255, 255, 255, 0.36) 100%
      ),
      linear-gradient(
        240deg,
        rgba(249, 248, 255, 0.9) 0%,
        rgba(247, 235, 247, 0.9) 39%,
        rgba(228, 231, 245, 0.9) 61%,
        rgba(255, 255, 255, 0.9) 100%
      );
    color: theme.$text-color-primary;
    border-radius: 12px;
    padding: 1px 4px;
    font-style: italic;
  }
}
</style>
