<template>
  <img :src="props.src" :class="[$style._, loaded && $style.loaded]" @load="() => (loaded = true)" />
</template>

<script setup lang="ts">
import { ref } from "vue";
const props = defineProps<{
  readonly src: string;
}>();
const loaded = ref<boolean>(false);
</script>

<style module lang="scss">
._ {
  opacity: 0;
  transition: opacity 1.5s;
}
.loaded {
  opacity: 1;
}
</style>
