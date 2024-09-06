import { computed } from "vue";
import { KnowledgeSourceType } from "../types";
import { useTagsHook } from "./useTags";
import { findParentTree } from "../utils";
import Node from "element-plus/es/components/tree/src/model/node";
import store from "@/store";
import { FolderFileProp, TreeRootProp } from "@/client/types/treeData";
import useSourceUnavailable from "@/client/hooks/useSourceUnavailable";
import useSources from "@/client/hooks/useSources";
import { CheckIdState } from "@/store/modules/documentQA";

export type TreeNode = Node;

const useTree = () => {
  const tree = computed(() => store.state.documentQA.knowledgeTree);
  const selectSources = computed(() => store.state.documentQA.knowledgeSource);
  const rootData = computed(() => store.state.documentQA.treeRootData);
  const { setCheckedDataSourceIds } = useTagsHook(store);
  const sourceDisableFun = useSourceUnavailable();
  const sources = useSources();

  // 上传修改知识源时调用
  const checkNodes = () => {
    if (!tree.value) return;
    const checkKnowledge = sources.value;
    const uploadId = store.state.documentQA.docIds;
    const data = tree.value.getCheckedNodes();
    const checkIds: Array<string | number> = data.map((item: Record<string, string>) => item.id);
    if (checkKnowledge.includes(KnowledgeSourceType.PERSONAL)) {
      const idx = checkKnowledge.indexOf(KnowledgeSourceType.PERSONAL);
      checkIds.splice(idx, 1);
    }
    checkIds.push(...uploadId);
    store.commit("documentQA/SET_CHECK_DOC_ID", []);
    tree.value.setCheckedKeys(checkIds);
    if (uploadId.length) {
      setTimeout(() => {
        const data = tree.value!.getCheckedNodes();
        getHalfCheckNodes();
        uploadSourceIds(findParentTree(data));
      }, 500);
    }
  };

  const getPrivateTreeNode = (): TreeNode | null => {
    if (!tree.value || !rootData.value) return null;
    return tree.value.getNode(rootData.value.find((data) => data.type === KnowledgeSourceType.PERSONAL)!.id);
  };

  // 刷新个人知识库
  const refreshPerson = () => {
    const privateTree = getPrivateTreeNode();
    if (!privateTree) return;
    privateTree.loaded = false;
    privateTree.expand();
  };

  // 转化选中内容
  const uploadSourceIds = (checkNodes: Array<TreeRootProp | FolderFileProp>) => {
    const data: CheckIdState[] = checkNodes
      .filter(
        (node) =>
          ![KnowledgeSourceType.LAW, KnowledgeSourceType.INTERNET, KnowledgeSourceType.FINANCE].includes(
            node.type!,
          ),
      )
      .map((check) => {
        if (check.id === KnowledgeSourceType.ENTERPRISE && check.children) {
          return check.children.map((children) => ({
            kb_id: children.documentTreeId!.toString(),
            kb_type: check.type,
          }));
        } else if ((check as FolderFileProp).fileUuid) {
          return {
            doc_id: (check as FolderFileProp).fileUuid!.toString(),
            kb_type: check.type,
          };
        } else if (check.documentTreeId) {
          return {
            kb_id: check.documentTreeId.toString(),
            kb_type: check.type,
          };
        } else {
          return {
            dir_id: check.id.toString(),
            kb_type: check.type,
          };
        }
      })
      .flat();

    setCheckedDataSourceIds(data);
  };

  // 获取当前半选中的根节点
  const getHalfCheckNodes = () => {
    if (!tree.value) return;
    const halfCheck = tree.value.getHalfCheckedNodes();
    const roots = halfCheck.filter((node) => node.isRoot);
    let halfNames = roots.map((node) => node.name);
    if (selectSources.value.includes(KnowledgeSourceType.ALL)) {
      halfNames = []; // 选中了全部则没有半选
    }
    store.commit("documentQA/SET_HALF_ROOT", halfNames);
  };

  const clickCardSource = (source: KnowledgeSourceType[]) => {
    if (!tree.value || !rootData.value) return;
    let halfCheck = findParentTree(tree.value.getCheckedNodes()).filter((node) => !node.isRoot);

    // 个人知识库的特殊性 如果上一次全选了 当次没选 则去掉半选的个人知识库
    if (
      (selectSources.value.includes(KnowledgeSourceType.PERSONAL) ||
        selectSources.value.includes(KnowledgeSourceType.ALL)) &&
      !source.includes(KnowledgeSourceType.PERSONAL)
    ) {
      halfCheck = halfCheck.filter((node) => node.type !== KnowledgeSourceType.PERSONAL);
    }

    let ids: string[] = [];
    if (source.includes(KnowledgeSourceType.ALL)) {
      // 要通过默认语言不是中文的时候对财经数据源做过滤
      rootData.value.forEach((item) => {
        if (!sourceDisableFun(item.type as KnowledgeSourceType)) {
          ids.push(item.id);
        }
      });
    } else {
      const checks = rootData.value.filter((root) => source.includes(root.type));
      const checkIds = checks.map((check) => check.id);
      const halfIds = halfCheck.map((node: Record<string, string>) => node.id);
      ids = [...checkIds, ...halfIds];
    }
    store.commit("documentQA/SET_KNOWLEDGE_SOURCE", source);
    tree.value.setCheckedKeys(ids);
    setTimeout(() => {
      const data = tree.value!.getCheckedNodes();
      uploadSourceIds(findParentTree(data));
      getHalfCheckNodes();
    }, 100);
  };

  // 获取当前选中文档类型
  const getCheckFileType = (checkId: CheckIdState, suffixes: string[]) => {
    if (!tree.value) return false;
    if (!checkId.doc_id) return false;
    const checkNodes = tree.value.getCheckedNodes();
    const node: Record<string, string> | undefined = checkNodes.find(
      (node) => node.fileUuid === checkId.doc_id,
    );
    if (!node) return false;
    const suffix = node.name.split(".").pop()!;
    return suffixes.includes(suffix);
  };

  // 设置指定知识源 暂时仅支持财经 法律 互联网
  const setAssignSource = (source: KnowledgeSourceType[]) => {
    if (!tree.value) return;
    tree.value.setCheckedKeys(source);
    store.commit("documentQA/SET_KNOWLEDGE_SOURCE", source);
    const data = tree.value.getCheckedNodes();
    uploadSourceIds(findParentTree(data));
    getHalfCheckNodes();
  };

  // 是否有选择数据源
  const isCheckSource = () => {
    if (!tree.value) return false;
    return tree.value.getCheckedNodes().length;
  };

  return {
    checkNodes,
    refreshPerson,
    uploadSourceIds,
    getHalfCheckNodes,
    getPrivateTreeNode,
    clickCardSource,
    setAssignSource,
    getCheckFileType,
    isCheckSource,
  };
};

export default useTree;
