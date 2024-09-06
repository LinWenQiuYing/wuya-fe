<template>
  <Suspense>
    <auth-guard force-admin>
      <admin-layout />
    </auth-guard>
  </Suspense>
</template>
<script lang="ts" setup>
import AdminLayout from "./layout/index.vue";
import AuthGuard from "@/sign/components/AuthGuard.vue";
</script>
