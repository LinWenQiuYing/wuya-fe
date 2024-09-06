<template>
  <span :class="[props.class, $style._, props.size ?? 'md']">离线</span>
</template>
<script lang="ts" setup>
const props = defineProps<{
  class?: string;
  size?: "md" | "sm";
}>();
</script>
<style lang="scss" module>
@use "src/styles/theme";
._ {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff1f0;
  border-radius: 4px;
  border: 1px solid #ffccc7;
  font-weight: 400;
  color: #ff4d4f;
  line-height: 20px;

  &::before {
    content: " ";
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #ff4d4f;
  }

  &:global(.md) {
    width: 52px;
    height: 22px;
    font-size: 12px;

    &::before {
      margin-right: 6px;
    }
  }

  &:global(.sm) {
    width: 40px;
    height: 16px;
    font-size: 10px;

    &:before {
      margin-right: 3px;
    }
  }
}
</style>
