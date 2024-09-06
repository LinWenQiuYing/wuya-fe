<!--回答骨架-->
<template>
  <div class="el-skeleton-wrapper">
    <TitleBar :title="title" :icon="CircleRecycleIcon" animated />
    <el-skeleton :rows="4" animated />
  </div>
</template>
<script setup lang="ts">
import CircleRecycleIcon from "@/client/icons/circle-recycle.svg";
import TitleBar from "@/client/views/intelligentQA/components/TitleBar.vue";

const props = defineProps<{
  readonly title?: string;
}>();
const title = props.title ?? "搜索中";
</script>
<style lang="scss" scoped>
.el-skeleton-wrapper {
  padding-top: 16px;
}

.header {
  display: flex;
  align-items: center;
  height: 40px;

  .circle {
    width: 22px;
    height: 22px;
    margin-right: 10px;
  }

  .title {
    width: 100px;
    height: 24px;
  }
}

.content {
  height: 100px;
}
</style>
