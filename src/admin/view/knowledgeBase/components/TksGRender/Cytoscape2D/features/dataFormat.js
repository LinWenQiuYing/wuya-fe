// import {Graph, GraphNode, GraphRelationship, RawData} from "./defs";
import md5 from "md5";
export function formatData(data, points = []) {
  const nodes = data.nodes.map((node) => {
    const labelEn = "class" + md5(node.label);
    return {
      data: {
        id: node.id + "",
        uuid: node.uuid + "",
        name: node.name,
        label: node.label,
        properties: node.properties || null,
        endpoint: points.includes(String(node.id)),
        rootId: node.rootId ? node.rootId : "",
        style: node.style || null,
        userId: node.userId,
      },
      classes: (points.includes(String(node.id)) ? ["endpoint"] : []).concat(labelEn).join(" "),
    };
  });
  const edges = data.edges.map((edge) => {
    return {
      data: {
        id: "edges" + edge.id,
        uuid: edge.uuid + "", // 数据库中原始id
        source: edge.source + "",
        target: edge.target + "",
        label: edge.label,
        rootId: edge.rootId ? edge.rootId : "",
        properties: {
          ...edge.properties,
        },
      },
    };
  });
  return { nodes, edges };
}
