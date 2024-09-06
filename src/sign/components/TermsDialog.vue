<template>
  <ArticleDialog v-model="visible">
    <InfinityTerms />
  </ArticleDialog>
</template>
<script setup lang="ts">
import ArticleDialog from "./ArticleDialog.vue";
import InfinityTerms from "./InfinityTerms.vue";
const visible = defineModel<boolean>();
</script>
