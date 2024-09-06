// 转化为树结构
import { OrganizationProp } from "@/admin/types/api";
import { OrganizationTree } from "@/admin/types";

export const selectOrgTree = (data: OrganizationProp, res: OrganizationTree[] = []) => {
  const tree: OrganizationTree = { ...data.organ, permissionIds: data.permissionIds };
  if (data.organTrees?.length) {
    tree.children = data.organTrees.map((d) => selectOrgTree(d)).flat();
  }
  res.push(tree);
  return res;
};

export const getTargetTree = (data: OrganizationTree[], targetId: number): OrganizationTree | undefined => {
  for (let d of data) {
    if (d.id === targetId) {
      return d;
    } else {
      if (d.children) {
        const target = getTargetTree(d.children, targetId);
        if (target) {
          return target;
        }
      }
    }
  }
};
