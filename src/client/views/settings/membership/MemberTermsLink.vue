<template>
  <span class="infinity-link_default" @click.prevent="previewTerms">《无涯会员服务协议》</span>
</template>
<script setup lang="ts">
const termsVisible = defineModel<boolean>({ required: true });
const previewTerms = () => (termsVisible.value = true);
</script>
