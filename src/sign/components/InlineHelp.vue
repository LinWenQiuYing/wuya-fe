<template>
  <el-tooltip placement="top" effect="light">
    <template #content>
      <slot />
    </template>
    <HelpIcon />
  </el-tooltip>
</template>
<script setup lang="ts">
import HelpIcon from "@/sign/components/HelpIcon.vue";
</script>
