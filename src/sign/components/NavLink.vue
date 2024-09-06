<template>
  <router-link :to="props.to" active-class="" exact-active-class="" class="infinity-link_default"
    ><slot
  /></router-link>
</template>
<script lang="ts" setup>
import type { RouteLocationRaw } from "vue-router";

const props = defineProps<{
  readonly to: RouteLocationRaw;
}>();
</script>
