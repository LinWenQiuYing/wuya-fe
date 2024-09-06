<template>
  <div :class="[isMobile ? $style.h5 : $style.pc, $style._]">
    <div :class="$style.source_title">知识源</div>
    <el-input
      v-model="searchValue"
      :class="$style.search_input"
      placeholder="搜索文档"
      :suffix-icon="Search"
      @input="filterTree"
    />
    <el-tree
      ref="treeRef"
      :class="$style.source_tree"
      empty-text=""
      :props="treeProps"
      :data="treeData"
      :show-checkbox="true"
      :load="loadNodeFn"
      :lazy="true"
      node-key="id"
      :highlight-current="true"
      :expand-on-click-node="false"
      :filter-node-method="filterNode"
      @check="nodeClickFn"
      @node-click="clickNode"
    >
      <template #default="{ node, data }">
        <node-tooltip :node="node" :is-readonly="props.isReadonly">
          <div
            :class="[
              $style.tree_label,
              {
                [$style.disabled_cursor]: props.isReadonly,
                [$style.no_name_label]: !node.label,
              },
            ]"
          >
            <div v-if="node.label" :class="[$style.label_wrapper, props.isReadonly && $style.readonly]">
              <template v-if="data.temp">
                <div :class="$style.title">
                  <el-icon
                    v-if="data.progress === 100"
                    :class="$style.resolvingTips"
                    class="is-loading"
                    title="解析中"
                  >
                    <Loading />
                  </el-icon>
                  <span>{{ node.label }}</span>
                  <el-progress
                    :class="$style.progress"
                    :percentage="data.progress"
                    :show-text="false"
                    :stroke-width="2"
                    striped
                    striped-flow
                  />
                </div>
              </template>
              <template v-else>
                <span :class="[$style.title, { [$style.is_know]: node.level === 1 }]" :title="node.label"
                  >{{ node.label }}
                </span>
                <span v-if="data.category === Category.file" :class="$style.file_status">
                  <el-tooltip :content="DocUploadStatus.get(data.fileStatus)" placement="top">
                    <component
                      :is="getUploadStatusIcon(data.fileStatus)[0]"
                      :class="[$style.status_icon, getUploadStatusIcon(data.fileStatus)[1]]"
                    />
                  </el-tooltip>
                </span>
                <span v-if="data.category === Category.folder" :class="$style.file_status">
                  <CurriedUpload
                    style="margin-right: 5px"
                    :class="$style.upload"
                    @change="(files: File[]) => batchUpload(files, data)"
                  />
                </span>

                <!--操作icon-->
                <div v-if="!isAnonymous" @click.stop>
                  <el-popover
                    v-if="data.isPrivate && node.label"
                    :popper-class="$style.popover"
                    placement="right"
                    trigger="click"
                    width="60"
                  >
                    <template #default>
                      <div :class="$style.folder_btn_item_warp">
                        <span :class="$style.folder_btn_item" @click="onClickMove(data)"> 移动 </span>
                        <span :class="$style.folder_btn_item" @click="onClickDelete(data)"> 删除 </span>
                      </div>
                    </template>
                    <template #reference>
                      <span :class="$style.fake_icon_more"> </span>
                    </template>
                  </el-popover>
                </div>
              </template>

              <!-- 个人知识库icon -->
              <div v-if="!isAnonymous && data.isCreate" style="display: flex; align-items: center">
                <CurriedUpload :class="$style.upload" @change="(files: File[]) => batchUpload(files, data)" />
                <div style="display: flex">
                  <FolderPlusIcon :class="$style.add_folder" title="新建文件夹" @click="createFolder(data)" />
                </div>
              </div>
            </div>

            <!--文件夹命名-->
            <el-input
              v-else
              ref="inputRef"
              v-model="inputValue"
              :class="$style.folder_name_input"
              @keyup.enter="(e: KeyboardEvent) => handleKeyEnter(e, () => (<HTMLElement>e.target).blur())"
              @blur="handleName(node, data)"
            ></el-input>
          </div>
        </node-tooltip>
      </template>
    </el-tree>
    <el-dialog v-model="deleteVisible" align-center title="删除" append-to-body width="400px">
      <div style="display: flex">
        <WarningFilled style="height: 20px" />
        <span style="padding-left: 5px; line-height: 22px">确定删除该文件或文件夹吗</span>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="onDeleteCancel">取消</el-button>
          <el-button type="primary" :loading="dleIng" @click="onDeleteOk">确认</el-button>
        </div>
      </template>
    </el-dialog>
    <!-- 移动文件或文件夹 -->
    <MoveDialog
      v-if="moveVisible"
      :current-node="{
        repositoryId: currentNode!.repositoryId,
        id: currentNode!.id,
        parentId: currentNode!.parentId,
      }"
      @close-dialog="onMoveOk"
    />
  </div>
