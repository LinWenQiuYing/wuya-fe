<template>
  <TermsPage title="隐私政策" :source="privacy" />
</template>

<script lang="ts" setup>
import privacy from "../components/privacy.md?raw";
import TermsPage from "../components/TermsPage.vue";
</script>
