import store from "@/store";
import { ChatParams } from "@/client/types/api";
import appendAuthHeader from "@/sign/appendAuthHeader";
import { Category } from "@/client/types/treeData";
import { CheckIdState } from "@/store/modules/documentQA";

export default function sendFinancialReportParams(params: ChatParams) {
  const { query, topic_id, regenerate, max_round, sources } = params;
  return {
    url: "/infinity/chat/financial_analysis",
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
        sources,
      }),
    },
  };
}

export const fileTypes = ["xlsx", "csv", "pdf"];
// 获取所有选中的文档节点
export const getSourcesFile = (fileTypes: string[]) => {
  //知识源Ref
  const treeRef = store.state.documentQA.knowledgeTree;
  const checkNodes = treeRef?.getCheckedNodes();
  let hasOtherFileType = false;
  // 作为文件数据源传递给后端
  const sources: CheckIdState[] = [];
  if (checkNodes && checkNodes.length > 0)
    checkNodes.forEach((item) => {
      //文件后缀名
      const suffix = item?.name?.split(".")?.pop() as string;
      if (item.category === Category.file) {
        if (fileTypes.includes(suffix)) {
          sources.push({
            doc_id: <string>item.fileUuid,
            kb_type: <string>item.type,
          });
        } else {
          //如果不是fileTypes中的类型，进行标记一下
          if (!hasOtherFileType) hasOtherFileType = true;
        }
      } else if (!hasOtherFileType) {
        hasOtherFileType = !checkNodes?.find((node) => item.id == node.parentId);
      }
    });
  return { sources, hasOtherFileType };
};
