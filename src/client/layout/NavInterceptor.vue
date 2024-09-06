<template>
  <NavAuthInterceptor v-slot="{ disabled }" :auth="props.interceptor?.auth">
    <slot :disabled="disabled" />
  </NavAuthInterceptor>
</template>
<script setup lang="ts">
import type { NavInterceptor } from "@/@types";
import NavAuthInterceptor from "@/client/layout/NavAuthInterceptor.vue";

const props = defineProps<{ readonly interceptor?: NavInterceptor }>();
</script>