</template>

<script setup lang="ts">
import { nextTick, onMounted, ref, watch } from "vue";
import { Loading, Search, WarningFilled } from "@element-plus/icons-vue";
import store from "@/store";
import useTree from "@/client/hooks/useTree";
import { defaultSourceTrees, getFirstDir, uploadFiles } from "@/client/api/knowSource";
import { createKnowRootNode, findParentTree } from "@/client/utils";
import { ElInput, ElLoading, ElMessage, ElTree } from "element-plus";
import { KnowledgeSourceType } from "@/client/types";
import { TreeRootKeys, treeTagKey } from "@/client/const";
import { addFolder, batchProgress, deleteCondition, getMoreDirByUpId } from "@/api/knowledgeRequst";
import Node from "element-plus/es/components/tree/src/model/node";
import { Category, FolderFileProp, TreeRootProp } from "@/client/types/treeData";
import { TreeNodeData } from "element-plus/es/components/tree/src/tree.type";
import { DocUploadStatus, StatusNumber } from "@/admin/view/knowledgeBase/const";
import { getUploadStatusIcon } from "@/utils/getUploadStatusIcon";
import FolderPlusIcon from "@/client/icons/folder-plus.svg";
import MoveDialog from "@/components/MoveDialog.vue";
import useDrawer from "@/client/hooks/useDrawer";
import usePdfPreview from "@/store/hooks/usePdfPreview";
import usePdfUrl from "@/client/hooks/usePdfUrl";
import useRequestLoading from "@/hooks/useRequestLoading";
import useDefaultSources from "@/client/views/settings/useDefaultSources";
import { AxiosError, AxiosProgressEvent } from "axios";
import CurriedUpload from "@/client/components/CurriedUpload.vue";
import { UploadFileParams } from "@/client/types/api";
import convertVideoIfExist from "@/client/utils/convertVideoIfExist";
import { isMobile } from "@/config";
import useSourceTreeConfig from "./useSourceTreeConfig";
import NodeTooltip from "./NodeTooltip.vue";
import useCheckDefaultSource from "./useCheckDefaultSource";
import useCheckSource from "@/client/layout/components/useCheckSource";
import { isAnonymous } from "@/store/hooks/useUserInfo";
import useDefaultAgentSource from "@/client/layout/useDefaultAgentSource";
import handleKeyEnter from "@/client/utils/handleKeyEnter";

const props = defineProps<{
  readonly isReadonly: boolean;
}>();

const { checkNodes, uploadSourceIds, getHalfCheckNodes } = useTree();
const searchValue = ref<string>();
const treeRef = ref<InstanceType<typeof ElTree>>();
const treeData = ref<TreeRootProp[]>([]);
const inputRef = ref<InstanceType<typeof ElInput>>();
const inputValue = ref<string>("");
const deleteVisible = ref<boolean>(false);
const moveVisible = ref<boolean>(false);
const currentNode = ref<FolderFileProp>();
const clickNodeData = ref<FolderFileProp>();
const getPdfUrl = usePdfUrl();
const { open } = useDrawer();
const { pdfUrl, pdfLoading } = usePdfPreview();
const { disableFun } = useSourceTreeConfig();
const checkDefaultSource = useCheckDefaultSource();
useCheckSource(treeRef);

