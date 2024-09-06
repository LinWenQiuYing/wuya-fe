<template>
  <el-upload
    v-show="false"
    :id="props.id"
    v-model:file-list="fileList"
    :accept="acceptableExtensions"
    :auto-upload="false"
    :class="$style.upload"
    :on-change="uploadChange"
    :show-file-list="false"
    action=""
    drag
    method="post"
    multiple
  >
    <div ref="uploadRef" />
  </el-upload>
  <div :class="$style.upload_btn" @click="getCanUpload">
    <slot />
  </div>
</template>

<script lang="ts" setup>
import { ElMessage, UploadFile } from "element-plus";
import { handleBefore } from "@/utils/restrictFile";
import { checkDocUploadAvailable } from "@/client/api";
import { ref } from "vue";
import { acceptableExtensions } from "@/store/upload";

const fileList = defineModel({
  required: true,
  default: [],
  type: Array<UploadFile>,
});

const emit = defineEmits<{
  submit: [UploadFile[]];
}>();
const props = defineProps<{
  readonly id: string;
}>();
const uploadRef = ref<HTMLDivElement>();

// 当选择多个文件时, 会调用uploadChange并依次传入文件
const uploadChange = (fileValue: UploadFile) => {
  if (fileValue.status === "ready") {
    if (handleBefore(fileValue)) {
      fileList.value.push(fileValue);
    } else {
      fileList.value = [];
    }
  }
  const upload = document.getElementById(props.id)!;
  const inputEle = upload.querySelector("input");
  if (!inputEle) return;
  const fileTotal = inputEle.files?.length;
  if (fileList.value.length === fileTotal) {
    // if (fileList.value.length > 5) {
    //   fileList.value = [];
    //   return ElMessage.error("最多只能上传五个文件");
    // }
    if (fileList.value.find((item) => item.name.length > 256)) {
      fileList.value = [];
      return ElMessage.error("请上传文件名256字以内的文件");
    }
    emit("submit", fileList.value);
  }
};

const getCanUpload = async () => {
  if (fileList.value.length) fileList.value = [];
  const isUpload = await checkDocUploadAvailable().catch(console.log);
  if (!isUpload) {
    ElMessage.warning("当前处于高峰时段，暂时无法上传文件，请稍后重试");
    return;
  }
  uploadRef.value?.click();
};
</script>

<style lang="scss" module>
.upload {
  :global {
    .el-upload-dragger {
      border: none;
      padding: 0;
      background: none;
      display: flex;
    }
  }
}
.upload_btn {
  display: flex;
  align-items: center;
}
</style>
