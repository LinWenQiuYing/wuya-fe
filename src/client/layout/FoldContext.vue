<template>
  <div :class="$style._">
    <slot :folded="folded" />
    <button :class="[$style.btn, { folded }]" type="button" @click="toggleFoldState">
      <ExpandLeftIcon />
    </button>
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
import ExpandLeftIcon from "@/client/icons/expand-left.svg";

const folded = ref<boolean>(false);

const toggleFoldState = () => {
  folded.value = !folded.value;
};
</script>
<style lang="scss" module>
@use "src/styles/theme";

._ {
  position: relative;
  z-index: 1;
}

.btn {
  position: absolute;
  bottom: 20%;
  right: 0;
  cursor: pointer;
  display: flex;
  width: 30px;
  height: 30px;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transform: translateX(50%);
  background-color: theme.$bg-layout-menu;
  color: theme.$text-color-secondary;
  border: 0 none;
  box-shadow: none;
  padding: 0;

  &:hover {
    color: theme.$color-primary;
  }

  > svg {
    fill: currentColor;
    width: 20px;
    transition:
      color 0.3s ease-in-out,
      transform 0.3s ease-in-out;
  }

  &:global(.folded) svg {
    transform: rotateY(180deg);
  }
}
</style>