type TaskStatus = "uploading" | "success" | "fail" | "abort";
type UploadTask = {
  file: File;
  progress: number;
  hash: string;
  status: TaskStatus;
  abortController: AbortController;
};
// 上传任务列表
const uploadTasks = ref<UploadTask[]>([]);

const treeProps = {
  id: "id",
  label: "name",
  isLeaf: "isLeaf",
  children: "children",
  disabled: (data: TreeNodeData) => disableFun(data, props.isReadonly),
};

// 输入的过程中, 根据输入的关键字过滤知识源
const filterTree = (keyword: string) => {
  const tree = treeRef.value;
  if (!tree) return;
  tree.filter(keyword);
};

// 勾选的知识源 放入缓存区，便于后续问答需要
const nodeClickFn = () => {
  const checkArr = findParentTree(treeRef.value!.getCheckedNodes());
  const source = Array.from(new Set(checkArr.filter((node) => node.isRoot).map((node) => node.type)));
  store.commit("documentQA/SET_KNOWLEDGE_SOURCE", source);
  uploadSourceIds(checkArr);
  getHalfCheckNodes();
};

// 筛选
const filterNode = (value: string, data: TreeNodeData): boolean => {
  if (!value) return true;
  return data.name.indexOf(value) !== -1;
};

const formatNodeData = (nodeData: FolderFileProp, parentNodeData: FolderFileProp): FolderFileProp => {
  const data = {
    ...nodeData,
    isLeaf: nodeData.category === Category.file,
    repositoryId: parentNodeData.repositoryId || parentNodeData.id,
    type: parentNodeData.type,
  };
  if (parentNodeData.isCreate || parentNodeData.isPrivate) data.isPrivate = true;
  return data;
};

// 加载子树的数据
const loadChildren = async (nodeData: FolderFileProp) => {
  const res = await getMoreDirByUpId(nodeData.id);
  const data = (<FolderFileProp[]>res.data.children).map((child) => formatNodeData(child, nodeData));
  data.sort((a: FolderFileProp, b: FolderFileProp) => {
    const dateA = new Date(a.createTime);
    const dateB = new Date(b.createTime);
    return dateB.getTime() - dateA.getTime();
  });
  return data;
};

const loadNodeFn = async (node: Node, resolve: (data: FolderFileProp[]) => void) => {
  if (node.level === 0) return;
  if (node.level === 1 && node.data.children) {
    resolve(node.data.children);
  } else {
    resolve(await loadChildren(<FolderFileProp>node.data));
  }
};

// 加载顶层知识源列表
const loadRootNode = async () => {
  const res = await getFirstDir().catch(console.error);
  // 游客模式下该接口无数据
  const anonymous = res === null;
  const dirs = res ?? defaultSourceTrees;
  const treeTags = <[TreeRootKeys, KnowledgeSourceType][]>Object.entries(treeTagKey);
  const rootTree = treeTags.map(([key, value]) => createKnowRootNode(dirs[key], value, key, anonymous));
  treeData.value = rootTree;
  changeDefaultCheckedKeys();
  // 游客模式下默认选择财经和互联网
  if (anonymous) {
    const sourceId = [KnowledgeSourceType.INTERNET, KnowledgeSourceType.FINANCE];
    store.commit("documentQA/SET_KNOWLEDGE_SOURCE", sourceId);
    treeRef.value!.setCheckedKeys(sourceId);
  }
  //知识库第一层的数据需要在相关引用里面做匹配
  store.commit("chat/SET_SOURCES", dirs);
  store.commit("documentQA/SET_KNOWLEDGE_TREE", treeRef.value);
  store.commit("documentQA/SET_KNOWLEDGE_ROOT_DATA", rootTree);
};

