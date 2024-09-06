<!-- echarts封装 -->
<template>
  <div ref="chartComponent" :style="{ width: '100%', height: '100%' }"></div>
</template>

<script setup lang="ts">
import { reactive, onMounted, watch, ref, onBeforeUnmount, nextTick } from "vue";
import * as echarts from "echarts/core";
// 引入所需图表类型，后缀都为Chart
import {
  LineChart,
  BarChart,
  PieChart,
  ScatterChart,
  RadarChart,
  TreemapChart,
  CandlestickChart,
} from "echarts/charts";
// 引入内置显示/功能组件（例：提示框、标题、直角坐标系等），后缀都为Component
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
  LegendComponent,
  ToolboxComponent,
  VisualMapComponent,
  MarkPointComponent,
  DataZoomComponent,
} from "echarts/components";
// 标签自动布局，全局过渡动画等特性
import { LabelLayout, UniversalTransition } from "echarts/features";
// 引入 Canvas 渲染器，注意引入 CanvasRenderer 或者 SVGRenderer 是必须的一步
import { CanvasRenderer } from "echarts/renderers";
// 工具库
import * as ecStat from "echarts-stat";
import { deepCopy } from "@/client/utils/deepCopy";

echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
  LegendComponent,
  ToolboxComponent,
  VisualMapComponent,
  MarkPointComponent,
  DataZoomComponent,
  LineChart,
  BarChart,
  PieChart,
  ScatterChart,
  RadarChart,
  TreemapChart,
  CandlestickChart,
  LabelLayout,
  UniversalTransition,
  CanvasRenderer,
]);

/**
 * @param {object} chartData 图表数据
 * @param {string} chartType 图表类型
 * @param {object} expandOption ?定制化配置(如: title)
 * @param {object} newOption ?重新生成配置
 */
const props = defineProps<{
  chartData: Array<Array<string | number>>;
  chartType: string;
  expandOption?: Record<string, unknown>;
  newOption?: Record<string, unknown>;
}>();

const chartComponent = ref();
let chartInstance = null; // 3.0中实例不能定义成响应式，有一些配置无法装载（如：tooltip|resize）
const state = reactive({
  options: null,
});
watch(
  () => props.chartData,
  () => {
    updateChart();
  },
  { deep: true },
);

