import { upload } from "src/utils/reqMethod";
import { TranslateData } from "@/client/types/api";

// 翻译
export const translate = async (params: FormData): Promise<TranslateData> => {
  const result = await upload<TranslateData>(`/infinity/translate`, params);
  return result.data;
};
