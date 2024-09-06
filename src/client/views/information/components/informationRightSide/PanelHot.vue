<template>
  <div class="hot-panel">
    <div class="hot-panel-title">
      <LayoutGridFill />
      行业热度
    </div>
    <li v-if="loading">
      <el-skeleton animated style="margin-left: 20px; width: calc(100% - 20px)" />
    </li>
    <div v-else-if="!loading && hotList.length" class="hot-panel-content">
      <div v-for="(item, index) in hotList" :key="index" class="content-item">
        <span class="content-item-name">{{ item.sector }}</span>
        <span :class="['content-item-value', item.chg > 0 ? 'red' : 'green']"
          >{{ (item.chg * 100).toFixed(2) }}%</span
        >
      </div>
    </div>
    <div v-else class="hot-panel-content empty">
      <el-empty description="暂无数据" :image-size="100" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { getIndustryHot } from "@/client/api/news";
import LayoutGridFill from "@/client/icons/layout-grid-fill.svg";
import { onMounted, ref } from "vue";

const hotList = ref<any[]>([]);
const loading = ref(false);

const getData = async () => {
  const json = {
    n: 9,
    type: "industry",
  };
  loading.value = true;
  let res = null;
  try {
    res = await getIndustryHot(json);
  } catch {
    loading.value = false;
  }
  loading.value = false;
  if (!res) return;
  hotList.value = res;
};

onMounted(() => {
  getData();
});
</script>

<style lang="scss" scoped>
.hot-panel {
  padding-left: 40px;

  &-title {
    height: 56px;
    line-height: 56px;
    display: flex;
    align-items: center;
    color: #2d364d;
    font-size: 16px;
    margin-left: 3px;
    margin-bottom: 1px;

    svg {
      margin-right: 5px;
    }
  }

  &-content {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 8px;
    max-height: 208px;

    &.empty {
      justify-content: center;
    }

    .content-item {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      width: 98px;
      height: 64px;
      flex-direction: column;
      align-items: center;
      padding: 10px 0;
      border-radius: 6px;
      background: #f0f0f0;

      &-name {
        color: #3b3b3b;
        font-size: 14px;
      }

      &-value {
        font-size: 14px;
        font-weight: 600;

        &.red {
          color: #f70d2d;
        }

        &.green {
          color: #04c766;
        }
      }
    }

    :deep(.el-loading-mask) {
      background-color: transparent;
    }
  }
}
</style>
