<template>
  <div>
    <el-table
      :data="docTable"
      empty-text=""
      :header-cell-style="{
        backgroundColor: '#f0f3fa',
      }"
      border
      row-key="id"
      default-expand-all
    >
      <el-table-column prop="name" label="文档名称" show-overflow-tooltip />
      <el-table-column prop="fileStatus" label="状态" width="120px">
        <template #default="{ row }">
          <component
            :is="getUploadStatusIcon(row.fileStatus, true)[0]"
            class="status-icon"
            :class="getUploadStatusIcon(row.fileStatus, true)[1]"
          />
          {{
            DocUploadStatus.get(
              [StatusNumber.parse_success, StatusNumber.edited].includes(row.fileStatus)
                ? StatusNumber.saved
                : row.fileStatus,
            )
          }}
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="上传时间" />
      <el-table-column label="进度" prop="fileParsePercent">
        <template #default="{ row }: { row: UploadFileParams }">
          <span v-if="[StatusNumber.parse_success, StatusNumber.edited].includes(row.fileStatus)">
            解析完成
          </span>

          <Loading v-else :size="20" :text="row.fileParsePercent + '%'" />
        </template>
      </el-table-column>
      <el-table-column prop="options" label="操作" width="80px">
        <template #default="{ row }">
          <el-link
            :disabled="row.fileStatus <= 6"
            :underline="false"
            type="primary"
            @click="() => editSlice(row)"
            >编辑
          </el-link>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog v-model="visible" width="80%" class="edit_dialog">
      <div v-if="!splitContent.length" class="loading-warp">
        <Loading :size="30" />
      </div>

      <EditSliceDoc v-else :fileUrl="fileUrl" :splitContent="splitContent" @handle-content="handleContent" />
      <template #footer>
        <div>
          <el-button @click="visible = false">取消</el-button>
          <el-button :disabled="!splitContent.length" type="primary" @click="saveSplit">
            保存解析结果
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { DocUploadStatus, StatusNumber } from "../const";
import EditSliceDoc from "./EditSliceDoc.vue";
import store from "@/store";
import { uploadFilesResProp } from "@/admin/types";
import { editSplit, getPdfPreview, saveUpdateSplit, splitDocuments } from "@/admin/api/knowledge";
import { batchProgress } from "@/api/knowledgeRequst";
import { getUploadStatusIcon } from "@/utils/getUploadStatusIcon";
import { UploadFileParams } from "@/client/types/api";
import { DocSplit } from "@/admin/types/api";
import Loading from "@/components/Loading.vue";

const visible = ref(false);

const docTable = ref<UploadFileParams[]>([]);
const fileUrl = ref<string>();
const uploadFiles = computed<uploadFilesResProp[]>(() => store.state.knowledge.uploadFilesRes);
const taskId = computed<number>(() => store.state.knowledge.taskId);
const splitContent = ref<DocSplit[]>([]);
const fileUUid = ref<string>();

const editSlice = async (file: uploadFilesResProp) => {
  if (splitContent.value.length) splitContent.value = [];
  visible.value = true;
  const res = await editSplit(file.fileUuid);
  await getPdfUrl(file.fileUuid);
  splitContent.value = res.data;
  fileUUid.value = file.fileUuid;
};

const startSplit = async () => {
  const splitParams = uploadFiles.value.map((file) => ({
    document_parser: "",
    doc_id: file.fileUuid,
  }));
  splitDocuments(splitParams);
  getDocsTableList();
};

const getPdfUrl = async (id: string) => {
  const data = await getPdfPreview(id);
  const blob = new Blob([data.file], { type: "application/pdf" });
  const url = window.URL.createObjectURL(blob);
  fileUrl.value = `${url}#navpanes=0&page=${1}`;
};

const getDocsTableList = async () => {
  const res = await batchProgress(taskId.value);
  const documentData = res.data.documents;
  docTable.value = documentData;
  const isUploading = documentData.some((doc) => doc.fileStatus < 6);
  if (isUploading) {
    setTimeout(() => {
      getDocsTableList();
    }, 3000);
  }
};

const handleContent = (data: DocSplit[]) => {
  splitContent.value = data;
};

const saveSplit = async () => {
  const res = await saveUpdateSplit({
    fileUuid: fileUUid.value,
    chunkList: splitContent.value,
  });
  getDocsTableList();
  visible.value = false;
};

watch(
  taskId,
  (val) => {
    if (val) {
      startSplit();
    }
  },
  {
    immediate: true,
  },
);

defineExpose({
  isParser: () => docTable.value.every((doc) => doc.fileStatus > 5),
});
</script>

<style scoped lang="scss">
@import "src/styles/theme";

.base_input {
  border: 1px solid rgba(214, 218, 230, 1);
  border-radius: $border-radius-md;
}

.split-server {
  display: flex;
  width: 100%;

  .parser-btn {
    width: 80px;
    margin-left: 10px;
  }
}

.status-icon {
  width: 16px;
  height: 16px;
  vertical-align: text-bottom;
}

.success {
  fill: $green_color;
}

.loading-warp {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>

<style scoped>
:deep(.base_input .el-input__inner) {
  border-radius: 0;
}

:deep(.edit_dialog .el-dialog__body) {
  height: 70vh;
}
</style>
