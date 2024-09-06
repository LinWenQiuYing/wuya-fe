<template>
  <div :id="`threeDom${props.whichComponent}`" ref="threeGraphRef" class="threeGraph"></div>
</template>

<script setup>
import ForceGraph3D from "3d-force-graph";
import { CSS2DRenderer, CSS2DObject } from "./lib/CSS2DRenderer";
import { ref, onMounted, nextTick, watch, reactive, inject } from "vue";
import md5 from "md5";
import colors from "./lib/colors";

const propsValue = defineProps({
  graphData: {
    type: Object,
    default: () => {
      return { nodes: [], edges: [] };
    },
  },
});
const props = {};
props.whichComponent = inject("whichComponentProps");
const emits = defineEmits(["nodeAndEdgeClick", "nodeDbclick"]);
const threeGraphRef = ref(null);
const state = reactive({
  types: [],
  typeColors: {},
});

const myGraph = ForceGraph3D({
  extraRenderers: [new CSS2DRenderer()],
});

const initSize = function () {
  myGraph.width(threeGraphRef.value.clientWidth);
  myGraph.height(threeGraphRef.value.clientHeight);
  window.addEventListener("resize", () => {
    myGraph.width(threeGraphRef.value.clientWidth);
    myGraph.height(threeGraphRef.value.clientHeight);
  });
};

const flyTo = (node) => {
  const distance = 40;
  const distRatio = 1 + distance / Math.hypot(node.x, node.y, node.z);

  const newPos =
    node.x || node.y || node.z
      ? { x: node.x * distRatio, y: node.y * distRatio, z: node.z * distRatio }
      : { x: 0, y: 0, z: distance }; // special case if node is in (0,0,0)

  myGraph.cameraPosition(
    newPos, // new position
    node, // lookAt ({ x, y, z })
    3000, // ms transition duration
  );
};

const highlightNodes = new Set();
const highlightLinks = new Set();
let currentNode = null;
const updateHightLight = function () {
  myGraph
    .nodeColor(myGraph.nodeColor())
    .linkWidth(myGraph.linkWidth())
    .linkDirectionalParticles(myGraph.linkDirectionalParticles());
};
const updateNodes = function (node) {
  if ((!node && !highlightNodes.size) || (node && currentNode === node)) return;
  highlightNodes.clear();
  highlightLinks.clear();
  if (node && node.neighbors) {
    highlightNodes.add(node);
    node.neighbors.forEach((neighbor) => highlightNodes.add(neighbor));
    node.links.forEach((link) => highlightLinks.add(link));
  }

  currentNode = node || null;
  updateHightLight();
};
const initGraph = function () {
  state.types = Array.from(
    new Set(propsValue.graphData.nodes.map((node) => "class" + md5(node.label || node.id))),
  );
  state.types.forEach((type, index) => {
    state.typeColors[type] = index;
  });
  const data = handleData({ nodes: propsValue.graphData.nodes, links: propsValue.graphData.edges });
  myGraph(threeGraphRef.value)
    .graphData(data)
    .nodeAutoColorBy("id")
    .nodeOpacity(0.9)
    .nodeResolution(16)
    .nodeColor((node, index) => {
      const type = "class" + md5(node.label || node.id);
      return highlightNodes.has(node)
        ? currentNode === node
          ? "rgba(255,0,0,1)"
          : "rgba(255,160,0,0.8)"
        : (state.typeColors && state.typeColors[type] && colors[state.typeColors[type]]) ||
            "rgba(0,255,255,1)";
    })
    .linkDirectionalParticles((link) => (highlightLinks.has(link) ? 2 : 0))
    .linkWidth((link) => (highlightLinks.has(link) ? 2 : 1))
    .linkColor("#fff")
    .linkOpacity(0.8)
    .linkDirectionalParticleWidth(2)
    .linkDirectionalParticleColor("#ff0000")
    .nodeThreeObject((node) => {
      const nodeEl = document.createElement("div");
      nodeEl.textContent = node.name;
      nodeEl.style.color = node.color;
      nodeEl.className = "threeGraph-node-label";
      return new CSS2DObject(nodeEl);
    })
    .linkThreeObject((link) => {
      const linkEl = document.createElement("div");
      linkEl.textContent = link.type;
      linkEl.style.color = "#fff";
      linkEl.className = "threeGraph-link-label";
      return new CSS2DObject(linkEl);
    })
    .linkPositionUpdate((link, { start, end }) => {
      // 更新关系上的文字坐标
      const middlePos = Object.assign(
        ...["x", "y", "z"].map((c) => ({
          [c]: start[c] + (end[c] - start[c]) / 2, // calc middle point
        })),
      );
      Object.assign(link.position, middlePos);
    })
    .nodeThreeObjectExtend(true)
    .linkThreeObjectExtend(true)
    .onNodeDragEnd((node) => {
      node.fx = node.x;
      node.fy = node.y;
      node.fz = node.z;
    })
    .onNodeRightClick((node) => {
      emits("nodeDbclick", node);
    })
    .onNodeClick((node, event) => {
      // flyTo(node)
      emits("nodeAndEdgeClick", [node]);
    })
    .onLinkClick((link) => {
      const nodes = [link.source, link.target];
      emits("nodeAndEdgeClick", nodes, {
        properties: link.properties,
        label: link.label,
      });
    })
    .onNodeHover((node) => {
      updateNodes(node);
    })
    .onLinkHover((link) => {
      highlightLinks.clear();
      highlightNodes.clear();
      if (link) {
        highlightLinks.add(link);
        highlightNodes.add(link.source);
        highlightNodes.add(link.target);
      }
      updateHightLight();
    })
    .d3Force("charge")
    .strength(-12);
};

