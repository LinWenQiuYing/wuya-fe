<!--相关搜索骨架-->
<template>
  <div>
    <TitleBar title="搜索中" :icon="CircleRecycleIcon" animated />
    <el-skeleton class="el-skeleton" animated>
      <template #template>
        <el-skeleton-item class="el-skeleton-item" variant="p" />
        <el-skeleton-item class="el-skeleton-item" variant="p" />
        <el-skeleton-item class="el-skeleton-item" variant="p" />
        <el-skeleton-item class="el-skeleton-item" variant="p" />
      </template>
    </el-skeleton>
  </div>
</template>

<script setup lang="ts">
import TitleBar from "./TitleBar.vue";
import CircleRecycleIcon from "@/client/icons/circle-recycle.svg";
</script>

<style lang="scss" scoped>
@import "src/styles/theme";

.el-skeleton {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-auto-flow: row;
  grid-gap: $padding-sm;
  padding-top: 4px;

  .el-skeleton-item {
    flex: 1;
    height: 100px;
  }
}
</style>
