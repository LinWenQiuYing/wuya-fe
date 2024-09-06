<template>
  <el-select v-model="model" :class="props.class">
    <el-option
      v-for="model in models"
      :key="model.code"
      :label="model.name"
      :value="model.code"
      :title="model.description"
      >{{ model.name }}</el-option
    >
  </el-select>
</template>
<script lang="ts" setup>
import { ModelCode } from "@/client/api/chat";
import useModels from "@/store/hooks/useModels";

const props = defineProps<{
  class?: string;
}>();
const model = defineModel<ModelCode>();
const models = useModels();
</script>
