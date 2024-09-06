<template>
  <el-select v-model="referencesLimit" :class="props.class" placeholder="请选择参考来源数量">
    <el-option v-for="option in maxReferencesOptions" :key="option" :label="option" :value="option" />
  </el-select>
</template>
<script setup lang="ts">
import { ReferencesLimit } from "@/sign/api/sign";

const props = defineProps<{
  class?: string;
}>();

const referencesLimit = defineModel<ReferencesLimit>();
const maxReferencesOptions: ReferencesLimit[] = [10, 20, 30, 50];
</script>
