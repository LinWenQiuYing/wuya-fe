import store from "@/store";
import useTree from "@/client/hooks/useTree";
import { useTagsHook } from "@/client/hooks/useTags";
import { ElMessage } from "element-plus";

/**
 *
 * @param suffixes 需要校验后缀名
 * @param errorMessage 报错信息
 */
const verifyDoc = (suffixes: string[], errorMessage: string) => {
  const treeRef = store.state.documentQA.knowledgeTree;
  const { getCheckFileType } = useTree();
  if (!treeRef) return null;
  const { getCheckedDataSourceIds, getCheckKnowStr } = useTagsHook(store);
  const ids = getCheckedDataSourceIds();
  const sourceStr = getCheckKnowStr();

  // 只支持单个文档 不支持知识库或文件夹
  if (sourceStr.length || !ids.length || ids.length > 1) {
    ElMessage.error(errorMessage);
    return null;
  }

  // 只有单个且不是文本时，需要考虑知识库或文件夹下只有一个文件的情况
  if (!ids[0].doc_id) {
    const checkNodes = treeRef?.getCheckedNodes();
    const checkDocs = checkNodes.filter((item) => {
      const suffix = item?.name?.split(".")?.pop() as string;
      return item.fileUuid && suffixes.includes(suffix);
    });
    if (checkDocs.length !== 1) {
      ElMessage.error(errorMessage);
      return null;
    }
    return {
      doc_id: <string>checkDocs[0].fileUuid,
      kb_type: <string>checkDocs[0].type,
    };
  }

  if (!getCheckFileType(ids[0], suffixes)) {
    ElMessage.error(errorMessage);
    return null;
  }

  return ids[0];
};

export default verifyDoc;
