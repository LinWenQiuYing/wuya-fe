<template>
  <span :class="$style.operation">
    <slot />
  </span>
</template>
<script setup lang="ts"></script>

<style module lang="scss">
@use "src/styles/theme";

.operation {
  position: relative;
  height: 32px;
  width: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
  cursor: pointer;

  &::before {
    position: absolute;
    left: 0;
    content: "";
    border-left: 1px solid #ced0d6;
    height: 12px;
  }

  &:hover {
    opacity: 0.7;
  }

  svg {
    fill: currentColor;
    height: 18px;
  }
}
</style>
