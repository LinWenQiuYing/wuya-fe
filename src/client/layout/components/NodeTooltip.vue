<template>
  <el-tooltip effect="light" :disabled="!tooltipContent" :content="tooltipContent" :hide-after="0">
    <slot />
  </el-tooltip>
</template>
<script setup lang="ts">
import { TreeNode } from "@/client/hooks/useTree";
import { computed } from "vue";
import { KnowledgeSourceType } from "@/client/types";

const props = defineProps<{ node: TreeNode; isReadonly?: boolean }>();
const tooltipContent = computed<string>(() => {
  if (props.isReadonly) {
    return "编辑模式下不支持切换知识源";
  }
  // 财经数据源不支持非中文的默认语言
  if (props.node.disabled && props.node.data.type === KnowledgeSourceType.FINANCE) {
    return "默认回答语言非中文时无法选择财经知识源";
  }
  return "";
});
</script>
