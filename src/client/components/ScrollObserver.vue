<template>
  <div ref="scrollRel" :class="$style.main">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import useScrollBottom from "@/client/hooks/useScrollBottom";

const scrollRel = ref<HTMLDivElement>();
useScrollBottom(scrollRel);
</script>

<style module lang="scss">
.main {
  flex: 1;
  width: 100%;
  height: 100%;
  overflow: auto;
  scroll-behavior: smooth;
}
</style>
