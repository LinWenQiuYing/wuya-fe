<template>
  <img :class="[$style._, loadState]" :src="src" alt="" @error="hideImage" @load="displayImage" />
</template>
<script lang="ts" setup>
import { ref, computed } from "vue";

const props = defineProps<{
  src: string;
}>();

type ImageLoadState = "loading" | "loaded" | "failed";

const loadState = ref<ImageLoadState>("loading");

const src = computed(() => {
  const origin = new URL(props.src).origin;
  return origin + "/favicon.ico";
});

const hideImage = () => {
  loadState.value = "failed";
};

const displayImage = () => {
  loadState.value = "loaded";
};
</script>
<style lang="scss" module>
._ {
  width: 12px;
  height: 12px;
  display: block;

  &:global {
    &.loading {
      opacity: 0;
    }

    &.loaded {
      margin-right: 3px;
    }

    &.failed {
      display: none;
    }
  }
}
</style>
