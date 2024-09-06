<!--回答骨架-->
<template>
  <div>
    <TitleBar title="总结中" :icon="CircleRecycleIcon" animated />
    <el-skeleton class="el-skeleton" animated>
      <template #template>
        <el-skeleton-item style="width: 100%" variant="p" />
        <el-skeleton-item style="width: 70%" variant="p" />
        <el-skeleton-item style="width: 35%" variant="p" />
      </template>
    </el-skeleton>
  </div>
</template>
<script setup lang="ts">
import TitleBar from "./TitleBar.vue";
import CircleRecycleIcon from "@/client/icons/circle-recycle.svg";
</script>
<style lang="scss" scoped></style>
