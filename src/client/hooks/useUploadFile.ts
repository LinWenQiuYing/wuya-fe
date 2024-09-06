import { ref } from "vue";
import { openPreview, uploadFile } from "@/client/api/documents";
import { useIsLoading } from "@/client/hooks/useIsLoading";

export function useOnUploadFile() {
  // 上传文件
  const onUploadFile = async (options) => {
    const formData = new FormData();
    formData.append("files", options.file);
    return uploadFile(formData);
  };
  return {
    onUploadFile,
  };
}

//获取文件预览url
export function useGetPDfUrl(): (doc_id: string) => Promise<string> {
  return async (doc_id: string) => {
    const pdfBurref = await openPreview(doc_id, {});
    const blob = new Blob([pdfBurref], { type: "application/pdf" });
    const url = window.URL.createObjectURL(blob);
    return `${url}#navpanes=0&page=${1}`;
  };
}

export default function useUploadFile() {
  const docId = ref<string>();
  const { onUploadFile } = useOnUploadFile();
  const getUrl = useGetPDfUrl();
  const [loading, setLoading] = useIsLoading();

  //上传
  const onUpload = async (options) => {
    setLoading(true);
    const result = await onUploadFile(options).catch((error) => {
      setLoading(false);
      return Promise.reject(error.data);
    });
    return result;
  };

  // 上传完成
  const fileParser = async (res, file) => {
    docId.value = res.data.doc_id;
    const url = await getUrl(res.data.doc_id).catch(() => setLoading(false));
    setLoading(false);
    return url;
  };

  return {
    docId,
    loading,
    onUpload,
    fileParser,
  };
}