// 创建文件夹
const createFolder = async (data: TreeNodeData) => {
  if (!treeRef.value) return;
  const isCreate =
    (data.isRoot && data.type === KnowledgeSourceType.PERSONAL) ||
    (data.category === Category.folder && data.isPrivate);
  if (isCreate) {
    const node = treeRef.value.getNode(data);
    const folder = {
      name: "",
      parentId: data.id,
      isLeaf: false,
      category: Category.folder,
      id: +new Date(),
      isPrivate: true,
      repositoryId: node.data.repositoryId || node.data.id,
    };
    if (!node.expanded) {
      node.loaded = false;
      node.expand(() => {
        nextTick(() => {
          const allData = node.childNodes.map((node) => node.data);
          node.data.children = [folder, ...allData];
          nextTick(() => {
            if (inputRef.value) inputRef.value.focus();
          });
        });
      });
    } else {
      const allData = node.childNodes.map((node) => node.data);
      node.data.children = [folder, ...allData];
      await nextTick();
      if (inputRef.value) inputRef.value.focus();
    }
  }
};

const onClickMove = (data: FolderFileProp) => {
  currentNode.value = data;
  moveVisible.value = true;
};

const dleNode = async (currentData: FolderFileProp) => {
  if (!treeRef.value) return;
  // treeRef.value.remove(currentData);
  const parentNode = treeRef.value.getNode(currentData.parentId);
  parentNode.removeChildByData(currentData);
  parentNode.data.children = [];
  await nextTick();
  parentNode.updateLeafState();
};

const onMoveOk = async (val: boolean, targetId: number) => {
  moveVisible.value = false;
  if (!treeRef.value || !currentNode.value) return;
  if (val) {
    await dleNode(currentNode.value);
    const targetNode = treeRef.value.getNode(targetId);
    if (targetNode) {
      currentNode.value.parentId = targetId;
      treeRef.value.append(currentNode.value, targetId);
    }
  }
};

const onClickDelete = (data: FolderFileProp) => {
  currentNode.value = data;
  deleteVisible.value = true;
};

const onDeleteCancel = () => {
  deleteVisible.value = false;
};

const [dleFn, dleIng] = useRequestLoading(deleteCondition);

const onDeleteOk = async () => {
  const target = currentNode.value;
  if (!treeRef.value || !target) return;
  const params =
    target.category === Category.folder
      ? {
          dirId: target.id,
        }
      : {
          docId: target.fileUuid!,
        };
  await dleFn(params).catch(console.error);

  await dleNode(target);

  ElMessage.success("操作成功");
  deleteVisible.value = false;
};

// 文件夹命名
const handleName = async (node: Node, data: FolderFileProp) => {
  if (!treeRef.value) return;
  if (inputValue.value.trim()) {
    const res = await addFolder({
      parentId: data.parentId,
      name: inputValue.value,
    }).catch(() => {
      treeRef.value!.remove(node);
    });
    if (!res) return;
    const parentData = node.parent.childNodes.map((node) => {
      if (node.data.id === data.id) {
        return {
          ...node.data,
          id: res.data.id,
          name: inputValue.value,
        };
      }
      return node.data;
    });
    treeRef.value.updateKeyChildren(data.parentId, parentData);
    ElMessage.success("操作成功");
    inputValue.value = "";
  } else {
    treeRef.value.remove(node);
  }
};

const clickNode = async (data: FolderFileProp) => {
  if (props.isReadonly) return;
  clickNodeData.value = data;
  const [, fileStatus] = getUploadStatusIcon(data.fileStatus as StatusNumber);
  if (data.isLeaf && data.category === Category.file) {
    if (fileStatus !== "success") {
      return ElMessage.info("文件上传成功后才支持预览");
    }
    if (isMobile) {
      const loadingInstance = ElLoading.service();
      const url = await getPdfUrl(data.fileUuid!).catch(loadingInstance.close);
      if (url) pdfUrl.value = url;
      await nextTick();
      open("pdf");
      loadingInstance.close();
    } else {
      open("pdf");
      pdfLoading.value = true;
      const url = await getPdfUrl(data.fileUuid!).catch(() => {
        pdfLoading.value = false;
      });
      if (url) pdfUrl.value = url;
      pdfLoading.value = false;
    }
  }
};

