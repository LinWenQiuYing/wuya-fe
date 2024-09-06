<template>
  <label :class="$style._"><CrownIcon />VIP</label>
</template>
<script lang="ts" setup>
import CrownIcon from "@/client/icons/crown.svg";
</script>
<style lang="scss" module>
@use "src/styles/theme";

._ {
  width: 54px;
  height: 20px;
  line-height: 20px;
  background: linear-gradient(303deg, #ffe292 0%, #dba963 100%);
  border-radius: 10px;
  display: flex;
  gap: 3px;
  align-items: center;
  justify-content: center;
  user-select: none;
  pointer-events: none;
  font-family: Helvetica, theme.$font-family-base;
  font-weight: normal;
  font-size: 14px;
  color: #ffffff;
  text-shadow: 1px 1px 2px #dcad6a;
  font-style: oblique;

  > svg {
    width: 11px;
    fill: currentColor;
  }
}
</style>
