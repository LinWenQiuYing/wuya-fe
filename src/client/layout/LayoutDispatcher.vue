<template>
  <H5Layout v-if="isMobile" />
  <PCLayout v-else />
</template>
<script lang="ts" setup>
import { isMobile } from "@/config";
import H5Layout from "./H5Layout.vue";
import PCLayout from "./index.vue";
</script>
