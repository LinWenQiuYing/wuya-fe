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
  cursor: pointer;

  &::before {
    position: absolute;
    left: 0;
    content: "";
    border-left: 1px solid #ced0d6;
    height: 12px;
  }

  &:hover {
    color: theme.$color-primary;

    svg {
      fill: theme.$color-primary;
    }
  }

  svg {
    fill: theme.$text-color-primary;
    height: 18px;
  }
}
</style>
