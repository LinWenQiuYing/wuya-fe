import { post, get } from "src/utils/reqMethod";
import { basePrefix, chatPrefix, documentsPrefix } from "@/utils/reqPrefix";
import { QuestionDocType, QuestionType } from "@/client/types";
import { NewsQuestionParams } from "@/client/types/api";

// 大模型-预置问题-换一批
export const nextQuestions = async (params: { question_type: QuestionType }): Promise<string[]> => {
  const result = await post<string[]>(`${chatPrefix}/preset-question-conversion`, params);
  return result.data;
};

// 首页推荐问题
export const hotNewsQuestions = async (): Promise<NewsQuestionParams> => {
  const result = await get<NewsQuestionParams>(`${chatPrefix}/news/preset-news-question`);
  return result.data;
};

// 检查就近时间文档上传是否可用
export const checkDocUploadAvailable = async (): Promise<boolean> => {
  const res = await get<boolean>(`${documentsPrefix}/available`);
  return res.data;
};

export type CloudSpaceState = {
  // 总容量
  total: number;
  // 已使用的
  used: number;
};

export const getCloudSpace = async () => {
  const res = await post<CloudSpaceState>(`${documentsPrefix}/user/space`, null);
  return res.data;
};
