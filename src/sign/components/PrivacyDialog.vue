<template>
  <ArticleDialog v-model="visible">
    <InfinityPrivacy />
  </ArticleDialog>
</template>
<script setup lang="ts">
import ArticleDialog from "./ArticleDialog.vue";
import InfinityPrivacy from "./InfinityPrivacy.vue";
const visible = defineModel<boolean>();
</script>
