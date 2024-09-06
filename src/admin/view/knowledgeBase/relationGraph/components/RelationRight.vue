<template>
  <div class="relation_right">
    <GraphPage
      ref="cytoscapeComponentRef"
      style="background-color: #f6f8fe"
      :graph-data="state.graphData"
      :blue-print-id="state.bluePrintId"
    />
  </div>
</template>

<script setup lang="ts">
import { getGraphInfo } from "@/admin/api/graphConstruction";
import { handleEchartsData } from "@/admin/view/knowledgeBase/components/TksGRender/commonFn";
import GraphPage from "@/admin/view/knowledgeBase/components/TksGRender/GraphPage.vue";
import { onMounted, reactive, ref, watch } from "vue";

const props = defineProps<{
  currentProjectId: string;
}>();

const cytoscapeComponentRef = ref(null);
const state = reactive({
  initGraph: false,
  nodeLabelVisible: false,
  nodeLabelExpand: false,
  relationLabelVisible: false,
  relationLabelExpand: false,
  graphData: { nodes: [], edges: [] },
  bluePrintId: "",
  chartData1: { xData: [], yData: [] },
  chartData2: { xData: [], yData: [] },
  nodeCount: 0,
  nodeAnnotationCount: 0,
  relationCount: 0,
  relationAnnotationCount: 0,
  visibleFlag: true,
});
const updateGrapgh = async () => {
  const res: any = await getGraphInfo(props.currentProjectId);

  if (res.data.nodeCount === 0) state.visibleFlag = false;
  state.nodeCount = res.data.nodeCount;
  state.nodeAnnotationCount = res.data.nodeAnnotationCount;
  state.relationCount = res.data.relationCount;
  state.relationAnnotationCount = res.data.relationAnnotationCount;
  res.data.schemaJson = JSON.parse(res.data.schema);
  state.graphData = handleEchartsData(res.data.schemaJson);

  for (const i in res.data.nodeTypeCount) {
    state.chartData1.xData.push(i);
    state.chartData1.yData.push(res.data.nodeTypeCount[i]);
  }
  for (const i in res.data.relationTypeCount) {
    state.chartData2.xData.push(i);
    state.chartData2.yData.push(res.data.relationTypeCount[i]);
  }
  state.initGraph = true;
  const expandDom1 = document.getElementsByClassName("graph-labelBox")[0];
  const expandDom2 = document.getElementsByClassName("graph-labelBox")[1];

  if (expandDom1 && expandDom1.scrollHeight > 33) state.nodeLabelVisible = true;
  if (expandDom2 && expandDom2.scrollHeight > 33) state.relationLabelExpand = true;
};
watch(
  () => props.currentProjectId,
  () => {
    updateGrapgh();
  },
);
onMounted(() => {
  updateGrapgh();
});

defineExpose({
  updateGrapgh,
});
</script>

<style lang="scss">
@import "src/styles/theme";
.relation_right {
  width: calc(100% - 376px);
  height: 100%;
}
</style>
