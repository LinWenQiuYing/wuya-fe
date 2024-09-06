<template>
  <!-- 图谱容器 -->
  <div :id="`cyDom${props.whichComponent}`" ref="cyRef" class="two_graph"></div>
  <!-- 头部-分类 -->
  <div v-if="props.isShowOptions" class="header_category">
    <span
      v-for="(type, index) in state.types"
      :key="index"
      class="category"
      :class="{ active: state.currentType === type.class }"
      :style="`background: ${colors[state.typeColors[type.class]]};border-color: ${
        state.currentType === type.class ? borderColors[state.typeColors[type.class]] : 'transparent'
      };
      color: ${borderColors[state.typeColors[type.class]]}`"
      @click="handleTypeClick(type.class)"
    >
      {{ type.key }}({{ type.num }})
    </span>
  </div>
  <!-- 底部-配置颜色&大小 -->
  <div v-if="state.currentType" class="footer_options">
    <div class="footer_options_color">
      <p>颜色：</p>
      <div class="options">
        <span
          v-for="(color, index) in colors"
          :key="index"
          class="optionsColor"
          :class="{ active: state.typeColors[state.currentType] === index }"
          :style="`background: ${color};border-color: ${borderColors[index]}`"
          @click="handleColorClick(index)"
        >
        </span>
      </div>
    </div>
    <div class="footer_options_size">
      <p>大小：</p>
      <div class="options">
        <span
          v-for="i in 4"
          :key="i"
          class="optionsColor optionsSize"
          :class="{ active: state.typeSizes[state.currentType] === i }"
          :style="`width: ${(i + 5) * 2}px;height: ${(i + 5) * 2}px`"
          @click="handleSizeClick(i)"
        >
        </span>
      </div>
    </div>
  </div>
  <!-- 布局计算盒子 -->
  <div
    v-show="state.layout === 'd3-force' && propsValue.graphData.nodes && propsValue.graphData.nodes.length"
    :id="`progress-box${props.whichComponent}`"
    class="cytoscape--container__loading"
  >
    <div class="progress-bar">
      <div class="progress-bar__outer">
        <div :id="`progress-bar${props.whichComponent}`" class="progress-bar__inner"></div>
      </div>
      <div :id="`progress-text${props.whichComponent}`" class="progress-bar__text"></div>
    </div>
  </div>
  <!-- 右键盒子 -->
  <!-- <CtxMenuBox
    v-if="state.ctxMenuVisible"
    :data="state.ctxData"
    @handleCtxData="handleCtxDataFn"
    :bluePrintId="props.bluePrintId"
  /> -->
</template>

<script lang="ts" setup>
import { inject, onMounted, reactive, ref, watch } from "vue";
import { formatData } from "./features/dataFormat.js";
import { cxttapstartEvents, dbclickEvents, mouseupEvents, singleClickEvents } from "./features/events.js";
import { resetAllClass, showSinglePath } from "./features/pathView.js";

import md5 from "md5";
import { borderColors, colors } from "./features/colors.js";
import { getRelationPath } from "./features/getRelationPath.js";
import LayoutOptions, { setWhichComponent } from "./features/layoutOptions.js";
import styleSheetList from "./features/styleSheetList"; // 修改节点及边的样式 可自定义类去覆盖
// // import CtxMenuBox from "./CtxMenuBox.vue";
import cytoscape from "cytoscape";
import cise from "cytoscape-cise";
import d3Force from "cytoscape-d3-force";
import fcose from "cytoscape-fcose";
// import dagre from "cytoscape-dagre";

cytoscape.use(cise);
cytoscape.use(fcose);
cytoscape.use(d3Force);
// cytoscape.use(dagre);

const emits = defineEmits(["nodeAndEdgeClick", "getMoreData", "updatePosition", "sendCy"]);
const cyRef = ref(null);
const propsValue = defineProps<{
  graphData: {
    nodes: unknown[];
    edges: unknown[];
  };
  prevData: {
    nodes: unknown[];
    edges: unknown[];
  };
}>();
const props = {};
props.whichComponent = inject("whichComponentProps");
props.isShowOptions = inject("isShowOptionsProps");
props.isAddEvents = inject("isAddEventsProps");
props.isDbclickEvents = inject("isDbclickEventsProps");
props.isDbclickhandle = inject("isDbclickhandleProps");
props.isKnowlegeModel = inject("isKnowlegeModelProps");
props.customPosition = inject("customPositionProps");
props.isCalcColors = inject("isCalcColorsProps");
props.isCxttapstart = inject("isCxttapstartProps");
props.bluePrintId = inject("bluePrintIdProps");
props.currentPathIdx = inject("currentPathIdxProps");
props.pathsData = inject("pathsDataProps");
props.startEndPoints = inject("startEndPointsProps");

const state = reactive({
  cy: null, // 图谱实例
  types: [],
  style: {}, // 切换时style
  currentType: "", // 配置选中的分类
  typeColors: {}, // 颜色随机码
  typeSizes: {}, // 大小随机码
  initFinalData: {}, // 初始化最终处理后的数据
  layout: "fcose",
  layoutOptions: {},
  paths: [], // 全部的路径数据
  activePath: [], // 当前高亮的路径
  singleClickNode: [], // 单击选中的节点
  singleClickEdge: {}, // 单击选中的关系
  ctxMenuVisible: false, // 右键菜单显示
  ctxData: {
    x: "",
    y: "",
    bluePrintId: "",
    data: null,
    orginData: null,
  },
  currentDbclickNodeId: "",
  currenDbclickNodeData: [], // 当前双击的节点数据
  markCurrentEvent: "", // 'ldc'左键双击事件，'rsc'右键单击事件
});
watch(
  () => propsValue.graphData,
  () => {
    if (props.isDbclickhandle && props.isDbclickhandle.value) {
      updateGraph();
    } else {
      initCytoscape();
    }
  },
  { deep: true },
);
// 不同的路径索引，高亮不同的线路
watch(
  () => props.currentPathIdx,
  (idxObj) => {
    changeActivePath(idxObj.value);
  },
  { deep: true },
);

const initCytoscape = () => {
  const labelArr = [];
  propsValue.graphData.nodes.forEach((node) => labelArr.push(node.label));
  state.types = Array.from(
    new Set(propsValue.graphData.nodes.map((node) => "class" + md5(node.label || node.id))),
  );
  state.types.length &&
    state.types.forEach((type, index) => {
      // state.typeColors[type] = index
      // state.typeSizes[type] = 2
      state.style[type] = {};
    });
  handleColor();
  state.types = getLabelsNumber(labelArr);
  state.initFinalData = formatData(propsValue.graphData, props.startEndPoints);
  state.layoutOptions = LayoutOptions[state.layout];
  state.cy = cytoscape({
    container: cyRef.value,
    elements: state.initFinalData, // 要生成的数据元素
    zoom: 1, // 缩放级别
    style: styleSheetList,
    layout: props.customPosition ? null : state.layoutOptions,
    minZoom: 0.2,
    maxZoom: 2.5,
    wheelSensitivity: 0.2, // 滚轮缩放速率
  });
  extraHandler();
  // setTimeout(() => {
  //   state.cy.zoom(0.85);
  // }, 500);
  emits("sendCy", state.cy);
  // 初始化渲染完暴露图谱cy对象
};
// 业务上的处理函数
const extraHandler = () => {
  if (Object.keys(props.pathsData).length && props.pathsData.value.length) {
    pathDiscoverFn();
  } else {
    onceRelationship();
  }
  if (props.isCxttapstart) ctxMenuFn();
  if (props.isDbclickEvents) dbclickFn();
  if (props.customPosition) customLayoutFn();
};
// 全路径发现（通过后端数据处理已实现），前端方法getAllPath也能实现但数据还未作处理
const pathDiscoverFn = () => {
  // 这里的点击事件只作清除样式作用
  if (props.isAddEvents) {
    singleClickEvents(state.cy, () => {
      changeActivePath(-1);
    });
  }
  if (!props.pathsData.value.length) return;
  props.pathsData.value.forEach((outArray) => {
    const orderPaths = [];
    outArray.forEach((innerItem, index) => {
      if (index + 1 === outArray.length) {
        orderPaths.push(innerItem.startId);
        orderPaths.push(innerItem.endId);
      } else {
        orderPaths.push(innerItem.startId);
      }
    });
    state.paths.push(orderPaths);
  });
  changeActivePath(props.currentPathIdx.value);
};
// 一度关系发现
const onceRelationship = () => {
  if (props.isAddEvents) {
    singleClickEvents(state.cy, (nodeIds, edgeClass) => {
      state.ctxMenuVisible = false;
      state.cy.$(nodeIds).forEach((ele) => {
        ele.removeClass("path-node-ctx");
      });
      getRelationPath(nodeIds, state.cy, true, edgeClass);
      if (props.isKnowlegeModel) return;
      state.singleClickNode = [];
      state.singleClickEdge = {};
      if (edgeClass) {
        // 单击的是关系
        // state.singleClickEdge = state.cy.$(`#${edgeClass.id()}`).data()
        state.singleClickEdge = state.cy
          .edges()
          .filter((edge) => edge.id() === edgeClass.id())
          .data();
        nodeIds.map((id) => state.singleClickNode.push(state.cy.$(`#${id}`).data()));
      } else {
        // 单击的是节点
        if (nodeIds.length) state.singleClickNode.push(state.cy.$(`#${nodeIds[0]}`).data());
      }
      emits("nodeAndEdgeClick", state.singleClickNode, state.singleClickEdge);
    });
  }
};
// 切换高亮的路径（路径查询）
const changeActivePath = (idx) => {
  state.selectedPathIdx = idx;
  if (state.selectedPathIdx === -1) {
    state.activePath = [];
    resetAllClass(state.cy);
  } else {
    state.activePath = state.paths[state.selectedPathIdx];
    showSinglePath(state.cy, state.activePath);
  }
};
// 双击后更新图谱
const updateGraph = () => {
  // 定义标志 -- 用来区分是增加还是移除节点
  let flag = null;
  // 定义要 增加/移除 的 节点/关系 对象
  const handleData = {
    nodes: [],
    edges: [],
  };
  // 比较两个数组的长度  进行取差集操作
  if (propsValue.prevData.nodes.length <= propsValue.graphData.nodes.length) {
    flag = "add";
    // 获取两个数组的差集
    handleData.nodes = propsValue.graphData.nodes.filter(
      (v) => !propsValue.prevData.nodes.some((item) => item.id === v.id),
    );
    if (propsValue.prevData.edges.length <= propsValue.graphData.edges.length) {
      handleData.edges = propsValue.graphData.edges.filter(
        (v) => !propsValue.prevData.edges.some((item) => item.id === v.id),
      );
    } else {
      flag = "remove";
      handleData.edges = propsValue.prevData.edges.filter(
        (v) => !propsValue.graphData.edges.some((item) => item.id === v.id),
      );
    }
  } else {
    flag = "remove";
    // 获取两个数组的差集
    handleData.nodes = propsValue.prevData.nodes.filter(
      (v) => !propsValue.graphData.nodes.some((item) => item.id === v.id),
    );
    handleData.edges = propsValue.prevData.edges.filter(
      (v) => !propsValue.graphData.edges.some((item) => item.id === v.id),
    );
  }
  // 处理数据
  const addRemoveData = [];
  handleData.nodes.forEach((item) => {
    addRemoveData.push({
      group: "nodes",
      data: item,
      classes: "class" + md5(item.label),
    });
  });
  handleData.edges.forEach((item) => {
    // 关系不能有id
    addRemoveData.push({
      group: "edges",
      data: {
        source: item.source + "",
        target: item.target + "",
        id: "edges" + item.id,
        label: item.label,
        rootId: item.rootId ? item.rootId : "",
        properties: {
          ...item.properties,
        },
      },
    });
  });
  // 为空证明接口返回的数据存在于已有的图谱数据中，忽略
  if (!addRemoveData.length) return;
  state.types = Array.from(
    new Set(propsValue.graphData.nodes.map((node) => "class" + md5(node.label || node.id))),
  );
  state.types.length &&
    state.types.forEach((type, index) => {
      state.style[type] = {};
    });
  // 进行 增加/移除 操作
  if (flag === "add") {
    // 更新label类别及样式
    handleColor();
    const labelArr = [];
    propsValue.graphData.nodes.forEach((node) => labelArr.push(node.label));
    state.types = getLabelsNumber(labelArr);
    // 渲染图谱
    state.cy.add(addRemoveData);
    state.cy.style(styleSheetList);
    switchLayout(state.layout, true);
    if (!state.currentDbclickNodeId) return; // 防止state.currentDbclickNodeId为空的时候导致全局匹配标红bug
    setTimeout(() => {
      // 当右键扩展 之后 需要高亮显示出扩展出来的关系和节点
      if (state.markCurrentEvent === "rsc") {
        // 新出现的关系需高亮
        state.cy.nodes().removeClass("path-node-ctx");
        state.cy.edges().removeClass("path-edge");
        handleData.nodes.forEach((node) => {
          state.cy.nodes().forEach(($node) => {
            if ($node.id() === node.id) $node.addClass("path-node-ctx");
          });
        });
        handleData.edges.forEach((edge) => {
          state.cy.edges().forEach(($edge) => {
            if ($edge.id() === `edges${edge.id}` || $edge.id() === edge.id) $edge.addClass("path-edge");
          });
        });
      }
      state.cy.nodes(`#${state.currentDbclickNodeId}`).style({ "border-width": 4, "border-color": "red" });
    }, 500);
  } else {
    handleColor();
    const labelArr = [];
    propsValue.graphData.nodes.forEach((node) => labelArr.push(node.label));
    state.types = getLabelsNumber(labelArr);
    // 移除方法和增加方法不一样
    handleData.nodes.forEach((item) => {
      state.cy.nodes("#" + item.id).remove();
    });
    handleData.edges.forEach((item) => {
      state.cy.edges("#" + "edges" + item.id).remove();
    });
    state.cy.style(styleSheetList);
    switchLayout(state.layout, true);
    if (!state.currenDbclickNodeData.length) return;
    const currentNodeData = state.currenDbclickNodeData.filter(
      (item) => item.id === state.currentDbclickNodeId,
    );
    const deleteIdx = state.currenDbclickNodeData.findIndex((item) => item.id === state.currentDbclickNodeId);
    state.currenDbclickNodeData.splice(deleteIdx, 1);
    setTimeout(() => {
      state.cy.nodes(`#${state.currentDbclickNodeId}`).style({
        "border-width": currentNodeData[0].brWidth,
        "border-color": currentNodeData[0].brColor,
      });
    }, 500);
  }
  // 初始化渲染完暴露图谱最新cy对象，并且本次双击结果完成
  emits("sendCy", state.cy);
};
// 右键点击（type: nodes/edges分别表示是节点类型和关系类型）
const ctxMenuFn = () => {
  state.ctxMenuVisible = false;
  cxttapstartEvents(state.cy, (ctxTapRightData, type, nodePosition) => {
    // 阻止浏览器右键
    // document.oncontextmenu = new Function("event.returnValue=false");
    if (ctxTapRightData && ctxTapRightData.id) {
      getCtxMenuData({ ctxTapRightData, type, nodePosition });
      state.markCurrentEvent = "rsc";
    }
  });
};
// 双击事件
const dbclickFn = () => {
  dbclickEvents(state.cy, (data) => {
    emits("getMoreData", { nodeData: data }, props.whichComponent);
    markClickNode(data.id);
    state.markCurrentEvent = "ldc";
  });
};
// 标记点击事件(双击/右键根据关系扩展)的节点数据，备份原始样式数据和当前标记节点
const markClickNode = (currentNodeId) => {
  let flag = true;
  state.currentDbclickNodeId = currentNodeId;
  state.currenDbclickNodeData.length &&
    state.currenDbclickNodeData.forEach((item) => {
      if (item.id === currentNodeId) flag = false;
    });
  if (!flag) return;
  const currentNode = state.cy.nodes(`#${currentNodeId}`);
  const nodeStyle = currentNode[0]._private.style;
  state.currenDbclickNodeData.push({
    id: currentNodeId,
    brColor: nodeStyle["border-color"].strValue,
    brWidth: nodeStyle["border-width"].value,
  });
};
// 自定义布局
const customLayoutFn = () => {
  mouseupEvents(state.cy, (target) => {
    if (target.isNode && target.isNode()) emits("updatePosition", target, state.cy);
  });
  const nodes = state.cy.nodes();
  for (const node of nodes) {
    console.log(node);
    if (
      node._private.data.style.position &&
      node._private.data.style.position.x &&
      node._private.data.style.position.y
    )
      node.position({
        x: node._private.data.style.position.x,
        y: node._private.data.style.position.y,
      });
  }
  state.cy.center();
};
// 打开右键菜单
const getCtxMenuData = async (dataObj) => {
  console.log(dataObj);
  if (dataObj.ctxTapRightData.id) {
    state.ctxMenuVisible = true;
    const halfHight = (document.documentElement.clientHeight - 200) / 2;
    if (halfHight > dataObj.nodePosition.y) {
      state.ctxData.x = dataObj.nodePosition.x + "px";
      state.ctxData.y = dataObj.nodePosition.y + "px";
    } else {
      state.ctxData.x = dataObj.nodePosition.x + "px";
      state.ctxData.y = dataObj.nodePosition.y - 320 + "px";
    }
    state.ctxData = {
      x: state.ctxData.x,
      y: state.ctxData.y,
      data: dataObj.ctxTapRightData,
      type: dataObj.type,
      bluePrintId: props.bluePrintId.value,
      originData: propsValue.graphData,
    };
  }
};
// 右键菜单点击确定回调
const handleCtxDataFn = (dataObj, eventType) => {
  state.ctxMenuVisible = false;
  if (eventType === "ship") {
    emits("getMoreData", dataObj, props.whichComponent);
    markClickNode(dataObj.nodeData.id);
  } else if (eventType === "nodeProperty") {
    const { currentInfo, nodeProperty } = dataObj;
    state.cy.nodes().map(($node) => {
      if ($node.data().id === currentInfo.id && $node.data().label === currentInfo.label) {
        $node.data("name", nodeProperty.name);
        $node.data("properties", nodeProperty);
      }
    });
  } else if (eventType === "shipProperty") {
    const { currentInfo, shipProperty } = dataObj;
    state.cy.edges().map(($edge) => {
      if ($edge.data().id === currentInfo.id && $edge.data().label === currentInfo.label) {
        $edge.data("properties", shipProperty);
      }
    });
  }
};
const switchLayout = (layout, needUpdate) => {
  if (state.layout === layout && !needUpdate) return;
  state.layout = layout;
  state.layoutOptions = LayoutOptions[layout];
  // ->切换布局时，如果有异步布局（连续性布局），会保留一些布局特性（例如force的动画），所以这里取消了force的动画，
  // ->利用loading来完成force布局的计算
  if (state.layout === "d3-force") setWhichComponent(props.whichComponent, state.cy);
  state.cy.layout(state.layoutOptions).run();
};
// 将分类好的节点加入样式表中
const sizePer = 20;
const handleColor = () => {
  if (props.isCalcColors) {
    propsValue.graphData.nodes.map((node) => {
      const type = "class" + md5(node.label);
      const style = getCalcColorsStyle(node, type);
      // const i = styleSheetList.findIndex((item) => item.selector === type);
      // if (i > -1) styleSheetList.splice(i, 1);
      // 把以下内容加入到了styleSheetList中
      styleSheetList.push({
        selector: `.${type}`,
        style,
      });
    });
  } else {
    let i = 0;
    state.types.forEach((type) => {
      if (typeof state.typeColors[type] === "undefined") {
        state.typeSizes[type] = 2;
        if (i > colors.length - 1) i = 0;
        state.typeColors[type] = i;
        i++;
        styleSheetList.push({
          selector: `.${type}`,
          style: {
            "background-color": colors[state.typeColors[type]],
            "border-color": borderColors[state.typeColors[type]],
            "border-width": 2,
            width: 40 || state.typeSizes[type] * sizePer,
            height: 40 || state.typeSizes[type] * sizePer,
          },
        });
      } else {
        const index = styleSheetList.findIndex((item) => item.selector === type);
        if (index > -1) styleSheetList.splice(index, 1);
        const style = getStyle(type);
        styleSheetList.push({
          selector: `.${type}`,
          style,
        });
      }
    });
  }
};
// 已传入style配置的节点数据样式处理
const getCalcColorsStyle = (node, type) => {
  let style = {
    "background-color": node.style && node.style.nodeColor,
    "border-color": node.style && node.style.brColor,
    "border-width": 2,
    width: node.style && node.style.size,
    height: node.style && node.style.size,
  };
  if (state.style[type]) {
    style = { ...style, ...state.style[type] };
  }
  return style;
};
// 类型切换(点击Header类型标签时触发)
const handleTypeClick = (type) => {
  // 取消选中状态
  if (state.currentType === type) {
    state.currentType = "";
    return;
  }
  state.currentType = type;
};
// 颜色切换
const handleColorClick = (index) => {
  if (state.currentType !== "") {
    state.typeColors[state.currentType] = index;
    if (!state.style[state.currentType]) state.style[state.currentType] = {};
    state.style[state.currentType]["background-color"] = colors[state.typeColors[state.currentType]];
    state.style[state.currentType]["border-color"] = borderColors[state.typeColors[state.currentType]];
    state.cy.$(`.${state.currentType}`).style({
      "background-color": colors[state.typeColors[state.currentType]],
      "border-color": borderColors[state.typeColors[state.currentType]],
    });
  }
};
// 大小切换
const handleSizeClick = (i) => {
  if (state.currentType !== "") {
    state.typeSizes[state.currentType] = i;
    if (!state.style[state.currentType]) state.style[state.currentType] = {};
    state.style[state.currentType].width = i * sizePer;
    state.style[state.currentType].height = i * sizePer;
    state.cy.$(`.${state.currentType}`).style({
      width: i * sizePer,
      height: i * sizePer,
    });
  }
};
const getStyle = (type) => {
  let style = {
    "background-color": colors[state.typeColors[type]],
    "border-color": borderColors[state.typeColors[type]],
    "border-width": 2,
    width: 40 || state.typeSizes[type] * sizePer,
    height: 40 || state.typeSizes[type] * sizePer,
  };
  if (state.style[type]) {
    style = { ...style, ...state.style[type] };
  }
  return style;
};
// 获取同类label个数并返回新数据
const getLabelsNumber = (arr) => {
  const ArrObj = [];
  arr.sort();
  arr.forEach((element, index) => {
    if (element === arr[index - 1]) {
      ArrObj[ArrObj.length - 1].num++;
    } else {
      ArrObj.push({
        key: element,
        class: "class" + md5(element),
        num: 1,
      });
    }
  });
  return ArrObj;
};
onMounted(() => {
  sessionStorage.setItem("graphMode", "init");
});
defineExpose({
  state,
  switchLayout,
});
</script>

