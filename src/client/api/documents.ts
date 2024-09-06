// documents 接口
import { post, upload } from "src/utils/reqMethod";
import { ParsingData } from "@/client/types/api";
import { service } from "@/utils/request";
import { documentsPrefix } from "@/utils/reqPrefix";

// 文件上传
export const uploadFile = (params) => {
  return upload(`${documentsPrefix}/full-processing-single-file`, params);
};

// pdf预览
export const openPreview = (docId, params) => {
  return post(`/documents/${docId}/preview`, params, null, "arraybuffer");
};

// 解析语音
export const parseSpeech = (params): Promise<ParsingData> => {
  return post("/documents/recording_asr", params);
};

// 搜索知识库文档
export const getPdf = (item_id: string, image?: boolean): Promise<any> => {
  return service({
    method: "get",
    url: `${documentsPrefix}/highlight`,
    params: { item_id, image },
    responseType: "blob",
    validateStatus() {
      return true;
    },
  });
};

export const getFinanceImage = (params: {
  docName: string;
  pages: number;
  image: boolean;
  positions: Array<any>;
}): Promise<any> => {
  return service({
    method: "post",
    url: `${documentsPrefix}/preview/finance`,
    data: params,
    responseType: "blob",
  });
};
