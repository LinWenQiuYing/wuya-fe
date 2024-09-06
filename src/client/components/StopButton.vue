<template>
  <el-button circle :class="$style._">
    <StopIcon />
  </el-button>
</template>

<script setup lang="ts">
import StopIcon from "@/client/icons/stop.svg";
</script>

<style lang="scss" module>
@use "src/styles/theme";

._ {
  svg {
    width: 36px;
    color: theme.$text-color-primary;
  }

  &:hover svg {
    color: theme.$color-primary;
  }
}
</style>
