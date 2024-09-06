<template>
  <sign-skeleton v-if="isAnonymous" />
  <slot v-else />
</template>

<script setup lang="ts">
import { isAnonymous } from "@/store/hooks/useUserInfo";
import SignSkeleton from "@/client/layout/components/SignSkeleton.vue";
</script>

<style module lang="scss">
@use "src/styles/theme";
</style>
