<template>
  <SignTooltip v-if="anonymous">
    <slot :disabled="true" />
  </SignTooltip>
  <slot v-else :disabled="false" />
</template>
<script setup lang="ts">
import { computed } from "vue";
import { isAnonymous } from "@/store/hooks/useUserInfo";
import SignTooltip from "./SignTooltip.vue";

const props = defineProps<{
  auth?: boolean;
}>();
const anonymous = computed(() => props.auth && isAnonymous.value);
</script>
