<template>
  <iframe v-if="authorization" :class="$style._" :src="src" allow="clipboard-read; clipboard-write" />
</template>
<script lang="ts" setup>
import { computed, onMounted, onBeforeUnmount } from "vue";
import useAuthorization from "@/store/hooks/useAuthorization";
import router from "@/router";

const authorization = useAuthorization();
const src = computed(() => `/baops/index/wenshu?authToken=${encodeURIComponent(authorization.value!)}`);
let messageEventListener: any = null;
onMounted(() => {
  messageEventListener = async (e: any) => {
    const { data, type } = typeof e.data === "string" ? JSON.parse(e.data) : e.data;
    if (type === "navigator") {
      await router.push(data);
    }
  };
  window.addEventListener("message", messageEventListener);
});

onBeforeUnmount(() => {
  if (messageEventListener) {
    window.removeEventListener("message", messageEventListener);
  }
});
</script>
<style lang="scss" module>
._ {
  border: 0 none;
  width: 100%;
  height: 100%;
  background: #fff;
  display: block;
}
</style>
