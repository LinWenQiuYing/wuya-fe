<template>
  <NavLink :to="{ path: props.path, query: $route.query }"><slot /></NavLink>
</template>
<script lang="ts" setup>
import NavLink from "./NavLink.vue";
const props = defineProps<{
  readonly path: string;
}>();
</script>
