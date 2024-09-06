export default [
  {
    selector: "node",
    style: {
      label: "data(name)",
      "font-size": 12,
      "font-weight": "bold",
      "background-color": "#F6D2A8", //节点背景色
      "border-color": "rgba(233, 166, 89, 1)", //节点border
      color: "#666666", //节点文字
      "border-width": 2,
      "text-wrap": "ellipsis",
      "text-max-width": 200,
      "text-valign": "bottom",
      "text-margin-y": 3,
      padding: 3,
      width: 20,
      height: 20,
      "background-fit": "contain",
      "background-size": "80%",
      "background-position": "center",
    },
  },
  {
    selector: ".path-node", //高亮节点
    style: {
      // "border-color": "rgba(233, 166, 89, 1)",//节点被选中border
      "border-width": 4,
    },
  },
  {
    selector: "edge",
    style: {
      label: "data(label)",
      "curve-style": "bezier",
      "line-color": "#939393",
      "target-arrow-color": "#939393",
      color: "#939393",
      "text-background-color": "#939393",
      "text-border-color": "#939393",
      "line-style": "dashed",
      "line-dash-pattern": [3, 3],
      width: 1,
      "font-size": 12,
      "target-arrow-shape": "triangle",
      "target-arrow-fill": "fill",
      "arrow-scale": 0.5,
    },
  },
  {
    selector: ".path-node-ctx",
    style: {
      color: "#70A6F2",
    },
  },
  {
    selector: ".path-edge", //高亮关系
    style: {
      "line-color": "#70A6F2",
      "target-arrow-color": "#70A6F2",
      color: "#70A6F2",
      "text-background-color": "#70A6F2",
      "text-border-color": "#70A6F2",
    },
  },
  {
    selector: ".endpoint",
    style: {
      // "border-width": 0,
      // "border-color": "red",
      width: 40,
      height: 40,
    },
  },
  {
    selector: ".emphsis",
    style: {
      opacity: 0.2,
    },
  },
  {
    selector: ".opc",
    style: {
      opacity: 0.2,
    },
  },
  // {
  //     selector: "#0",
  //     style: {
  //         "border-width": 0,
  //         "background-image":
  //             "http://t14.baidu.com/it/u=2311018269,4134181727&fm=224&app=112&f=JPEG?w=298&h=310&s=7043FA1E100052EC60B3EBAE0300702A",
  //     },
  // },
];
