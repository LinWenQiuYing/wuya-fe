import { UploadFile } from "element-plus/es/components/upload/src/upload";
import { ElMessage } from "element-plus";

export const handleBefore = (file: UploadFile) => {
  const maxSize = 200 * 1024 * 1024; // 限制文件最大为200mb
  if (file.size > maxSize) {
    ElMessage({
      message: "请上传200MB以内的文件",
      type: "warning",
    });
    return false;
  }
  return true;
};
