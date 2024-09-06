//当前节点的一度关系
import { resetAllClass } from "./pathView";

// hideClass 是否隐藏其他节点或关系
export function getRelationPath(nodes, cy, hideClass, edge) {
  resetAllClass(cy);
  cy.elements().style("border-width", 2);
  if (nodes.length) {
    cy.startBatch();
    if (hideClass) {
      cy.elements().removeClass("path-node").removeClass("path-edge").addClass("emphsis");
    } else {
      cy.elements().removeClass("path-node").removeClass("path-edge");
    }
    if (edge) {
      edge.source().addClass("path-node").removeClass("emphsis");
      edge.target().addClass("path-node").removeClass("emphsis");
      edge.addClass("path-edge").removeClass("emphsis");
    } else {
      const node = cy.elements().find((item) => item.data().id == nodes[0]);
      node.style("border-width", 3);
      node.addClass("path-node").removeClass("emphsis");
      node
        .neighborhood()
        .edges()
        .forEach((edge) => {
          if (edge.target().id() === node.id()) {
            edge.source().addClass("path-node").removeClass("emphsis");
          } else {
            edge.target().addClass("path-node").removeClass("emphsis");
          }
          edge.addClass("path-edge").removeClass("emphsis");
        });
    }
    cy.endBatch();
  }
}
