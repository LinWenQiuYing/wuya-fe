<template>
  <a :class="props.class" @click.prevent="showContent">《用户协议》</a>
  <Teleport to="body">
    <TermsDialog v-if="dialogVisible" v-model="dialogVisible" />
  </Teleport>
</template>
<script setup lang="ts">
import { ref } from "vue";
import TermsDialog from "./TermsDialog.vue";
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
      path: "/terms",
      query: { ...route.query },
    });
  } else {
    dialogVisible.value = true;
  }
};
</script>
