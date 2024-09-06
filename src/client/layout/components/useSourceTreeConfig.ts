import type { TreeNodeData } from "element-plus/es/components/tree/src/tree.type";
import { Category } from "@/client/types/treeData";
import { StatusNumber } from "@/admin/view/knowledgeBase/const";
import { KnowledgeSourceType } from "@/client/types";
import useSourceUnavailable from "@/client/hooks/useSourceUnavailable";

const useSourceTreeConfig = () => {
  const sourceDisableFun = useSourceUnavailable();

  const disableFun = (data: TreeNodeData, readonly?: boolean) => {
    if (readonly) return true;
    if (sourceDisableFun(data.type as KnowledgeSourceType)) {
      return true;
    }
    if (data?.category !== Category.file) return false;
    return data.fileStatus !== StatusNumber.saved;
  };
  return {
    disableFun,
  };
};

export default useSourceTreeConfig;
