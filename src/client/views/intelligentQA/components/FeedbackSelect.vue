<template>
  <div :class="$style.select">
    <span
      v-for="(item, index) in selectOption"
      :key="index"
      :class="[$style.selectOption, feedbackType === item.value && $style.active]"
      @click="onClick(item.value)"
    >
      {{ item.label }}
    </span>
  </div>
</template>
<script setup lang="ts">
import { FeedBackType } from "@/client/types";

const feedbackType = defineModel<FeedBackType>();

const selectOption = [
  { label: "格式错误", value: "格式错误" },
  { label: "逻辑错误", value: "逻辑错误" },
  { label: "有害信息", value: "有害信息" },
  { label: "事实错误", value: "事实错误" },
  { label: "没有帮助", value: "没有帮助" },
  { label: "答非所问", value: "答非所问" },
  { label: "其他", value: "其他" },
];
const onClick = (value: FeedBackType) => {
  feedbackType.value = value;
};
</script>

<style module lang="scss">
@use "src/styles/theme";

.select {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: 10px; /* 列与列之间的间隔 */
}

.selectOption {
  width: 80px;
  height: 28px;
  line-height: 28px;
  text-align: center;
  border-radius: 2px;
  border: 1px solid #dddfe3;
  font-size: theme.$font-size-base;
  color: theme.$text-color-primary;
  cursor: pointer;

  &:hover {
    box-shadow: 0 0 8px rgba(#101015, 0.1);
  }
}

.active {
  border: 1px solid #086df4;
}
</style>