const getPrivateNode = (id?: number): Node | null => {
  const tree = treeRef.value;
  if (!tree) return null;
  if (!id) return <Node | null>tree.root.childNodes[0];
  return tree.getNode(id);
};

type UploadNode = {
  category: Category;
  name: string;
  isPrivate: boolean;
  isLeaf: boolean;
  temp: boolean;
  hash: string;
  progress: number;
};

// 初始化上传任务节点
const initUploadTaskNodes = async (hashArray: string[], data: FolderFileProp) => {
  const privateNode = getPrivateNode(data.id);
  if (!privateNode) return;
  const { loaded } = privateNode;
  const currentBatchTasks = uploadTasks.value.filter((task) => hashArray.includes(task.hash));
  const nodeDataArray: UploadNode[] = currentBatchTasks.map((task) => ({
    category: Category.file,
    name: task.file.name,
    isPrivate: true,
    isLeaf: true,
    isDisabled: true,
    temp: true,
    hash: task.hash,
    progress: 0,
  }));
  privateNode.expand();
  // // loaded 状态是插入上传节点前的状态
  if (!loaded) {
    privateNode.loading = true;
    const children = await loadChildren(<FolderFileProp>privateNode.data);
    privateNode.setData({
      ...privateNode.data,
      children,
    });
    privateNode.loading = false;
  }
  privateNode.expand();
  nodeDataArray.forEach((data, index) => privateNode.insertChild({ data }, index));
  // privateNode.expand();
};

// 替换tree中上传任务对应的node
const replaceUploadTaskNode = (hash: string, nodeData: UploadFileParams, data: FolderFileProp) => {
  const privateNode = getPrivateNode(data.id);
  if (!privateNode) return;
  const taskNode = privateNode.childNodes.find((node) => node.data.hash === hash);
  if (!taskNode) return;
  taskNode.setData({
    ...nodeData,
    category: Category.file,
    parentId: privateNode.data.id,
    repositoryId: privateNode.data.repositoryId || privateNode.data.id,
    isPrivate: true,
    isLeaf: true,
    type: KnowledgeSourceType.PERSONAL,
  });
  if (nodeData.fileStatus !== StatusNumber.saved) return;
  taskNode.checked = true;
  taskNode.reInitChecked();
};

const getFileHash = (file: File): string => {
  return `${file.name}:{size:${file.size},lastModified:${file.lastModified}}:date:${new Date()}`;
};

// 更新某个上传任务的上传进度
// 上传任务通过文件hash映射
const updateTaskUploadProgress = async (hash: string, progress: number, FolderId: number) => {
  const relativeTask = uploadTasks.value.find((task) => task.hash === hash);
  if (!relativeTask) return;
  relativeTask.progress = progress;
  uploadTasks.value = [...uploadTasks.value];
  const privateNode = getPrivateNode(FolderId);
  if (!privateNode) return;
  const relativeNode = privateNode.childNodes.find((node) => node.data.hash === hash);
  if (!relativeNode) return;
  relativeNode.setData({
    ...relativeNode.data,
    progress: Math.ceil(progress * 100),
  });
};

// 上传接口报错，直接删除当前任务
const deleteTask = (hash: string, folderId: number) => {
  const privateNode = getPrivateNode(folderId);
  if (!privateNode) return;
  const relativeNode = privateNode.childNodes.find((node) => node.data.hash === hash);
  if (!relativeNode) return;
  privateNode.removeChildByData(relativeNode.data);
  privateNode.data.children = [];
  nextTick().catch(console.error);
  privateNode.updateLeafState();
};

