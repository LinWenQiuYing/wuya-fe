<template>
  <div class="list-header">
    <div class="header-left">
      <el-space>
        <UploadFileBtn
          :disabled="isFilter"
          :current-project-id="getUploadIdAndFn()[0] as number"
          @update-list="getUploadIdAndFn()[1]"
        />
        <el-button @click="addColumnFolder" :disabled="isFilter"> 新建文件夹</el-button>
        <!--        <el-button @click="addColumnFolder"> 移动</el-button>-->
        <!--        <el-button @click="addColumnFolder"> 删除</el-button>-->
      </el-space>
    </div>
    <div class="header-right">
      <el-input v-model="search" :suffix-icon="Search" class="input" placeholder="请输入关键词" />
    </div>
  </div>
  <DocTable
    v-if="tableData"
    :loadNode="loadNode"
    :table-data="isFilter ? typeData : tableData"
    :is-update="updateTable"
    v-model:current-row="currentRow"
    v-model:is-filter="isFilter"
    v-model:expend-keys="expandKeys"
    @update:is-filter="changeData"
    :load-map="loadMap"
    :search-value="search"
  >
    <template #btnName="btnName">
      <el-space>
        <el-link v-if="!isFilter" :underline="false" type="primary" @click="onClickMove(btnName.data)"
          >移动
        </el-link>
        <el-link
          v-if="btnName.data.category === 2"
          :underline="false"
          type="primary"
          @click="onPreview(btnName.data)"
          >预览
        </el-link>
        <el-link
          v-if="btnName.data.category === 2"
          :disabled="btnName.data.fileStatus < 6"
          :underline="false"
          type="primary"
          @click="editDocSplit(btnName.data)"
          >编辑
        </el-link>
        <el-popconfirm
          v-if="!isFilter"
          cancel-button-text="取消"
          confirm-button-text="确定"
          title="确定删除吗?"
          @confirm="delFolderOrFile(btnName.data)"
        >
          <template #reference>
            <el-link :underline="false" type="primary">删除</el-link>
          </template>
        </el-popconfirm>
      </el-space>
    </template>
  </DocTable>

  <!-- 查看切片 -->
  <el-dialog v-model="splitVisible" destroy-on-close width="80%" @close="closeSplit">
    <EditSliceDoc
      :fileUrl="fileUrl"
      :splitContent="splitContent"
      style="height: 600px"
      @handle-content="handleSplit"
    />
    <template #footer>
      <div>
        <el-button @click="splitVisible = false">取消</el-button>
        <el-button :loading="isLoading" type="primary" @click="saveSplit"> 保存解析结果</el-button>
      </div>
    </template>
  </el-dialog>
  <!-- 解析 -->
  <el-dialog v-model="parserVisible" :close-on-click-modal="false" destroy-on-close>
    <div class="parser-split">
      <div class="title">切片服务</div>
      <el-select v-model="parseType" class="base_input" style="flex: 1" placeholder="请输入">
        <el-option v-for="(item, index) in parserTypes" :key="index" :label="item.name" :value="item.key" />
      </el-select>
    </div>

    <template #footer>
      <el-button @click="closeParse()">取消</el-button>
      <el-button :loading="isLoading" type="primary" @click="startParser()"> 发起解析</el-button>
    </template>
  </el-dialog>
  <!-- 移动 -->
  <MoveDialog
    v-if="moveVisible"
    :current-node="{
      repositoryId: currentMove!.repositoryId,
      id: currentMove!.id,
      parentId: currentMove!.parentId,
    }"
    @close-dialog="onMoveOk"
  />

  <!-- 预览 -->
  <el-dialog v-model="previewFile" @close="closePreview">
    <iframe ref="iframeRef" :src="fileUrl" style="width: 100%; height: 70vh"></iframe>
  </el-dialog>
</template>

