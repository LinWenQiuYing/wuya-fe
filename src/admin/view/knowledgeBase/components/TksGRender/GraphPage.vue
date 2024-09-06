<!-- 图谱父组件 -->
<template>
  <div v-loading="state.initLoading" class="graph_container">
    <Cytoscape2D
      v-if="isTwo"
      ref="Cytoscape2DRef"
      :graphData="props.graphData"
      :prevData="props.prevData"
      @nodeAndEdgeClick="nodeAndEdgeClickFn"
      @getMoreData="getMoreDataFn"
      @updatePosition="updatePositionFn"
      @sendCy="getCyFn"
    />
    <!-- <ForceGraph3D
      v-else
      ref="ForceGraph3DRef"
      :graphData="props.graphData"
      @nodeAndEdgeClick="nodeAndEdgeClickFn"
    /> -->
    <!-- 工具栏 -->
    <div
      v-if="
        isToolShow &&
        props.graphData.nodes &&
        props.graphData.nodes.length &&
        !props.isKnowlegeModel &&
        !props.isShowHeader
      "
      class="graph_tools"
      :class="state.toolbarActive ? '' : 'close'"
    >
      <img
        class="tool_img"
        :src="state.toolbarActive ? png00 : png01"
        @click="state.toolbarActive = !state.toolbarActive"
      />
      <template v-if="isTwo && state.toolbarActive">
        <el-tooltip class="box-item" effect="dark" content="广度优先布局" placement="right-start">
          <img :src="png1" class="tool_img" @click="switchLayoutFn('breadthfirst', false)" />
        </el-tooltip>
        <el-tooltip class="box-item" effect="dark" content="网格布局" placement="right-start">
          <img :src="png2" class="tool_img" @click="switchLayoutFn('grid', false)" />
        </el-tooltip>
        <el-tooltip class="box-item" effect="dark" content="同心圆布局" placement="right-start">
          <img :src="png3" class="tool_img" @click="switchLayoutFn('concentric', false)" />
        </el-tooltip>
        <el-tooltip class="box-item" effect="dark" content="环形布局" placement="right-start">
          <img :src="png5" class="tool_img" @click="switchLayoutFn('circle', false)" />
        </el-tooltip>
        <el-tooltip class="box-item" effect="dark" content="力导布局" placement="right-start">
          <img :src="png9" class="tool_img" @click="switchLayoutFn('d3-force', false)" />
        </el-tooltip>
        <el-tooltip class="box-item" effect="dark" content="弹簧内置布局" placement="right-start">
          <img :src="png8" class="tool_img" @click="switchLayoutFn('fcose', false)" />
        </el-tooltip>
        <!-- <el-tooltip
          class="box-item"
          effect="dark"
          content="树形图布局"
          placement="right-start"
        >
          <img
            :src="png10"
            class="tool_img"
            @click="switchLayoutFn('dagre', false)"
          />
        </el-tooltip> -->
        <el-tooltip class="box-item" effect="dark" content="随机布局" placement="right-start">
          <img :src="png4" class="tool_img" @click="switchLayoutFn('random', false)" />
        </el-tooltip>
        <el-tooltip
          class="box-item"
          effect="dark"
          :content="state.isFullScreen ? '缩小' : '放大'"
          placement="right-start"
        >
          <img
            v-show="isTwo"
            :src="state.isFullScreen ? out : png6"
            class="tool_img"
            @click="toggleFullScreen(true)"
          />
        </el-tooltip>
      </template>
      <!-- <template v-if="state.toolbarActive">
        <span
          class="tool_img tool_font"
          @click="toggleDimension(true)"
          v-show="state.isFullscreen"
          >{{ isTwo ? "3d" : "2d" }}</span
        >
      </template> -->
    </div>
    <!-- 知识模型特定工具栏 -->
    <div v-if="props.isKnowlegeModel && !props.isShowHeader" class="konwlege_tools">
      <img :src="state.isFullScreen ? out : png6" class="tool_img" @click="toggleFullScreen(true)" />
    </div>
    <!-- 节点关系属性详情 -->
    <div
      v-show="state.currentNode.length"
      class="graph_drawer"
      :style="{
        backgroundColor: isTwo ? 'transparent' : 'rgba(255, 255, 255, 0.8)',
      }"
    >
      <div v-for="(node, index) in state.currentNode" :key="index" class="drawer_item">
        <div class="item_title">实体属性</div>
        <div class="item_label">{{ node.name }}</div>
        <div class="item_self">
          <span class="item_name">概念本体：</span>
          <span class="item_value">{{ node.label }}</span>
        </div>
        <div v-for="(key, kIndex) in Object.keys(node.properties)" :key="kIndex" class="item_property">
          <span class="item_name">{{ key }}：</span>
          <span class="item_value">{{ decodeURIComponent(encodeURIComponent(node.properties[key])) }}</span>
        </div>
      </div>
      <div v-if="Object.keys(state.currentEdge).length" class="drawer_item">
        <div class="item_title">关系属性</div>
        <div class="item_self">
          <span class="item_name">关系本体：</span>
          <span class="item_value">{{ state.currentEdge.label }}</span>
        </div>
        <div
          v-for="(key, kIndex) in Object.keys(state.currentEdge.properties)"
          :key="kIndex"
          class="item_property"
        >
          <span class="item_name">{{ key }}：</span>
          <span class="item_value">{{ state.currentEdge.properties[key] }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, provide, reactive, ref, watch } from "vue";
