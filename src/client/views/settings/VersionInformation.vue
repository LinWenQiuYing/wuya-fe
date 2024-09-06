<template>
  <span :class="$style.shy">你目前的版本为{{ curVersion }}</span>
</template>
<script setup lang="ts">
import useCurVersion from "@/client/views/settings/useCurVersion";

const curVersion = useCurVersion();
</script>
<style module lang="scss">
.shy {
  color: #bbbbbb;
  font-weight: 400;
  margin: 0 4px;
}
</style>