<script lang="ts" setup>
import {
  createKnow,
  editSplit,
  getFileListType,
  saveUpdateSplit,
  splitDocuments,
} from "@/admin/api/knowledge";
import { TypeFileOrFolderState } from "@/admin/types";
import { Search } from "@element-plus/icons-vue";
import { onBeforeUnmount, onMounted, ref } from "vue";
import DocTable from "./components/DocTable.vue";
import EditSliceDoc from "./components/EditSliceDoc.vue";
import { tableFiltertype } from "./const";
import { ElMessage, TreeNode } from "element-plus";
import useGetFileType from "./hooks/useGetFileType";
import { deleteCondition, getMoreDirByUpId } from "@/api/knowledgeRequst";
import { DocSplit, TypeListParams } from "@/admin/types/api";
import useDocSection from "@/admin/hooks/useDocSection";
import MoveDialog from "@/components/MoveDialog.vue";
import UploadFileBtn from "./components/UploadFile.vue";
import axios, { CancelTokenSource } from "axios";
import { TableLazyFolderOrFile } from "@/api/type";
import { getUploadStatusIcon } from "@/utils/getUploadStatusIcon";
import getKeyData from "@/admin/utils/getKeyData";

const search = ref<string>("");
const props = defineProps<{
  currentProjectId: number;
}>();
const tableData = ref<TableLazyFolderOrFile[]>();
const typeData = ref<TypeFileOrFolderState[]>([]);
const splitVisible = ref<boolean>(false);
const fileUrl = ref<string>("");
const splitContent = ref<DocSplit[]>([]);
const { parserTypes } = useGetFileType();
const parserVisible = ref<boolean>(false);
const parseType = ref<string>("GeneralPDFParser");
const parserData = ref();
const isLoading = ref<boolean>(false);
const { getPdfUrl } = useDocSection();
const currentMove = ref<TableLazyFolderOrFile>();
const moveVisible = ref<boolean>(false);
const updateTable = ref<boolean>(false);
const previewFile = ref<boolean>(false);
const currentRow = ref<TableLazyFolderOrFile>();
const isFilter = ref<boolean>(false);
const expandKeys = ref<string[]>([]);
const loadMap = new Map();
const timeId = ref<number[]>([]);
let cancel: CancelTokenSource | null;
let timer: number;

const addColumnFolder = () => {
  const row = currentRow.value;
  const folderObj: TableLazyFolderOrFile = {
    id: +new Date(),
    name: "",
    createTime: new Date(),
    creator: null,
    fileBusinessType: null,
    fileContentType: null,
    fileMd5: null,
    fileSize: null,
    fileStatus: null,
    fileSuffix: null,
    fileUploadTaskId: null,
    fileUuid: null,
    updateTime: new Date(),
    category: 1,
    hasChildren: true,
    children: [],
    parentId: row?.id || props.currentProjectId,
    repositoryId: row?.repositoryId || props.currentProjectId,
  };
  // 未选中时增加在第一级
  if (!row) {
    tableData.value!.unshift(folderObj);
  } else {
    if (row.category === 1 && expandKeys.value.includes(row.id + "")) {
      const rowData = getKeyData(tableData.value!, "id", row.id);
      if (!rowData) return;
      rowData.children = rowData.children || [];
      rowData.children.unshift(folderObj);
    }
  }
};

const getFolderChildrenAndFiles = async (id: number) => {
  const res = await getMoreDirByUpId(id);
  const data = res.data.children.map((d) => ({
    ...d,
    hasChildren: d.category === 1,
    repositoryId: res.data.repositoryId,
  }));
  const files = data.filter((d) => d.category === 2);
  return [data, files];
};

// updateFile 只更新文件
const getTreeData = async (id: number, updateFile?: boolean) => {
  const [data, files] = await getFolderChildrenAndFiles(id);
  if (updateFile) {
    const folders = tableData.value!.filter((d) => d.category === 1);
    tableData.value = [...folders, ...files];
  } else {
    tableData.value = data;
  }

  getUploadIngFiles(files, id);
};