// 更新上传任务的状态
const updateTaskStatus = (hash: string, status: Exclude<TaskStatus, "uploading">) => {
  if (status === "success") {
    uploadTasks.value = uploadTasks.value.filter((task) => task.hash !== hash);
  } else {
    const relativeTask = uploadTasks.value.find((task) => task.hash === hash);
    if (!relativeTask) return;
    relativeTask.status = status;
    uploadTasks.value = [...uploadTasks.value];
  }
};

// 清理上传任务
const cleanUploadTask = (hash: string) => {
  uploadTasks.value = uploadTasks.value.filter((task) => task.hash !== hash);
};

// 新增上传任务
const addUploadTask = async (file: File, hash: string, FolderId: number) => {
  const formData = new FormData();
  const abortController = new AbortController();
  const signal = abortController.signal;
  const reportTaskAbort = () => updateTaskStatus(hash, "abort");
  signal.addEventListener("abort", reportTaskAbort);
  const onUploadProgress = (event: AxiosProgressEvent) => {
    const progress = event.progress;
    if (!progress) return;
    updateTaskUploadProgress(hash, progress, FolderId);
  };
  uploadTasks.value.push({
    file,
    hash,
    status: "uploading",
    progress: 0,
    abortController,
  });
  const videoContext = await convertVideoIfExist(file).catch(console.error);
  formData.append("files", videoContext || file);
  //formData.append("files", file);
  formData.append("id", FolderId + "");
  return await uploadFiles(formData, { onUploadProgress, signal }).finally(() => {
    signal.removeEventListener("abort", reportTaskAbort);
  });
};

// 上传文档
const batchUpload = async (files: File[], data: FolderFileProp) => {
  const promises: Promise<void>[] = [];
  const hashArray: string[] = [];
  store.commit("documentQA/SET_CHECK_DOC_ID", []);
  for (const file of files) {
    const hash = getFileHash(file);
    hashArray.push(hash);
    const promise = addUploadTask(file, hash, data.id)
      .then(batchProgress)
      .then((task) => {
        const nodeData = task.data.documents[0];
        const taskStatus: TaskStatus = nodeData.fileStatus === StatusNumber.saved ? "success" : "fail";
        updateTaskStatus(hash, taskStatus);
        replaceUploadTaskNode(hash, nodeData, data);
        // checkPrivateSources();
        if (taskStatus === "success") {
          ElMessage.success(`${nodeData.name}上传成功`);
          store.commit("documentQA/SET_CHECK_DOC_ID", [...store.state.documentQA.docIds, nodeData.id]);
          checkNodes();
        } else {
          ElMessage.error(`${nodeData.name}上传失败`);
        }
      })
      .catch(() => {
        deleteTask(hash, data.id);
      })
      .finally(() => {
        cleanUploadTask(hash);
      });
    promises.push(promise);
  }
  Promise.all(promises).catch(console.error);
  await initUploadTaskNodes(hashArray, data);
};

// 选中个人知识源
// const checkPrivateSources = () => {
//   const includePrivateSources = checkKnowledge.value.some((know) => know === KnowledgeSourceType.PERSONAL);
//   if (!includePrivateSources) {
//     // store.commit("documentQA/SET_KNOWLEDGE_SOURCE", [...checkKnowledge.value, KnowledgeSourceType.PERSONAL]);
//   }
// };

const changeDefaultCheckedKeys = () => {
  if (!treeRef.value) return;

  const sources = checkDefaultSource();
  let checkKeys = sources.map((key) => {
    const currentNode = treeData.value.find((tree) => tree.type === key);
    return currentNode!.id;
  });
  treeRef.value.setCheckedKeys(checkKeys);
  uploadSourceIds(treeData.value.filter((item) => checkKeys.includes(item.id)));
  getHalfCheckNodes();
};

watch(inputRef, (val: HTMLInputElement) => {
  if (val) {
    val.focus();
  }
});

watch([useDefaultSources(), useDefaultAgentSource()], changeDefaultCheckedKeys);

onMounted(async () => {
  await loadRootNode().catch(console.error);
});
</script>

<style lang="scss" module>
@use "src/styles/theme";
@use "src/styles/mixins";

