<template>
  <button type="button" :class="[$style._, { active: props.active }]" @click="emitClick">
    <Component :is="props.icon" :class="$style.icon" /><slot />
  </button>
</template>
<script lang="ts" setup>
import type { Component } from "vue";

const props = defineProps<{
  readonly icon: Component;
  active?: boolean;
}>();

const emit = defineEmits<{
  click: [];
}>();

const emitClick = () => emit("click");
</script>
<style lang="scss" module>
@use "src/styles/theme";

._ {
  width: 130px;
  height: 40px;
  background: #fff;
  border-radius: 4px;
  border: 1px solid #d6dae6;
  padding: 0 10px;
  box-sizing: border-box;
  color: theme.$text-color-primary;
  background: unset;
  box-shadow: unset;
  outline: unset;
  font-size: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  user-select: none;
  transition: border-color 0.3s ease-in-out;
  gap: 8px;

  &:global(.active),
  &:hover {
    border-color: theme.$color-primary;
  }

  > svg {
    display: block;
    height: 20px;
  }
}
</style>