<style scoped lang="scss">
@import "src/styles/theme";
.two_graph {
  width: 100%;
  height: 100%;
  z-index: 998;
  background-color: $background-color-light;
  position: relative;
}
.header_category {
  position: absolute;
  top: 0px;
  //left: 10px;
  //right: 10px;
  z-index: 999;
  padding: 5px;
  background-color: $background-color-light;
  //background-color: #fff;
  box-sizing: border-box;
  .category {
    display: inline-block;
    border-radius: 6px;
    //padding: 4px 10px;
    font-size: 12px;
    padding: 2px 5px;
    margin: 5px;
    pointer-events: auto;
    cursor: pointer;
    border-style: solid;
    border-width: 0;
    text-align: center;
    margin-bottom: 5px;
    border-width: 2px;
  }
  .category.active {
    // border-width: 2px;
  }
}
.footer_options {
  position: absolute;
  bottom: 10px;
  left: 10px;
  z-index: 999;
  //display: flex;
  &_color,
  &_size {
    display: flex;
    align-items: center;
    p {
      font-size: 12px;
    }
  }
  &_color {
    margin-bottom: 4px;
  }
  .options {
    display: flex;
  }
  .optionsColor {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    overflow: hidden;
    pointer-events: auto;
    cursor: pointer;
    margin: 0 5px;
    border-style: solid;
    border-width: 0;
    text-align: center;
    margin-top: 3px;
  }
  .optionsColor.active {
    border-width: 2px;
  }
  .optionsSize {
    background-color: #ced4da;
  }
  .optionsSize.active {
    background-color: #8a92a0;
    border-width: 0;
  }
}
.cytoscape--container__loading {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  z-index: 2000;
  background: #f8f8f8;
}
.progress-bar {
  top: 50%;
  margin-top: -15px;
  left: 20%;
  width: 60%;
  text-align: center;
  position: absolute;
  overflow: hidden;
}
.progress-bar__outer {
  width: 100%;
  border-radius: 100px;
  margin: 16px 0;
  height: 10px;
  background-color: #ebeef5;
  overflow: hidden;
  position: relative;
  vertical-align: middle;
}
.progress-bar__inner {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  background-color: #409eff;
  text-align: right;
  border-radius: 100px;
  line-height: 1;
  white-space: nowrap;
}
</style>
