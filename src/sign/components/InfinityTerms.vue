<template>
  <Markdown :source="terms" />
</template>
<script lang="ts" setup>
import terms from "./terms.md?raw";
import Markdown from "@/components/Markdown.vue";
</script>