const initChart = () => {
  chartInstance = echarts.init(chartComponent.value as HTMLElement);
  if (props.chartType === "SCATTER") {
    // @ts-ignore
    echarts.registerTransform(ecStat.transform.clustering);
  }
};
const initOptions = () => {
  const isReplaceOption = props.newOption ? Object.keys(props.newOption).length : 0;
  const hasOption = props.expandOption ? Object.keys(props.expandOption).length : 0;
  // 有替换的配置直接赋值
  if (isReplaceOption) {
    state.options = props.newOption;
    return;
  }
  // 数据放入series里的类型
  const seriesData = [];
  const legendArr = [];
  switch (props.chartType) {
    case "LINE_Market":
      props.chartData.yData.map((item, index) => {
        seriesData.push({
          name: props.chartData.legendType[index],
          type: "line",
          data: item,
          yAxisIndex: index,
          markPoint: {
            data: [
              {
                coord: [1, 20],
              },
              {
                coord: [2, 30],
              },
              {
                coord: [3, 10],
              },
              {
                coord: [4, 15],
              },
            ],
            itemStyle: {
              color: "transparent",
            },
            label: {
              offset: [25, -30],
              formatter: function (params) {
                return ["{a|distance}", "{a|35245}", "{a|3769}"].join("\n");
              },
              rich: {
                a: {
                  color: "#e31430",
                  lineHeight: 20,
                  backgroundColor: "rgba(227, 20, 48, 0.1)",
                  borderColor: "#e31430",
                  borderWidth: 0.5,
                  padding: 3,
                  borderRadius: 2,
                },
              },
            },
            silent: true,
          },
        });
      });
      const handleData = deepCopy(seriesData);
      const extraData = [];
      handleData.map((options) => {
        extraData.push({
          name: options.name,
          data: options.data,
          type: options.type,
          yAxisIndex: options.yAxisIndex,
          markPoint: options.markPoint,
        });
      });
      extraData.map((options) => {
        options.markPoint.label.offset = [25, 60];
        options.markPoint.label.rich.a.color = "#1bb46d";
        options.markPoint.label.rich.a.borderColor = "#1bb46d";
        options.markPoint.label.rich.a.backgroundColor = "rgba(27,180,109, 0.1)";
      });
      extraData.map((item) => {
        seriesData.push(item);
      });
      props.chartData.legendType.map((item) => legendArr.push(item));
      state.options = {
        title: {
          text: (hasOption && props.expandOption.title) || "",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            animation: false,
            label: {
              backgroundColor: "#505765",
            },
          },
        },
        // 图例
        legend: {
          data: legendArr,
        },
        // 整个网格
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        // 工具箱
        toolbox: {},
        xAxis: {
          type: "category",
          boundaryGap: false, // 是否留白
          data: props.chartData.xData,
        },
        yAxis: [
          {
            name: "Email",
            type: "value",
          },
          {
            name: "Union",
            nameLocation: "end",
            alignTicks: true,
            type: "value",
            inverse: false,
          },
        ],
        series: seriesData,
      };
      // 添加属性或者修改原有属性值
      // hasOption && Object.keys(props.expandOption).map(v => state.options[v] = props.expandOption[v])
      break;
    case "LINE":
      props.chartData.yData.map((item, index) => {
        seriesData.push({
          name: props.chartData.legendType[index],
          type: "line",
          // stack: 'Total',
          data: item,
        });
      });
      props.chartData.legendType.map((item) => legendArr.push(item));
      state.options = {
        title: {
          text: (hasOption && props.expandOption.title) || "",
        },
        tooltip: {
          trigger: "axis",
        },
        // 图例
        legend: {
          data: legendArr,
        },
        // 整个网格
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        // 工具箱
        toolbox: {},
        xAxis: {
          type: "category",
          boundaryGap: false, // 是否留白
          data: props.chartData.xData,
        },
        yAxis: {
          type: "value",
        },
        series: seriesData,
      };
      // 添加属性或者修改原有属性值
      // hasOption && Object.keys(props.expandOption).map(v => state.options[v] = props.expandOption[v])
      break;
    case "TREEMAP":
      state.options = {
        title: {
          text: (hasOption && props.expandOption.title) || "",
        },
        series: [
          {
            name: "ALL",
            type: "treemap",
            label: {
              show: true,
              formatter: "{b}",
            },
            itemStyle: {
              borderColor: "white",
            },
            visualMin: 1,
            visualMax: 100,
            visualDimension: 0,
            levels: [
              {
                itemStyle: {
                  borderWidth: 3,
                  borderColor: "white",
                  gapWidth: 3,
                },
              },
              {
                colorSaturation: [0.7, 0.1],
                colorMappingBy: "value",
                itemStyle: {
                  gapWidth: 1,
                },
                label: {
                  color: "#fff",
                },
              },
            ],
            data: props.chartData,
          },
        ],
      };
      break;
    case "BAR":
      const series = [
        {
          name: "Direct",
          type: "bar",
          barWidth: "60%",
          data: props.chartData.yData,
        },
      ];
      state.options = {
        title: {
          text: (hasOption && props.expandOption.title) || "",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: {
          type: "category",
          data: props.chartData.xData,
          axisTick: {
            alignWithLabel: true, // 刻度线居中
          },
        },
        yAxis: {
          type: "value",
        },
        series,
      };
      // 添加属性或者修改原有属性值
      // hasOption && Object.keys(props.expandOption).map(v => state.options[v] = props.expandOption[v])
      break;
    case "MUTILBAR":
      const app: any = {};
      app.config = {
        rotate: 90,
        align: "left",
        verticalAlign: "middle",
        position: "insideBottom",
        distance: 15,
      };
      const labelOption = {
        show: true,
        position: app.config.position,
        distance: app.config.distance,
        align: app.config.align,
        verticalAlign: app.config.verticalAlign,
        rotate: app.config.rotate,
        formatter: "{c}  {name|{a}}",
        fontSize: 16,
        rich: {
          name: {},
        },
      };
      props.chartData.yData.map((item, index) => {
        seriesData.push({
          name: props.chartData.legendType[index],
          type: "bar",
          label: labelOption,
          emphasis: {
            focus: "series",
          },
          data: item,
        });
      });
      props.chartData.legendType.map((item) => legendArr.push(item));
      state.options = {
        title: {
          text: (hasOption && props.expandOption.title) || "",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },
        legend: {
          data: legendArr,
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: {
          type: "category",
          axisTick: { show: false },
          data: props.chartData.xData,
        },
        yAxis: {
          type: "value",
        },
        series: seriesData,
      };
      // 添加属性或者修改原有属性值
      // hasOption && Object.keys(props.expandOption).map(v => state.options[v] = props.expandOption[v])
      break;
    case "PIE":
      seriesData.push({
        name: "Access From",
        type: "pie",
        radius: "50%",
        data: props.chartData,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)",
          },
        },
      });
      state.options = {
        title: {
          text: (hasOption && props.expandOption.title) || "",
          left: "center",
        },
        tooltip: {
          trigger: "item",
        },
        legend: {
          type: "scroll",
          orient: "vertical",
          left: "left",
        },
        series: seriesData,
      };
      // 添加属性或者修改原有属性值
      // hasOption && Object.keys(props.expandOption).map(v => state.options[v] = props.expandOption[v])
      break;
    case "SCATTER":
      const CLUSTER_COUNT = 6; // 数据分组
      const DIENSIION_CLUSTER_INDEX = 2; // 维度索引
      const COLOR_ALL = ["#37A2DA", "#e06343", "#37a354", "#b55dba", "#b5bd48", "#8378EA", "#96BFFF"];
      const pieces = [];
      for (let i = 0; i < CLUSTER_COUNT; i++) {
        pieces.push({
          value: i,
          label: "cluster " + i,
          color: COLOR_ALL[i],
        });
        // 不平均分的方法
        // 指定{min: xxx, max: xxx,label: xxx, color: xxx}
      }
      state.options = {
        title: {
          text: (hasOption && props.expandOption.title) || "",
          left: "center",
        },
        dataset: [
          { source: props.chartData },
          {
            // ecstat配置
            transform: {
              type: "ecStat:clustering",
              // print: true,
              config: {
                clusterCount: CLUSTER_COUNT, // 生成的族数
                outputType: "single", // 输出的格式
                outputClusterIndexDimension: DIENSIION_CLUSTER_INDEX, // 维度索引
              },
            },
          },
        ],
        tooltip: {
          position: "top",
        },
        visualMap: {
          type: "piecewise",
          top: "middle",
          min: 0,
          max: CLUSTER_COUNT,
          left: 10,
          splitNumber: CLUSTER_COUNT, // 连续型数据平均分段
          dimension: DIENSIION_CLUSTER_INDEX,
          pieces, // 自定义每一段的数据范围、样式
        },
        grid: {
          left: 120,
        },
        xAxis: {},
        yAxis: {},
        series: {
          type: "scatter",
          encode: { tooltip: [0, 1] },
          symbolSize: 15,
          itemStyle: {
            borderColor: "#555",
          },
          datasetIndex: 1, // 本系列使用对应的dataset
        },
      };
      // 添加属性或者修改原有属性值
      // hasOption && Object.keys(props.expandOption).map(v => state.options[v] = props.expandOption[v])
      break;
    case "RADAR":
      seriesData.push({
        name: "Budget vs spending",
        type: "radar",
        data: props.chartData,
      });
      state.options = {
        title: {
          text: (hasOption && props.expandOption.title) || "",
          left: "left",
        },
        legend: {
          data: ["Allocated Budget", "Actual Spending"],
        },
        radar: {
          // shape: 'circle',
          indicator: [
            { name: "Sales", max: 6500 },
            { name: "Administration", max: 16000 },
            { name: "Information Technology", max: 30000 },
            { name: "Customer Support", max: 38000 },
            { name: "Development", max: 52000 },
            { name: "Marketing", max: 25000 },
          ],
        },
        series: seriesData,
      };
      break;
    case "KLINE":
      const upColor = "#e31430";
      const upBorderColor = "#8A0000";
      const downColor = "#1bb46d";
      const downBorderColor = "#008F28";
      state.options = {
        dataset: {
          source: props.chartData,
        },
        title: {
          text: (hasOption && props.expandOption.title) || "",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "line",
          },
        },
        grid: [
          {
            left: 0,
            right: 0,
            top: 0,
            bottom: 20,
          },
          {
            left: 0,
            right: 0,
            height: 0,
            bottom: 0,
          },
        ],
        xAxis: [
          {
            type: "category",
            boundaryGap: true,
            // inverse: true,
            axisLine: { onZero: false },
            splitLine: { show: false },
            min: "dataMin",
            max: "dataMax",
            axisTick: {
              alignWithLabel: true,
            },
          },
          {
            type: "category",
            gridIndex: 1,
            boundaryGap: true,
            axisLine: { onZero: false },
            axisTick: { show: false, alignWithLabel: true },
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
            start: 10,
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
          // {
          //   name: "Volumn",
          //   type: "bar",
          //   xAxisIndex: 1,
          //   yAxisIndex: 1,
          //   itemStyle: {
          //     color: "#7fbe9e",
          //   },
          //   large: true,
          //   encode: {
          //     x: 0,
          //     y: 5,
          //   },
          // },
        ],
      };
      break;
    default:
      break;
  }
};
const updateChart = () => {
  initOptions();
  chartInstance.setOption(state.options);
  nextTick(() => {
    chartInstance.resize();
  });
};
onMounted(() => {
  initChart();
  window.addEventListener("resize", () => {
    if (chartInstance) chartInstance.resize();
  });
});
onBeforeUnmount(() => {
  chartInstance = null;
  state.options = null;
});
defineExpose({
  chartInstance,
});
</script>

<style lang="scss" scoped></style>
