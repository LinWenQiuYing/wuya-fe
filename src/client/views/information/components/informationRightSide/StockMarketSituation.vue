<template>
  <div class="stock-market-situation">
    <div class="stock-market-situation-title">
      <span>股市行情</span>
      <el-dropdown popper-class="stock-situation-dropdown">
        <span class="el-dropdown-link">
          {{ dropDownActiveLabel }}
          <ArrowDown />
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item
              v-for="item in menu"
              :key="item.label"
              @click="handleClickItem(item.value)"
              :class="[dropDownActive === item.value ? 'active' : '']"
              >{{ item.label }}</el-dropdown-item
            >
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
    <div class="stock-market-situation-content">
      <div ref="chartRef" class="kline-content" v-loading="loading"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getStockTrend } from "@/client/api/news";
import { ArrowDown } from "@element-plus/icons-vue";
import * as echarts from "echarts";
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";

const menu = [
  {
    label: "沪深300",
    value: "000300",
  },
  {
    label: "上证指数",
    value: "000001",
  },
  {
    label: "深证成指",
    value: "399001",
  },
  // {
  //   label: "恒生指数",
  //   value: "HSI",
  // },
];
const dropDownActive = ref("000300");
const dropDownActiveLabel = computed(() => {
  return menu.find((v) => v.value === dropDownActive.value)?.label || "";
});

const handleClickItem = (value: string) => {
  if (value === dropDownActive.value) return;
  dropDownActive.value = value;
  updateChart();
  getData();
};

const chartRef = ref(null);
let chartInstance: any = null;
const loading = ref(false);
const freq = ref("min");

const upColor = "#ec0000";
const upBorderColor = "#8A0000";
const downColor = "#00da3c";
const downBorderColor = "#008F28";

const data = ref<any>({});
let option = {
  dataset: {
    source: data.value,
  },
  title: {
    text: dropDownActiveLabel.value,
    top: 0,
    left: 0,
    textStyle: {
      color: "#2D364D",
      fontWeight: "bold",
      fontSize: 12,
    },
    subtext: "3,584.27 +53.99 (+1.53%)",
    subtextStyle: {
      fontSize: 16,
      color: "#F70D2D",
    },
  },
  tooltip: {
    trigger: "axis",
    axisPointer: {
      type: "line",
    },
  },
  grid: [
    {
      top: "55",
      left: "45",
      bottom: 70,
    },
    {
      top: "135",
      left: "45",
      bottom: "20",
    },
  ],
  xAxis: [
    {
      type: "category",
      boundaryGap: false,
      axisLine: { onZero: false },
      splitLine: { show: false },
      min: "dataMin",
      max: "dataMax",
    },
    {
      type: "category",
      gridIndex: 1,
      boundaryGap: false,
      axisLine: { onZero: false },
      axisTick: { show: false },
      splitLine: { show: false },
      axisLabel: { show: false },
      min: "dataMin",
      max: "dataMax",
    },
  ],
  yAxis: [
    {
      scale: true,
      splitArea: {
        show: true,
      },
    },
    {
      scale: true,
      gridIndex: 1,
      splitNumber: 2,
      axisLabel: { show: false },
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { show: false },
    },
  ],
  dataZoom: [
    {
      type: "inside",
      xAxisIndex: [0, 1],
      start: 0,
      end: 100,
    },
    {
      show: true,
      xAxisIndex: [0, 1],
      type: "slider",
      height: 10,
      bottom: 0,
      start: 0,
      end: 100,
    },
  ],
  visualMap: {
    show: false,
    seriesIndex: 1,
    dimension: 6,
    pieces: [
      {
        value: 1,
        color: upColor,
      },
      {
        value: -1,
        color: downColor,
      },
    ],
  },
  series: [
    {
      type: "candlestick",
      itemStyle: {
        color: upColor,
        color0: downColor,
        borderColor: upBorderColor,
        borderColor0: downBorderColor,
      },
      encode: {
        x: 0,
        y: [1, 4, 3, 2],
      },
    },
    {
      name: "Volumn",
      type: "bar",
      xAxisIndex: 1,
      yAxisIndex: 1,
      itemStyle: {
        color: "#7fbe9e",
      },
      large: true,
      encode: {
        x: 0,
        y: 5,
      },
    },
  ],
};
const initOptions = () => {
  option.dataset.source = data.value;
  option.title.text = dropDownActiveLabel.value;
  const desc =
    freq.value === "D" &&
    data.value.length > 1 &&
    data.value[data.value.length - 1][4] &&
    data.value[data.value.length - 2][4]
      ? data.value[data.value.length - 1][4] - data.value[data.value.length - 2][4]
      : "";
  option.title.subtext = data.value[data.value.length - 1][4] + " " + desc;
};

