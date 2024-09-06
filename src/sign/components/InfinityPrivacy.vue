<template>
  <Markdown :source="privacy" />
</template>
<script lang="ts" setup>
import privacy from "./privacy.md?raw";
import Markdown from "@/components/Markdown.vue";
</script>
