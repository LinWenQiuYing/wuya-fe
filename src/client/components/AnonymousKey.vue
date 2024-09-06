<template>
  <slot :key="key" />
</template>

<script setup lang="ts">
import { isAnonymous } from "@/store/hooks/useUserInfo";
import { getAnonymousKey } from "@/client/api/chat";
import { ResponseBody } from "@/sign/api/sign";
import { ElMessage } from "element-plus";
import { ref } from "vue";

const key = ref<string>();
const setInfoAnswerKey = async () => {
  const key = await getAnonymousKey().catch((err: ResponseBody<null>) => {
    ElMessage.error(err);
  });
  return key || "";
};

if (isAnonymous.value) {
  key.value = await setInfoAnswerKey();
}
</script>
