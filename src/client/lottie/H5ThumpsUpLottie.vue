<template>
  <lottie :class="$style._" :data="data" />
</template>
<script setup lang="ts">
import Lottie from "./Lottie.vue";
import data from "./h5-thumps-up.json";
</script>
<style module lang="scss">
._ {
  width: 18px;
  height: auto;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