const resolveUpdate = async (id: number) => {
  if (loadMap.has(id)) {
    const { row, node, resolve } = loadMap.get(id);
    await loadNode(row, node, resolve);
  } else {
    await getTreeData(props.currentProjectId, true);
  }
};

const getUploadIngFiles = (files: TableLazyFolderOrFile[], id: number) => {
  const isUpload = files.some((file) => {
    const [_, status] = getUploadStatusIcon(file.fileStatus!, true);
    return status === "processing";
  });

  if (isUpload) timeId.value.push(id);
  if (!timer && timeId.value.length) getFileStatus(timeId.value[0]);
};

const getFileStatus = async (id: number) => {
  const res = await getMoreDirByUpId(id).catch(console.log);
  if (!res) {
    timeId.value = timeId.value.filter((tid) => tid !== id);
    if (timeId.value.length > 0) {
      timer = window.setTimeout(() => {
        getFileStatus(timeId.value[0]);
      });
    }
    return;
  }
  const data = res.data.children.map((d) => ({
    ...d,
    hasChildren: d.category === 1,
    repositoryId: res.data.repositoryId,
  }));
  const item = getKeyData(tableData.value!, "id", id);
  const files = data.filter((d) => d.category === 2);
  let targetData = item ? item.children : tableData.value;
  const folders = targetData!.filter((d) => d.category === 1);
  targetData = [...folders, ...files];
  if (item) {
    item.children = targetData;
  } else {
    tableData.value = targetData;
  }
  const isUpload = files.some((file) => {
    const [_, status] = getUploadStatusIcon(file.fileStatus!, true);
    return status === "processing";
  });

  if (isUpload) {
    timer = window.setTimeout(() => {
      getFileStatus(id);
    }, 3000);
  } else {
    clearTimeout(timer);
    timer = 0;
    timeId.value = timeId.value.filter((tid) => tid !== id);
    if (timeId.value.length > 0) {
      timer = window.setTimeout(() => {
        getFileStatus(timeId.value[0]);
      });
    }
  }
};

// 查看切片
const catDocSplit = (data: TableLazyFolderOrFile) => {
  editSlice(data.fileUuid!).catch(() => (isLoading.value = false));
};

// updateChildren 是否更新子级
const loadNode = async (
  row: TableLazyFolderOrFile,
  node: TreeNode,
  resolve: (data: TableLazyFolderOrFile[]) => void,
  updateChildren: boolean = true,
) => {
  if (!loadMap.has(row.id)) loadMap.set(row.id, { node, resolve, row });
  const [data, files] = await getFolderChildrenAndFiles(row.id);
  resolve(data);
  if (updateChildren) {
    const current = getKeyData(tableData.value!, "id", row.id);
    current!.children = data;
  }
  getUploadIngFiles(files, row.id);
};

const editSlice = async (uuid: string) => {
  const res = await editSplit(uuid);
  fileUrl.value = await getPdfUrl(uuid);
  splitContent.value = res.data;
  splitVisible.value = true;
  isLoading.value = false;
};

// 根据类型分类的列表
const getTypeList = (data: TypeListParams) => {
  typeData.value = tableFiltertype.map((item, i) => ({
    id: i,
    name: item.label,
    noDel: true,
    category: 1,
    type: item.value,
    fileStatus: null,
    children: item.value.map((key) => data[key as keyof TypeListParams]).flat(),
  }));
};

// 开始解析
const startParser = async () => {
  try {
    isLoading.value = true;
    cancel = axios.CancelToken.source();
    await splitDocuments(
      [
        {
          doc_id: parserData.value.fileUuid,
          document_parser: parseType.value!,
        },
      ],
      cancel,
    );
    parserVisible.value = false;

    catDocSplit(parserData.value);
  } catch (e) {
    ElMessage({
      type: "error",
      message: "解析失败",
    });
    isLoading.value = false;
  }
};

