<template>
  <Suspense>
    <AuthGuard :injectable="true">
      <ReplaceIcoOrTitle>
        <SVGDefsHack />
        <LayoutDispatcher />
      </ReplaceIcoOrTitle>
    </AuthGuard>
  </Suspense>
</template>
<script lang="ts" setup>
import LayoutDispatcher from "@/client/layout/LayoutDispatcher.vue";
import AuthGuard from "@/sign/components/AuthGuard.vue";
import SVGDefsHack from "@/client/components/SVGDefsHack.vue";
import ReplaceIcoOrTitle from "@/components/ReplaceIcoOrTitle.vue";
</script>
