import parseByteNotation from "./parseByteNotation";
import { singleFileMaxBytes, filenameMaxLength } from "@/store/upload";

const fileSizeLimit = parseByteNotation(singleFileMaxBytes);
export default function isCloudAcceptableFile(file: File) {
  if (file.size > fileSizeLimit) {
    return `请上传${singleFileMaxBytes}以内的文件`;
  }
  if (file.name.length > filenameMaxLength) {
    return `请上传文件名${filenameMaxLength}字以内的文件`;
  }
  return true;
}

export function isFileTypeValid(file: File, acceptableExtensions: string | Array<string>) {
  if (typeof acceptableExtensions === "string") {
    acceptableExtensions = acceptableExtensions.split(",").map((item) => item.trim());
  }
  const fileName = (file.name || "").toLowerCase();
  const dotPos = fileName.lastIndexOf(".");
  const extension = dotPos >= 0 ? fileName.slice(dotPos) : "";
  return acceptableExtensions.indexOf(extension) >= 0;
}
