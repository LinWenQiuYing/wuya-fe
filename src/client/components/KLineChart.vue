<!-- 日k线 -->
<template>
  <div class="KLineChart">
    <div class="header">
      <div class="titleInfo">
        <span class="cnName">{{ state.stockName }}</span>
        <span class="enName">（{{ state.stockCode }}）</span>
      </div>
      <div class="timeChoice">
        <el-select class="date" size="small" v-model="state.dateValue" @change="toggleTime">
          <el-option
            v-for="item in timeChoiceOptions"
            :key="item.value"
            :label="item.name"
            :value="item.value"
          />
        </el-select>
      </div>
    </div>
    <div class="numbers" :class="computedFn(state.fluctuations) ? 'red' : 'green'">
      <span class="price">{{ state.stockPrice }}</span>
      <span class="trend">
        {{ computedFn(state.fluctuations) ? "+" : "" }}{{ String(state.fluctuations).substring(0, 5) }}%
      </span>
    </div>
    <div class="chartBox">
      <Echarts
        v-if="state.status"
        :chart-data="state.KLineChartData"
        :chart-type="'KLINE'"
        :expand-option="state.KLineOptions"
        @click="(e) => e.stopPropagation()"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import Echarts from "./Echarts.vue";
import { getStockChat } from "@/client/api/chat";

const timeChoiceOptions = ref([
  { value: 0, name: "5天" },
  { value: 1, name: "1月" },
  { value: 2, name: "1年" },
  { value: 3, name: "3年" },
]);
const state = reactive({
  status: false,
  KLineChartData: [],
  KLineOptions: {},
  stockName: "",
  stockCode: "",
  stockPrice: "",
  fluctuations: 0,
  dateValue: 1,
});

const updateData = (stockName: string, stockCode: string) => {
  state.status = true;
  getStockTrendFn(stockName, stockCode);
};
const getStockTrendFn = async (stockName: string, stockCode: string) => {
  state.KLineChartData = [];
  const data = await getStockChat({
    stockCode,
    dateCode: state.dateValue,
  });
  data.stockTrendList = data.stockTrendList?.sort(compareFn("tradeDate", true));
  data.stockTrendList?.map((item) => {
    state.KLineChartData.push([
      item.tradeDate,
      item.open,
      item.high,
      item.low,
      item.close,
      item.volume,
      item.upAndDown,
    ]);
  });
  state.stockName = stockName;
  state.stockCode = stockCode;
  state.stockPrice = data.price;
  state.fluctuations = data.fluctuations * 100;
};
const compareFn = (property: string, bol: boolean) => {
  return function (a, b) {
    const value1 = a[property];
    const value2 = b[property];
    if (bol) {
      // 升序
      return Date.parse(value1) - Date.parse(value2);
    } else {
      // 降序
      return Date.parse(value2) - Date.parse(value1);
    }
  };
};
const computedFn = (num: number) => {
  if (num > 0) {
    return true;
  } else {
    return false;
  }
};
const toggleTime = (value: number) => {
  state.dateValue = value;
  getStockTrendFn(state.stockName, state.stockCode);
};
onMounted(() => {});
defineExpose({
  updateData,
});
</script>

<style lang="scss" scoped>
@import "../../styles/theme";

.KLineChart {
  width: 100%;
  height: 100%;

  .header {
    display: flex;
    height: 24px;
    justify-content: space-between;
    color: $base_color;

    .titleInfo {
      flex: 1;
      display: flex;
      align-items: center;
      font-weight: bold;
      font-size: $font-size-sm;
      color: #2d364d;
    }

    .timeChoice {
      flex: 0 0 72px;
      width: 72px;
      display: flex;
      font-size: $font-size-sm;
      --el-border-radius-base: 15px;
      --el-fill-color-blank: #f0f3fa;
      --el-border-color: transparent;
    }
  }

  .numbers {
    font-weight: bold;
    font-size: $font-size-xl;
    padding-bottom: $padding-xs;

    .price {
      padding-right: 5px;
    }

    .trend {
      font-size: $font-size-sm;
    }
  }

  .numbers.red {
    color: $red_color;
  }

  .numbers.green {
    color: $green_color;
  }

  .chartBox {
    width: 100%;
    height: 230px;
  }
}

:deep(.el-select__wrapper) {
  min-height: 24px;
}

:deep(.el-select__wrapper.is-focused) {
  box-shadow: 0 0 0 1px transparent inset;
}

:deep(.el-select__wrapper.is-hovering) {
  box-shadow: 0 0 0 1px transparent inset;
}

:deep(.el-select__placeholder) {
  text-align: center;
}
</style>