import Cytoscape2D from "./Cytoscape2D/Cytoscape.vue";
// import ForceGraph3D from "./ForceGraph3D/ForceGraph3D.vue";
import png00 from "./Cytoscape2D/img/00.png";
import png01 from "./Cytoscape2D/img/01.png";
import png1 from "./Cytoscape2D/img/1.png";
import png2 from "./Cytoscape2D/img/2.png";
import png3 from "./Cytoscape2D/img/3.png";
import png4 from "./Cytoscape2D/img/4.png";
import png5 from "./Cytoscape2D/img/5.png";
import png6 from "./Cytoscape2D/img/6.png";
import png8 from "./Cytoscape2D/img/8.png";
import png9 from "./Cytoscape2D/img/9.png";
import out from "./Cytoscape2D/img/out.png";
// import { api as fullscreen } from 'vue-fullscreen';
import screenfull from "screenfull";

const isToolShow = ref(false);

const props = defineProps({
  /**
   * 2d图谱组件参数
   */
  // 图谱数据
  graphData: {
    type: Object,
    default: () => {
      return { nodes: [], edges: [] };
    },
  },
  whichComponent: {
    type: Number,
    default: () => 0,
  },
  // 是否展示配置项
  isShowOptions: {
    type: Boolean,
    default: () => true,
  },
  // 是否添加单击事件
  isAddEvents: {
    type: Boolean,
    default: () => true,
  },
  // 是否添加双击事件
  isDbclickEvents: {
    type: Boolean,
    default: () => false,
  },
  // 是否双击了节点
  isDbclickhandle: {
    type: Boolean,
    default: () => false,
  },
  // 双击节点前的数据（用来比较两次数据的差异，做相应的新增或删除）
  prevData: {
    type: Object,
    default: () => {
      return { nodes: [], edges: [] };
    },
  },
  // 知识建模特定头部区域
  isKnowlegeModel: {
    type: Boolean,
    default: () => false,
  },
  // 即不展示知识模型特定区域又不展示其他选项
  isShowHeader: {
    type: Boolean,
    default: () => false,
  },
  // graph自定义布局位置xy
  customPosition: {
    type: Boolean,
    default: () => false,
  },
  // 是否由数据生成节点颜色&大小（知识建模处使用）
  isCalcColors: {
    type: Boolean,
    default: () => false,
  },
  // 右键-是否添加右键事件
  isCxttapstart: {
    type: Boolean,
    default: () => false,
  },
  // 右键-右键查询id
  bluePrintId: {
    type: String,
    default: () => "",
  },
  // 路径发现-当前选中索引
  currentPathIdx: {
    type: Number,
    default: () => -1,
  },
  // 路径发现-后端提供数据
  pathsData: {
    type: Array,
    default: () => [],
  },
  // 路径发现-开始和结束节点[startId, endId]（目前没有使用）
  startEndPoints: {
    type: Array,
    default: () => [],
  },
  /**
   * 3d图谱组件参数
   */
});
provide("isShowOptionsProps", props.isShowOptions);
provide("whichComponentProps", props.whichComponent);
provide("isAddEventsProps", props.isAddEvents);
provide("isDbclickEventsProps", props.isDbclickEvents);
provide(
  "isDbclickhandleProps",
  computed(() => props.isDbclickhandle),
);
provide("isKnowlegeModelProps", props.isKnowlegeModel);
provide("customPositionProps", props.customPosition);
provide("isCalcColorsProps", props.isCalcColors);
provide("isCxttapstartProps", props.isCxttapstart);
provide(
  "bluePrintIdProps",
  computed(() => props.bluePrintId),
);
provide(
  "currentPathIdxProps",
  computed(() => props.currentPathIdx),
);
provide(
  "pathsDataProps",
  computed(() => props.pathsData),
);
provide("startEndPointsProps", props.startEndPoints);
const emits = defineEmits([
  "regetGraphData",
  "initGraphData",
  "getMoreDataFn",
  "updatePosition",
  "sendGraphRenderFinish",
]);
const isTwo = computed(() => {
  return state.toggleView === "2d";
});
const Cytoscape2DRef = ref(null);
const ForceGraph3DRef = ref(null);
const state = reactive({
  cy: null,
  initLoading: false,
  toggleView: "2d",
  toolbarActive: true,
  currentNode: [],
  currentEdge: { label: "", properties: {} },
  isFullscreen: null,
  layout: "fcose",
  graphWidth: "",
  graphHeight: "",
  manualFullscreen: false, // 监听退出全屏时使用
});
watch(
  () => props.graphData,
  (value) => {
    if (value.nodes.length) state.initLoading = false;
  },
  { deep: true },
);

