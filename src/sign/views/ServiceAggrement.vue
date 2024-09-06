<template>
  <TermsPage title="用户协议" :source="terms" />
</template>

<script lang="ts" setup>
import terms from "../components/terms.md?raw";
import TermsPage from "../components/TermsPage.vue";
</script>
