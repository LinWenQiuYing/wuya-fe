import { post } from "src/utils/reqMethod";
import { service, uploadService } from "@/utils/request";
import { KnowledgeData } from "@/client/types/api";
import { documentsPrefix } from "@/utils/reqPrefix";
import { AxiosRequestConfig } from "axios";

// (访客模式下)备选的知识源配置
// 访客模式下, 后端不再给知识源
export const defaultSourceTrees: KnowledgeData = {
  financeTree: [],
  internetTree: [],
  lawTree: [],
  privateTree: [],
  publicTree: [],
};

// 获取所有知识源的名称列表
export const getFirstDir = async (): Promise<KnowledgeData | null> => {
  const result = await post<KnowledgeData | null>(`${documentsPrefix}/list-user-trees`);
  return result.data;
};

type TaskID = number;
export const uploadFiles = async (formData: FormData, config?: AxiosRequestConfig): Promise<TaskID> => {
  const res = await uploadService.post<TaskID>(`${documentsPrefix}/full-processing-files`, formData, config);
  return res.data;
};

// pdf预览
export const pdfPreview = (docUuid: string) => {
  return service({
    method: "post",
    url: `${documentsPrefix}/preview`,
    data: { docUuid, start: null, end: null },
    responseType: "arraybuffer",
  });
};