// 编辑切片
const editDocSplit = async (data: TableLazyFolderOrFile) => {
  parserVisible.value = true;
  parserData.value = data;
};

const handleDelData = (data: TableLazyFolderOrFile) => {
  const target = getKeyData(tableData.value!, "id", data.parentId);
  const children = target ? target.children : tableData.value;
  if (!children) return;
  const idx = children.findIndex((d) => d.id === data.id);
  children.splice(idx, 1);
  tableData.value = [...tableData.value!];
  const files = children.filter((d) => d.category === 2);
  getUploadIngFiles(files, data.parentId);
};

// 删除文件夹或文档
const delFolderOrFile = async (data: TableLazyFolderOrFile) => {
  const params =
    data.category === 1
      ? {
          dirId: data.id,
        }
      : {
          docId: data.fileUuid!,
        };
  await deleteCondition(params).then(() => {
    clearTimeout(timer);
    timer = 0;
    if (timeId.value.includes(data.parentId)) {
      timeId.value = timeId.value.filter((tid) => tid !== data.parentId);
    }
    handleDelData(data);
  });
};

const onClickMove = async (data: TableLazyFolderOrFile) => {
  currentMove.value = data;
  moveVisible.value = true;
};

const onPreview = async (data: TableLazyFolderOrFile) => {
  fileUrl.value = await getPdfUrl(data.fileUuid!);
  previewFile.value = true;
};

const onMoveOk = async (val: boolean, targetId: number) => {
  moveVisible.value = false;
  const current = currentMove.value;
  if (!current) return;
  if (val) {
    clearTimeout(timer);
    timer = 0;
    if (timeId.value.includes(current.parentId)) {
      timeId.value = timeId.value.filter((tid) => tid !== current.parentId);
    }
    handleDelData(current);
    const targetData = getKeyData(tableData.value!, "id", targetId);
    currentMove.value!.parentId = targetId;
    if (targetData) {
      targetData.children?.push(current);
    } else {
      if (targetId === props.currentProjectId) tableData.value!.push(current);
    }
  }
};

const saveSplit = async () => {
  try {
    isLoading.value = true;
    await saveUpdateSplit({
      fileUuid: parserData.value.fileUuid,
      chunkList: splitContent.value,
    });
    await createKnow({
      id: parserData.value.id,
    });
    isLoading.value = false;
    splitVisible.value = false;
  } catch (e) {
    ElMessage({
      type: "error",
      message: "保存失败",
    });
    isLoading.value = false;
  }
};

const closeSplit = async () => {
  await changeData(isFilter.value);
  fileUrl.value = "";
};

const closePreview = () => {
  fileUrl.value = "";
};

const handleSplit = (data: DocSplit[]) => {
  splitContent.value = data;
};

const closeParse = () => {
  parserVisible.value = false;
  if (cancel) {
    cancel.cancel();
    cancel = null;
  }
};

const getUploadIdAndFn = () => {
  const id = currentRow.value?.category === 1 ? currentRow.value.id : props.currentProjectId;
  const updateFn = (targetId: number) => {
    resolveUpdate(targetId);
  };

  return [id, updateFn];
};

const changeData = async (val: boolean) => {
  if (val) {
    const typeList = await getFileListType(props.currentProjectId!);
    getTypeList(typeList.data);
  } else {
    await getTreeData(props.currentProjectId);
  }
};

onMounted(async () => {
  await getTreeData(props.currentProjectId);
});

onBeforeUnmount(() => {
  clearTimeout(timer);
});
</script>

<style scoped lang="scss">
@import "../../../styles/theme";

.list-header {
  padding: 10px 0;
  display: flex;
  justify-content: space-between;
}

.upload_text {
  font-size: 14px;
  color: #6d7587;
  margin-bottom: 5px;
}

.header-left {
  display: flex;
}

.parser-split {
  display: flex;
  margin: 20px;

  .title {
    margin-right: 10px;
    width: 70px;
    line-height: 32px;
  }
}
</style>
