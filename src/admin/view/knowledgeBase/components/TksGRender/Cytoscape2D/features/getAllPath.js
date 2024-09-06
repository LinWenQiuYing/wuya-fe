export function getAllPath(cy, sourceId, targetId) {
  const stack = [],
    ans = [];
  const dfs = (node) => {
    if (node.id() === targetId) {
      ans.push(stack.slice());
      return;
    }
    for (let i = 0; i < node.neighborhood().nodes().length; i++) {
      if (stack.indexOf(node.neighborhood().nodes()[i].id()) > -1) {
        continue;
      }
      stack.push(node.neighborhood().nodes()[i].id());
      dfs(node.neighborhood().nodes()[i]);
      stack.pop();
    }
  };
  stack.push(sourceId);
  dfs(cy.getElementById(sourceId));
  return ans;
}

export function getAllInfoPathsHandler(cy, idPaths = []) {
  if (!cy) {
    return [];
  }
  return idPaths.map((idPath) => {
    return idPath.map((id) => {
      return cy.getElementById(id).data();
    });
  });
}
