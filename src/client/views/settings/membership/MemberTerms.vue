<template>
  <Markdown :source="terms" />
</template>
<script lang="ts" setup>
import Markdown from "@/components/Markdown.vue";
import terms from "./member-terms.md?raw";
</script>
