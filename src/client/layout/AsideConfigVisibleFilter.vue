<template>
  <slot v-if="!hidden" />
</template>
<script lang="ts" setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
import { isMobile } from "@/config";
import getPlatformConfig from "@/utils/getPlatformConfig";
import { defaultMenuStyle } from "@/router";

const route = useRoute();
const hidden = computed<boolean>(() => {
  const menuStyle = getPlatformConfig(route.meta.menuStyle, isMobile ? "h5" : "pc") ?? defaultMenuStyle;
  return menuStyle === "none";
});
</script>