const updateChart = () => {
  initOptions();
  chartInstance.setOption(option);
  nextTick(() => {
    chartInstance.resize();
  });
};

const getSign = (data, dataIndex, openVal, closeVal, closeDimIdx) => {
  let sign;
  if (openVal > closeVal) {
    sign = -1;
  } else if (openVal < closeVal) {
    sign = 1;
  } else {
    sign =
      dataIndex > 0
        ? // If close === open, compare with close of last record
          data[dataIndex - 1][closeDimIdx] <= closeVal
          ? 1
          : -1
        : // No record of previous, set to be positive
          1;
  }
  return sign;
};

const splitData = (rawData: any[]) => {
  const result = [];
  for (var i = 0; i < rawData.length; i++) {
    result.push([
      rawData[i].datetime,
      rawData[i].open.toFixed(2),
      rawData[i].high.toFixed(2),
      rawData[i].low.toFixed(2),
      rawData[i].close.toFixed(2),
      rawData[i].volume.toFixed(0),
      getSign(rawData, i, +rawData[i].open, +rawData[i].close, 4),
    ]);
  }
  return result;
};

watch(
  data,
  () => {
    updateChart();
  },
  { deep: true },
);

const initChart = () => {
  chartInstance = echarts.init(chartRef.value as unknown as HTMLElement);
};

const getData = async () => {
  loading.value = true;
  const json = {
    code: dropDownActive.value,
    freq: freq.value,
    points: 30,
  };
  const res = await getStockTrend(json);
  data.value = splitData(res);
  loading.value = false;
};

onMounted(() => {
  initChart();
  window.addEventListener("resize", () => {
    if (chartInstance) chartInstance.resize();
  });

  getData();
});

onBeforeUnmount(() => {
  chartInstance = null;
  window.removeEventListener("resize", () => {
    if (chartInstance) chartInstance.resize();
  });
});
</script>

<style lang="scss" scoped>
.stock-market-situation {
  padding-left: 24px;

  &-title {
    height: 56px;
    line-height: 56px;
    display: flex;
    align-items: center;
    justify-content: space-between;

    span {
      color: #2d364d;
      font-size: 18px;

      svg {
        margin-left: 8px;
        width: 20px;
        height: 20px;
      }
    }

    :deep(.el-dropdown) {
      cursor: pointer;

      &:focus-visible {
        outline: none;
      }

      .el-dropdown-link {
        display: flex;
        align-items: center;
        width: 113px;
        background: #f0f3fa;
        height: 32px;
        justify-content: center;
        border-radius: 15px;
        font-size: 14px;

        &:focus-visible {
          outline: none;
        }
      }
    }
  }

  &-content {
    height: 220px;
    padding: 14px 12px;
    border: 2px solid #e5eaf5;
    border-radius: 8px;

    .kline-content {
      width: 100%;
      height: 100%;
    }

    .bar-content {
      width: 100%;
      height: 60px;
    }
  }
}
</style>
<style>
.stock-situation-dropdown {
  .el-dropdown-menu__item {
    &.active {
      background-color: #ecf5ff;
      color: #086df4;
    }
  }
}
</style>
