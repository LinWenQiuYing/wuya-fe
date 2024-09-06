<template>
  <el-select v-model="language">
    <el-option v-for="item in languageOptions" :key="item.value" :label="item.name" :value="item.value">{{
      item.name
    }}</el-option>
  </el-select>
</template>
<script lang="ts" setup>
import { languageOptions } from "@/client/const";
import { Language } from "@/client/types";

const language = defineModel<Language>({ required: true });
</script>
