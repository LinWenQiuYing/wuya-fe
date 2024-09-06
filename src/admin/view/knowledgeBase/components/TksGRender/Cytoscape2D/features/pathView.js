export function showSinglePath(cy, activePath) {
  cy.startBatch();
  cy.elements().removeClass("path-node").removeClass("path-edge").addClass("emphsis");
  cy.elements()
    .nodes()
    .forEach((node) => {
      node.removeClass("path-node");
      if (activePath.includes(node.id())) {
        node.addClass("path-node").removeClass("emphsis");
        // 为edge添加path-edge
        node
          .neighborhood()
          .edges()
          .filter((edge) => {
            return (
              activePath.includes(edge.source().id()) &&
              activePath.includes(edge.target().id()) &&
              Math.abs(activePath.indexOf(edge.source().id()) - activePath.indexOf(edge.target().id())) <= 1
            ); // source和target在activePath中的位置差不超过1，才能保证该edge在activePath中
          })
          .removeClass("emphsis")
          .addClass("path-edge");
      } else {
        node.addClass("emphsis");
      }
    });
  cy.endBatch();
}

export function resetAllClass(cy) {
  cy.startBatch();
  cy.elements().removeClass("emphsis").removeClass("path-node").removeClass("path-edge");
  cy.endBatch();
}
