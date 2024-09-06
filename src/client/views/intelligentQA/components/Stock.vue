<template>
  <div :class="$style.stock">
    <el-tabs v-model="activeTab" class="demo-tabs" @tab-click="handleClick" v-show="options.length > 1">
      <el-tab-pane :label="item.label" :name="item.name" v-for="(item, index) in options" :key="index" lazy>
      </el-tab-pane>
    </el-tabs>
    <KLineChart v-show="activeTab" :class="$style.line" ref="lineRef" />
  </div>
</template>
<script setup lang="ts">
import { computed, ref, watch } from "vue";
import type { TabsPaneContext } from "element-plus";
import KLineChart from "@/client/components/KLineChart.vue";
import { getCompanies } from "@/client/views/intelligentQA/utils";

const props = defineProps<{
  data: Record<string, { code: string; name: string }>;
}>();
const stocks = computed(() => getCompanies(props.data));
const options = ref([]);
const activeTab = ref();
const lineRef = ref(null);

const handleClick = (tab: TabsPaneContext, event: Event) => {
  activeTab.value = tab.props.name;
  lineRef.value.updateData(tab.props.label, tab.props.name);
};
watch(
  [() => stocks.value, () => lineRef.value],
  ([value, lineRef]) => {
    if (value && lineRef) {
      const tabs = Object.entries(value).map(([stockCode, name]) => {
        return {
          label: name,
          name: stockCode,
        };
      });
      if (tabs.length > 0) {
        options.value = tabs;
        const first = tabs[0];
        activeTab.value = first.name;
        lineRef.updateData && lineRef.updateData(first.label, first.name);
      }
    }
  },
  {
    immediate: true,
  },
);
</script>

<style lang="scss" module>
@use "src/styles/theme";

.stock {
  :global {
    .el-tabs__header {
      margin: 0 0 10px;
    }
    .el-tabs__active-bar {
      height: 0;
    }
    .el-tabs__nav-next,
    .el-tabs__nav-prev {
      line-height: 26px;
    }
    .el-tabs--top .el-tabs__item.is-top:last-child {
      padding-right: theme.$padding-sm;
    }

    .el-tabs--top .el-tabs__item.is-top:nth-child(2) {
      padding-left: theme.$padding-sm;
    }

    .el-tabs__nav-wrap::after,
    .el-tabs__nav-scroll::after {
      height: 0;
    }

    .el-tabs__item {
      display: flex;
      align-items: center;
      height: 24px;
      line-height: 24px;
      text-align: center;
      padding: 0 theme.$padding-sm;
      border-radius: 20px;
      color: theme.$text-color-secondary;
    }

    .is-active {
      background-color: theme.$color-primary;
      color: theme.$color-white !important;
    }
  }
}

.line {
  width: 100%;
  border: 2px solid rgb(224 228 241 / 100%);
  padding: theme.$padding-sm;
  background-color: theme.$color-white;
  border-radius: theme.$border-radius-lg;
}
</style>