function deepClone(obj) {
  let newObj;
  try {
    newObj = obj.push ? [] : {};
  } catch (error) {
    newObj = {};
  }
  for (let attr in obj) {
    if (typeof obj[attr] === "object") {
      newObj[attr] = deepClone(obj[attr]);
    } else {
      newObj[attr] = obj[attr];
    }
  }
  return newObj;
}

const handleData = function (dataSource) {
  const result = deepClone(dataSource);
  result.links.forEach((link) => {
    const a = result.nodes.find((node) => node.id === link.source);
    const b = result.nodes.find((node) => node.id === link.target);
    a && !a.neighbors && (a.neighbors = []);
    b && !b.neighbors && (b.neighbors = []);
    a.neighbors.push(b);
    b.neighbors.push(a);

    !a.links && (a.links = []);
    !b.links && (b.links = []);
    a.links.push(link);
    b.links.push(link);
  });
  return result;
};

watch(
  () => propsValue.graphData,
  function () {
    const data = handleData({ nodes: propsValue.graphData.nodes, links: propsValue.graphData.edges });
    myGraph.graphData(data);
  },
  {
    deep: true,
  },
);

onMounted(() => {
  nextTick(() => {
    // 3d图谱为全屏
    const targetDom = document.getElementsByClassName("threeGraph")[0];
    targetDom.style.width = document.body.clientWidth + "px";
    targetDom.style.height = document.body.clientHeight + 50 + "px";
    initSize();
    initGraph();
  });
});
</script>

<style scoped lang="scss">
@import "src/styles/theme";
.threeGraph {
  // width: 100%;
  // height: 100%;
  position: absolute;
  top: -50px;
  left: 0;
  z-index: 999;
}
</style>
<style lang="scss">
@import "src/styles/theme";
.threeGraph-node-label {
  font-size: 10px;
  color: #fff;
  padding: 1px 4px;
  border-radius: 4px;
  background-color: rgba(0, 0, 0, 0.3);
  user-select: none;
  max-width: 150px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.threeGraph-link-label {
  font-size: 8px;
  padding: 1px 4px;
  border-radius: 4px;
  background-color: rgba(0, 0, 0, 0.3);
  user-select: none;
}
</style>
