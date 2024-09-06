<template>
  <el-upload
    id="admin-uploads"
    :accept="acceptableExtensions"
    :auto-upload="false"
    :file-list="fileList"
    :multiple="true"
    :on-change="handleChange"
    :show-file-list="false"
  >
    <el-button :disabled="disabled" type="primary" :loading="loadIng">导入文档</el-button>
  </el-upload>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { ElMessage, UploadFile, UploadRawFile } from "element-plus";
import { uploadFiles } from "@/client/api/knowSource";
import useRequestLoading from "@/hooks/useRequestLoading";
import { acceptableExtensions } from "@/store/upload";

const fileList = ref<UploadFile[]>([]);
const props = defineProps<{
  currentProjectId: number;
  disabled: boolean;
}>();
const emit = defineEmits(["update-list"]);

const handleChange = (file: UploadFile) => {
  file.status == "ready" && fileList.value.push(file);
  const upload = document.getElementById("admin-uploads")!;
  const fileTotal = upload.querySelector("input")!.files!.length;
  if (fileList.value.length === fileTotal) {
    submit();
  }
};

const [uploadFn, loadIng] = useRequestLoading(uploadFiles);
// 上传文件
const submit = () => {
  const formData = new FormData();
  fileList.value.forEach((file) => {
    formData.append("files", file.raw as UploadRawFile);
  });
  formData.append("id", props.currentProjectId + "");
  const id = props.currentProjectId;
  uploadFn(formData)
    .then(() => {
      emit("update-list", id);
    })
    .catch(() => {
      ElMessage.error("上传失败");
    });
  fileList.value = [];
};
</script>
