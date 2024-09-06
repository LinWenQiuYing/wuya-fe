export default {
  // 宽度优先布局
  breadthfirst: {
    name: "breadthfirst",
    fit: true, // 调整视口位置适配当前节点
    directed: false, // 树是否向下（如果为false，边缘可以指向任何方向）
    padding: 0,
    circle: false, // 如果为true，则将深度置于同心圆中，如果为false则将深度置于顶部向下
    Ready: () => {}, // on layoutready
    Stop: () => {}, // 在layoutstop
  },
  // 网格布局
  grid: {
    name: "grid",
    fit: true, // 调整视口位置适配当前节点
    padding: 0,
    Ready: () => {}, // on layoutready
    Stop: () => {}, // 在layoutstop
  },
  // 同心布局
  concentric: {
    name: "concentric",
    fit: true, // 调整视口位置适配当前节点
    padding: 0,
    startAngle: (3 / 2) * Math.PI, // 节点以弧度开始
    clockwise: true, // 顺/逆时针
    width: undefined, // 可覆盖容器宽度
    height: undefined, // 可覆盖容器高度
    Ready: () => {}, // on layoutready
    Stop: () => {}, // 在layoutstop
  },
  // 圆圈布局
  circle: {
    name: "circle",
    fit: true, // 调整视口位置适配当前节点
    padding: 0,
    radius: undefined, // 圆的半径
    clockwise: true, // 顺/逆时针
    Ready: () => {}, // on layoutready
    Stop: () => {}, // 在layoutstop
  },
  // 力导布局
  "d3-force": {
    name: "d3-force",
    animate: true, // 是否在运行时显示布局，动画效果
    fixedAfterDragging: true, // 拖动后固定节点
    linkId: function id(d) {
      return d.id; // 将节点id访问器设置为指定的函数
    },
    maxSimulationTime: 100, // 运行布局的最大长度(毫秒)
    maxIterations: 1, // 在布局释放前的最大迭代次数
    linkDistance: 300, // 将距离访问器设置为指定的数字或函数
    manyBodyStrength: -600, // 将强度访问器设置为指定的数字或函数
    ready: function () {
      // on layoutready
      document.getElementById(`progress-box${whichComponent}`).style.display = "block";
    },
    stop: function () {
      // on layoutstop
      document.getElementById(`progress-box${whichComponent}`).style.display = "none";
      cyRef.center();
    },
    tick: function (progress) {
      // 每次迭代，定位选项
      let text = (progress * 100).toFixed(1) + "%";
      document.getElementById(`progress-text${whichComponent}`).innerHTML = `正在计算布局，请稍后 ${text}`;
      document.getElementById(`progress-bar${whichComponent}`).style.width = text;
    },
    randomize: false, // 在布局开始时使用随机节点位置
    infinite: true, // 无限布局
    fit: false,
  },
  // 重力分类布局
  fcose: {
    name: "fcose",
    quality: "default", // drafy频谱布局，proof（增量布局缓慢冷却速率）
    randomize: true, // 随机节点位置，如果设置为false，qulity必须为proof
    animate: true,
    animationDuration: 500,
    animationEasing: undefined,
    fit: true, // 调整视口位置适配当前节点
    // fit: false,
    // zoom: 1.5,
    // pan: { x: 500, y: 300 },
    padding: 0,
    nodeRepulsion: (node) => 45000, // 节点排斥(不重叠)乘数
    idealEdgeLength: (edge) => 150, // 理想边(非嵌套)长度
    edgeElasticity: (edge) => 0.45, // 计算边缘力的除数
    nestingFactor: 0.1, // 嵌套系数(乘数)计算嵌套边的理想长度
    numIter: 2500, // 执行的最大迭代数-这是一个建议值，可以根据需要由算法调整
    gravity: 0.25, // 重力(常数)
    gravityRangeCompound: 1.5, // 化合物的重力范围(常数)
    gravityCompound: 1.0, // 化合物的重力(常数)
    gravityRange: 3.8, // 重力范围(常量)
    initialEnergyOnIncremental: 0.3, // 增量布局的初始冷却因子
    Ready: () => {}, // on layoutready
    Stop: () => {}, // 在layoutstop
  },
  // 有向无环图树布局
  dagre: {
    name: "dagre",
    // dagre algo options, uses default value on undefined
    nodeSep: undefined, // the separation between adjacent nodes in the same rank
    edgeSep: undefined, // the separation between adjacent edges in the same rank
    rankSep: undefined, // the separation between each rank in the layout
    rankDir: undefined, // 'TB' for top to bottom flow, 'LR' for left to right,
    align: undefined, // alignment for rank nodes. Can be 'UL', 'UR', 'DL', or 'DR', where U = up, D = down, L = left, and R = right
    acyclicer: undefined, // If set to 'greedy', uses a greedy heuristic for finding a feedback arc set for a graph.
    // A feedback arc set is a set of edges that can be removed to make a graph acyclic.
    ranker: undefined, // Type of algorithm to assign a rank to each node in the input graph. Possible values: 'network-simplex', 'tight-tree' or 'longest-path'
    minLen: function (edge) {
      return 1;
    }, // number of ranks to keep between the source and target of the edge
    edgeWeight: function (edge) {
      return 1;
    }, // higher weight edges are generally made shorter and straighter than lower weight edges
    // general layout options
    fit: true, // whether to fit to viewport
    padding: 30, // fit padding
    spacingFactor: undefined, // Applies a multiplicative factor (>0) to expand or compress the overall area that the nodes take up
    nodeDimensionsIncludeLabels: false, // whether labels should be included in determining the space used by a node
    animate: false, // whether to transition the node positions
    animateFilter: function (node, i) {
      return true;
    }, // whether to animate specific nodes when animation is on; non-animated nodes immediately go to their final positions
    animationDuration: 500, // duration of animation in ms if enabled
    animationEasing: undefined, // easing of animation if enabled
    boundingBox: undefined, // constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
    transform: function (node, pos) {
      return pos;
    }, // a function that applies a transform to the final node position
    ready: function () {}, // on layoutready
    sort: undefined, // a sorting function to order the nodes and edges; e.g. function(a, b){ return a.data('weight') - b.data('weight') }
    // because cytoscape dagre creates a directed graph, and directed graphs use the node order as a tie breaker when
    // defining the topology of a graph, this sort function can help ensure the correct order of the nodes/edges.
    // this feature is most useful when adding and removing the same nodes and edges multiple times in a graph.
    stop: function () {}, // on layoutstop
  },
  // 随机布局
  random: {
    name: "random",
    fit: true, // 调整视口位置适配当前节点
    padding: 0,
    Ready: () => {}, // on layoutready
    Stop: () => {}, // 在layoutstop
  },
};
let whichComponent = 0,
  cyRef = null;
export const setWhichComponent = (which, cy) => {
  whichComponent = which;
  cyRef = cy;
};
