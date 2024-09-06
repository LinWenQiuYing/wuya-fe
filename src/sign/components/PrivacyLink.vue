<template>
  <a :class="props.class" @click.prevent="showContent">《隐私政策》</a>
  <Teleport to="body">
    <PrivacyDialog v-if="dialogVisible" v-model="dialogVisible" />
  </Teleport>
</template>
<script setup lang="ts">
import { ref } from "vue";
import PrivacyDialog from "./PrivacyDialog.vue";
import { isMobile } from "@/config";
import { useRouter, useRoute } from "vue-router";

const props = defineProps<{
  readonly class?: string;
}>();

const dialogVisible = ref(false);
const router = useRouter();
const route = useRoute();

const showContent = async () => {
  if (isMobile) {
    await router.push({
      path: "/privacy",
      query: { ...route.query },
    });
  } else {
    dialogVisible.value = true;
  }
};
</script>