._ {
  :global {
    .el-input__wrapper {
      border-radius: 20px;
    }

    .el-tree {
      background-color: transparent;
      --el-tree-node-hover-bg-color: rgba(221, 223, 227, 0.5);
    }

    .el-tree-node__label {
      width: 120px;
      color: theme.$text-color-primary;
      white-space: nowrap; /* 禁止换行 */
      overflow: hidden; /* 隐藏超出部分 */
      text-overflow: ellipsis;
    }

    .el-tree-node__content {
      display: flex;
      align-items: center;
      height: auto;
    }

    .folder-name-input .el-input__inner {
      border-radius: 0;
    }

    .success {
      fill: theme.$green_color;
    }
  }
}

.source_title {
  font-size: theme.$padding-md;
  color: theme.$text-color-primary;
  line-height: 22px;
  font-weight: 700;
}

.search_input {
  margin-top: theme.$margin-sm;
  border-radius: 15px;
  box-shadow: none;
}

.source_tree {
  --el-color-primary-light-9: #e2e4e9;
  --el-tree-node-hover-bg-color: rgba(221, 223, 227, 0.5);
  --el-color-primary: #306bec;
  --el-tree-node-content-height: 30px;
  padding: theme.$padding-sm 0;
  max-height: calc(100% - 60px);
  overflow: auto;

  &::-webkit-scrollbar {
    height: 10px;
  }
}

.is_know {
  font-weight: bold;
  color: #2d364d;
}

.folder_name_input {
  :global {
    .el-input__wrapper {
      border-radius: 4px;
    }
  }
}

.tree_label {
  --label-height: 30px;
  width: 100%;
  height: var(--label-height);
  line-height: var(--label-height);
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
  color: theme.$text-color-primary;

  .label_wrapper {
    flex: 1;
    width: 100%;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .folder_icon {
    width: 20px;
    margin: 0 3px;
    color: #2d364d;
  }

  .add_folder {
    width: 20px;
    line-height: 30px;
    fill: #2d364d;
    margin: 0 3px;

    &:hover {
      fill: theme.$color-primary;
    }
  }

  .title {
    flex: 1;
    width: 100%;
    height: 30px;
    line-height: 30px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    position: relative;
  }

  .file_status {
    flex: 0 0 26px;
    width: 100%;
    height: 30px;
    line-height: 30px;
    display: flex;
    align-items: center;
  }
}

.tree_label.no_name_label {
  --label-height: 34px;
  height: var(--label-height);
  line-height: var(--label-height);
  margin: 5px 0;
}

.status_icon {
  width: 16px;
  height: 16px;
}

.tree_title {
  margin-top: theme.$margin-md;
  font-size: theme.$font-size-base;
  color: theme.$text-color-secondary;
  line-height: 22px;
  font-weight: 400;
}

.fake_icon_more {
  &::after {
    content: "...";
    display: inline-block;
    transform: rotate(90deg);
    font-size: 16px;
  }
}

.folder_btn_item_warp {
  display: flex;
  flex-direction: column;
}

.folder_btn_item {
  display: block;
  padding: 5px 0;
  text-align: center;
  cursor: pointer;

  &:hover {
    color: theme.$color-primary;
  }
}

.popover {
  --el-popover-padding: 4px;
  display: flex;
  justify-content: center;
}

.upload {
  width: 24px;
  height: 24px;
}

.progress {
  position: absolute;
  bottom: 3px;
  left: 0;
  z-index: 1;
  width: 100%;
  user-select: none;
  --el-border-color-lighter: var(--el-tree-node-hover-bg-color);
}

.title:hover .progress {
  --el-border-color-lighter: transparent;
}

.resolvingTips {
  margin-right: 3px;
}

.h5 {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: flex-start;
  overflow: hidden;
  height: 100%;

  .source_title {
    display: none;
  }

  .source_tree {
    flex: 1;
  }
}

.readonly {
  pointer-events: none;
}

.disabled_cursor {
  cursor: not-allowed;
}
</style>