// 点击节点或关系的回调
const nodeAndEdgeClickFn = (nodeData = [], edgeData = {}) => {
  if (nodeData.length && nodeData[0].__threeObj) {
    state.currentNode = [];
    state.currentEdge = {};
    state.currentNode.push(...nodeData);
    if (edgeData) state.currentEdge = edgeData;
  } else {
    state.currentNode = nodeData;
    state.currentEdge = edgeData;
  }
};
const toggleFullScreen = async (isSetValue: boolean) => {
  state.isFullscreen = !state.isFullscreen;
  if (isSetValue) {
    const graphDom = document.getElementsByClassName("graph_container")[props.whichComponent];
    if (screenfull.isEnabled) {
      screenfull.toggle(graphDom);
    }
  }
  const targetDom: any = document.getElementsByClassName("graph_container")[props.whichComponent];
  targetDom.style.position = state.isFullscreen ? "static" : "relative";
  // 退出全屏时须手动设置父级盒子大小
  if (!state.isFullscreen) {
    const parentNode: any =
      document.getElementsByClassName("graph_container")[props.whichComponent].parentNode;
    parentNode.style.width = state.graphWidth + "px";
    parentNode.style.height = state.graphHeight + "px";
    state.manualFullscreen = !state.manualFullscreen;
  } else {
    state.manualFullscreen = !state.manualFullscreen;
  }
  setTimeout(() => {
    switchLayoutFn(state.layout, true);
  }, 200);
};
const listenEvent = () => {
  screenfull.on("change", () => {
    // 延迟监听是否手动设置了值，若手动还为全屏状态，说明是由esc或者插件内按钮退出全屏的
    setTimeout(() => {
      if (!screenfull.isFullscreen && state.manualFullscreen) {
        // toggleDimension(false)
        toggleFullScreen(false);
      }
    }, 500);
  });
};
const switchLayoutFn = (layout, needUpdate) => {
  state.layout = layout;
  Cytoscape2DRef.value.switchLayout(layout, needUpdate);
};
const toggleDimension = (isManual: boolean) => {
  state.currentNode = [];
  state.currentEdge = {};
  if (isManual) {
    state.toggleView === "2d" ? (state.toggleView = "3d") : (state.toggleView = "2d");
  } else {
    if (state.toggleView === "3d") state.toggleView = "2d";
  }
  if (state.toggleView === "2d") {
    state.initLoading = true;
    emits("initGraphData", props.whichComponent);
    setTimeout(() => {
      emits("regetGraphData", props.whichComponent);
    }, 200);
  }
};
const getMoreDataFn = (data, which) => {
  emits("getMoreDataFn", data, which);
};
onMounted(() => {
  nextTick(() => {
    // 解决由于组件异步加载导致 dom未渲染完获取对应宽高，出现宽高获取为0情况
    setTimeout(() => {
      state.graphWidth = document.getElementsByClassName("graph_container")[0].parentNode.clientWidth;
      state.graphHeight = document.getElementsByClassName("graph_container")[0].parentNode.clientHeight;
      listenEvent();
    }, 0);
  });
});

// 获取图谱层的cy对象
const getCyFn = (cy) => {
  state.cy = cy;

  // 监听图谱是否渲染完成
  emits("sendGraphRenderFinish", cy);
};

const updatePositionFn = (position, cy) => {
  emits("updatePosition", position, cy);
};

defineExpose({
  state,
});
</script>

<style lang="scss" scoped>
@import "src/styles/theme";
.graph_container {
  width: 100%;
  height: 100%;
  background-color: #f8f8f8;
  position: relative;
  .graph_tools {
    position: absolute;
    top: 50%;
    left: 10px;
    transform: translateY(-50%);
    width: 30px;
    padding: 5px;
    background-color: #fff;
    box-shadow: 0 0 8px #0000001a;
    transition: 1s;
    z-index: 999;
    .tool_img {
      width: 20px;
      height: 20px;
      cursor: pointer;
      margin-bottom: 8px;
    }
    .tool_font {
      margin-left: 2px;
      font-weight: bold;
      color: #333;
    }
  }
  .graph_tools.close {
    height: 30px;
  }
  .konwlege_tools {
    position: absolute;
    top: 10px;
    right: 10px;
    z-index: 999;
    .tool_img {
      width: 20px;
      height: 20px;
      cursor: pointer;
    }
  }
  .graph_drawer {
    background-color: transparent;
    box-shadow: -2px 0px 51px 1px rgba(0, 0, 0, 0.1);
    border-radius: 4px 4px 4px 4px;
    width: 270px;
    height: 100%;
    position: absolute;
    z-index: 1000;
    top: 0;
    right: 0;
    padding: 20px 10px;
    box-sizing: border-box;
    overflow: hidden auto;
    .drawer_item {
      //margin-top: 20px;
      .item_title {
        font-size: 20px;
        font-weight: bold;
      }
      .item_label {
        display: inline-block;
        padding: 2px 8px;
        background: #1677ff;
        border-radius: 2px;
        color: #ffffff;
        margin: 10px 0;
      }
      .item_value {
        word-wrap: break-word;
      }
    }
  }
}
</style>
