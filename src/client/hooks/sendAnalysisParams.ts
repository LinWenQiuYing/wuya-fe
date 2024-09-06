import { DataAnalysisParams } from "@/client/hooks/useDataAnalysis";
//import { useTagsHook } from "@/client/hooks/useTags";
import store from "@/store";
//import { KnowledgeSourceType } from "@/client/types";
import appendAuthHeader from "@/sign/appendAuthHeader";
import { Category } from "@/client/types/treeData";
//import { TreeNodeData } from "element-plus/es/components/tree/src/tree.type";

// // 获取当前选中文档类型
// export const isExcelFile = (checkId: string) => {
//   const treeRef = store.state.documentQA.knowledgeTree;
//   const checkNodes = treeRef?.getCheckedNodes();
//   const node: Record<string, string> | undefined = checkNodes?.find((node) => node.fileUuid === checkId);
//   const suffix = node?.name?.split(".")?.pop() ?? "";
//   return ["xlsx", "csv"].includes(suffix);
// };

// 数据分析获取所有选中的文档节点
export const getCheckedFile = (fileTypes: string[]) => {
  //知识源Ref
  const treeRef = store.state.documentQA.knowledgeTree;
  const checkNodes = treeRef?.getCheckedNodes();
  let hasOtherFileType = false;
  // 作为文件数据源传递给后端
  const files: string[] = [];
  checkNodes?.forEach((item) => {
    //文件后缀名
    const suffix = item?.name?.split(".")?.pop() as string;
    if (item.category === Category.file) {
      if (fileTypes.includes(suffix)) {
        files.push(item.fileUuid);
      } else {
        //如果不是fileTypes中的类型，进行标记一下
        if (!hasOtherFileType) hasOtherFileType = true;
      }
    } else if (!hasOtherFileType) {
      hasOtherFileType = !checkNodes?.find((node) => item.id == node.parentId);
    }
  });
  return { files, hasOtherFileType };
};

// export const dataAnalysisFiles = () => {
//   const { getCheckedDataSourceIds } = useTagsHook(store);
//   const files: Array<string> = [];
//   getCheckedDataSourceIds().forEach((item) => {
//     if (
//       item.doc_id &&
//       [KnowledgeSourceType.PERSONAL, KnowledgeSourceType.ENTERPRISE].includes(
//         item.kb_type as KnowledgeSourceType,
//       )
//     ) {
//       files.push(item.doc_id);
//     }
//   });
//   return files;
// };

const prefix = "/infinity/chat/data-analysis";

export default function sendAnalysisParams(params: DataAnalysisParams) {
  const { query, topic_id, regenerate, max_round, files } = params;
  return {
    url: prefix,
    params: {
      method: "POST",
      headers: appendAuthHeader({
        "Content-Type": "application/json",
      }),
      body: JSON.stringify({
        query,
        topic_id,
        regenerate,
        max_round,
        files,
      }),
    },
  };
}
