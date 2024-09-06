<template>
  <button type="button" :disabled="disabled" :class="[$style._, { primary, plain }]" @click="onClick">
    <el-icon v-if="loading" class="is-loading"><Loading /></el-icon>
    <Component :is="icon" v-else-if="icon && !loading" />
    <slot />
  </button>
</template>
<script lang="ts" setup>
import type { Component } from "vue";
import { computed } from "vue";
import { Loading } from "@element-plus/icons-vue";

// readonly的prop, 都会假设在创建后是不会变化, 所以也不会对它们做响应式处理
const props = defineProps<{
  readonly icon?: Component;
  readonly primary?: boolean;
  disabled?: boolean;
  plain?: boolean;
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

const { icon, primary } = props;

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
  height: 28px;
  border-radius: 2px;
  padding: 0 10px;
  border: unset;
  box-shadow: unset;
  outline: unset;
  font-size: 14px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  user-select: none;
  transition:
    color 0.3s ease-in-out,
    background-color 0.3s ease-in-out;

  &:global {
    &.radius {
      border-radius: 20px;
    }

    &.plain {
      color: theme.$text-color-primary;
      background-color: #edeff3;

      &:not(:disabled):hover {
        color: theme.$color-primary;
      }
    }

    &.primary {
      color: #fff;
      background-color: theme.$color-primary;

      &:not(:disabled):hover {
        color: #edeff3;
      }
    }
  }

  &:global(:disabled) {
    background-color: #ccc;
    color: #fff;
    cursor: not-allowed;
  }

  > svg {
    fill: currentColor;
    display: block;
    height: 16px;
  }

  > svg:not(:last-child) {
    margin-right: 2px;
  }

  > :only-child {
    margin: auto;
  }
}
</style>
