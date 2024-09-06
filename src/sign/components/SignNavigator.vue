<template>
  <AggressiveLink :path="preferSignEntry" :class="$style._">
    <ReturnIcon />
    <span :class="$style.title">返回登录</span>
  </AggressiveLink>
</template>
<script setup lang="ts">
import ReturnIcon from "@/sign/icons/return.svg";
import AggressiveLink from "./AggressiveLink.vue";
import getPreferSignEntry from "@/sign/getPreferSignEntry";
const preferSignEntry = await getPreferSignEntry();
</script>
<style lang="scss" module>
@use "src/styles/theme";

._ {
  font-size: 14px;
  color: #6d7587;
  line-height: 22px;
  display: flex;
  align-items: center;
  justify-content: center;

  > svg {
    height: 14px;
    margin-right: 3px;
    fill: currentColor;
  }

  &:hover {
    color: theme.$color-primary;
    text-decoration: underline;
  }
}

.title {
  flex-shrink: 0;
  flex-grow: 0;
}
</style>
