// import { bluePrint } from '/@/api/index';
// import { deepClone } from '/@/utils/deepClone';
import md5 from "md5";
/**
 * @params params nodeData为点击当前节点数据，ctxData 右键菜单的数据
 * @params which 更新那一项数据
 */
// export const getMoreDataFn = async (params, bluePrintId, graphData) => {
//   let tempData = {
//     prevData: {
//       nodes: [],
//       edges: []
//     },
//     graphData: {
//       nodes: [],
//       edges: []
//     },
//     isDbclickhandle: false
//   };
//   const rootId = params.nodeData.rootId;
//   let currentData = deepClone(graphData);
//   tempData.prevData = deepClone(currentData);
//   const currentNodeIndex = currentData.nodes.findIndex(
//     n => n.id === params.nodeData.id
//   );
//   const currentEdgeIndex = currentData.edges.findIndex(
//     e => e.rootId === rootId
//   );
//   if (currentData.nodes[currentNodeIndex].isExpand) {
//     currentData.nodes[currentNodeIndex].isExpand = false;
//     // 存储不等于rootId的项
//     const nodeArr = currentData.nodes.filter(node => {
//       return node.rootId.search(rootId) !== 0;
//     });
//     const edgeArr = currentData.edges.filter(edge => {
//       return edge.rootId.search(rootId) !== 0;
//     });
//     // 返回新数据
//     if (currentNodeIndex !== -1) {
//       currentData.nodes = [...nodeArr, currentData.nodes[currentNodeIndex]];
//     } else {
//       currentData.nodes = [...nodeArr];
//     }
//     if (currentEdgeIndex !== -1) {
//       currentData.edges = [...edgeArr, currentData.edges[currentEdgeIndex]];
//     } else {
//       currentData.edges = [...edgeArr];
//     }
//     tempData.graphData = currentData;
//     // 右键 -- 和下面else 处理一样
//     if (params.isCtxClick) {
//       currentData.nodes[currentNodeIndex].isExpand = true;
//       let res = null;
//       if (params.ctxData) {
//         // 右键的数据直接处理
//         res = params.ctxData;
//       } else {
//         const dataParams = {
//           id: params.nodeData.uuid,
//           label: params.nodeData.label,
//           userId: params.nodeData.userId || ""
//         };
//         res = await bluePrint.getMoreData(bluePrintId, dataParams);
//         if (!res.nodes.length) return;
//       }
//       const nodes = res.nodes.map((item, index) => {
//         if (currentData.nodes.find($item => $item.id === item.id)) return null;
//         return {
//           ...item,
//           id: md5(item.id),
//           uuid: item.id, //备份一份id
//           name: item.properties.name || item.properties.label,
//           rootId: `${rootId}${index + 1}000`
//         };
//       });
//       const edges = res.relationships.map((item, index) => {
//         if (currentData.edges.find($item => $item.id === item.id)) return null;
//         return {
//           ...item,
//           source: md5(item.start),
//           target: md5(item.end),
//           rootId: `${rootId}${index + 1}000`
//         };
//       });
//       currentData.nodes = currentData.nodes.concat(
//         nodes.filter(item => !!item)
//       );
//       currentData.edges = currentData.edges.concat(
//         edges.filter(item => !!item)
//       );
//       tempData.graphData = currentData;
//     }
//   } else {
//     currentData.nodes[currentNodeIndex].isExpand = true;
//     let dataParams;
//     if (params.isCtxClick) {
//       // 右键的数据直接处理
//       dataParams = params.dataParams;
//     } else {
//       dataParams = {
//         id: params.nodeData.uuid,
//         label: params.nodeData.label,
//         userId: params.nodeData.userId || ""
//       };
//     }
//     let res = await bluePrint.getMoreData(bluePrintId, dataParams);
//     if (!res.nodes.length) {
//       ElMessage({
//         message: "没有发现其余数据",
//         type: "warning"
//       });
//     }
//     const nodes = res.nodes.map((item, index) => {
//       if (currentData.nodes.find($item => $item.uuid === item.id)) return null;
//       return {
//         ...item,
//         id: md5(item.id),
//         uuid: item.id, //备份一份id
//         name: item.properties.name || item.properties.label,
//         rootId: `${rootId}${index + 1}000`
//       };
//     });
//     const edges = res.relationships.map((item, index) => {
//       if (currentData.edges.find($item => $item.id === item.id)) return null;
//       return {
//         ...item,
//         source: md5(item.start),
//         target: md5(item.end),
//         rootId: `${rootId}${index + 1}000`
//       };
//     });
//     currentData.nodes = currentData.nodes.concat(nodes.filter(item => !!item));
//     currentData.edges = currentData.edges.concat(edges.filter(item => !!item));
//     tempData.graphData = currentData;
//   }
//   tempData.isDbclickhandle = true;
//   return tempData;
// };

export const handleEchartsData = (data) => {
  if (!data.nodes || data.edges) {
    return data;
  }
  data.nodes = data.nodes.map((item, index) => ({
    ...item,
    id: md5(item.id),
    uuid: item.id, //备份一份id
    name: item.property[0].name || item.property[0].label,
    rootId: `${index + 1}000`,
    isExpand: false,
    properties: item.property[0],
  }));
  data.edges = data.relations.map((item, index) => ({
    ...item,
    source: md5(item.startNode),
    target: md5(item.endNode),
    rootId: `${index + 1}000`,
  }));
  return data;
};
