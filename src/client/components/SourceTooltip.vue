<template>
  <el-tooltip v-if="tooltipContent" :content="tooltipContent" effect="light">
    <slot :disabled="true" />
  </el-tooltip>
  <slot v-else :disabled="false" />
</template>
<script setup lang="ts">
import { Source } from "@/client/const";
import { computed } from "vue";
import useSourceUnavailable from "@/client/hooks/useSourceUnavailable";

const props = defineProps<{ data: Source }>();
const sourceDisableFun = useSourceUnavailable();
const tooltipContent = computed(() => {
  if (sourceDisableFun(props.data.type)) {
    return "默认回答语言非中文时无法选择财经知识源";
  }
  return "";
});
</script>
<style module lang="scss"></style>
