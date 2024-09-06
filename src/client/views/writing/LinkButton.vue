<template>
  <button type="button" :disabled="disabled" :class="[$style._, { active: props.active }]" @click="onClick">
    <el-icon v-if="loading" class="is-loading"><Loading /></el-icon>
    <Component :is="icon" v-if="icon && !loading" :class="$style.icon" />
    <slot />
  </button>
</template>
<script lang="ts" setup>
import type { Component } from "vue";
import { computed } from "vue";
import { Loading } from "@element-plus/icons-vue";

const props = defineProps<{
  readonly icon?: Component;
  active?: boolean;
  disabled?: boolean;
  /**
   * click事件的回调函数
   *
   * 相比于使用 click 事件, 使用 props.onClick 回调会更方便组件处理loading状态一些,
   * 可以将loading由外部的状态转变成对外部透明的内部状态.
   *
   * 当使用 click 事件时, 无法得知loading的状态变更是在什么时候;
   * 但若使用 props.onClick 回调, 则在函数前后切换loading状态即可.
   *
   * 注:  侦听click事件时vue会隐式地创建props.onClick, 所以消费当前组件时继续侦听click事件即可
   */
  onClick?: () => unknown;
}>();

defineEmits<{
  click: [];
}>();

const loading = defineModel<boolean>("loading");

// loading的时候disable按钮
const disabled = computed(() => props.disabled || loading.value);

const { icon } = props;
const onClick = async () => {
  if (typeof props.onClick !== "function") return;
  loading.value = true;
  try {
    await props.onClick();
  } finally {
    loading.value = false;
  }
};
</script>
<style lang="scss" module>
@use "src/styles/theme";

._ {
  height: 24px;
  border: unset;
  padding: 0;
  background: unset;
  box-shadow: unset;
  outline: unset;
  font-size: 14px;
  word-break: keep-all;
  color: theme.$text-color-primary;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: color 0.3s ease-in-out;
  user-select: none;

  &:global(.active),
  &:not(:global(:disabled)):hover {
    color: theme.$color-primary;
  }

  &:global(:disabled) {
    color: #ccc;
    cursor: not-allowed;
  }

  > svg {
    fill: currentColor;
  }

  > :only-child {
    margin: auto;
  }
}

.icon {
  height: 16px;

  &:not(:last-child) {
    margin-right: 2px;
  }
}
</style>
