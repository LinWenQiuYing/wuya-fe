import { LabelProps, NewsProps, PageParams, RealtimeNews } from "@/client/types/news";
import { chatPrefix, stockPrefix } from "@/utils/reqPrefix";
import { get, post, put } from "src/utils/reqMethod";

export const getRealTime = async (params: PageParams): Promise<RealtimeNews> => {
  const result = await post<RealtimeNews>(`${chatPrefix}/news/realtime`, params);
  return result.data;
};

export const getMyRealTime = async (params: PageParams): Promise<RealtimeNews> => {
  const result = await post<RealtimeNews>(`${chatPrefix}/news/my/realtime`, params);
  return result.data;
};

export const getHotNewsList = async (json: any): Promise<NewsProps[]> => {
  const result = await post<NewsProps[]>(`${chatPrefix}/news/hot`, json);
  return result.data;
};

export const getLablesTree = async (): Promise<any> => {
  const result = await get(`${chatPrefix}/news/labels/tree`);
  return result.data;
};

export const addMyLables = async (json: any): Promise<any> => {
  const result = await post(`${chatPrefix}/news/my/label/new/batch`, json);
  return result;
};

export const getMyLablesTree = async (): Promise<Record<number, LabelProps>> => {
  const result = await get<Record<number, LabelProps>>(`${chatPrefix}/news/my/labels/tree`);
  return result.data;
};

export const getStockTrend = async (json: any): Promise<any> => {
  const result = await post<NewsProps[]>(`${stockPrefix}/index/trend`, json);
  return result.data;
};

export const getLabelsList = async (): Promise<any> => {
  const result = await get<NewsProps[]>(`${chatPrefix}/news/my/labels`);
  return result.data;
};

export const setLabelsList = async (json: any): Promise<any> => {
  const result = await post<NewsProps[]>(`${chatPrefix}/news/my/labels`, json);
  return result.data;
};

export const getRecommendLabels = async (): Promise<any> => {
  const result = await get<NewsProps[]>(`${chatPrefix}/news/labels/recommend`);
  return result.data;
};

export const batchSetLabelEffective = async (data: any, status: number): Promise<any> => {
  const result = await put(`${chatPrefix}/news/my/label/effective/batch/${status}`, data);
  return result;
};

export const setLabelKeyword = async (data: any): Promise<any> => {
  const result = await put(`${chatPrefix}/news/my/label/keyword`, data);
  return result.data;
};

export const getIndustryHot = async (data: any): Promise<any> => {
  const result = await post(`${stockPrefix}/sector/hot`, data);
  return result.data;
};

export const getRelateEntity = async (id: string): Promise<any> => {
  const result = await get(`${chatPrefix}/news/relate/entity/${id}`);
  return result;
};

export const getRelateNews = async (params: any): Promise<any> => {
  const result = await get(`${chatPrefix}/news/relate/nearly/month`, params);
  return result.data;
};

export const getTmpHot = async (): Promise<any> => {
  const result = await get(`${chatPrefix}/news/tmp/hot`);
  return result.data;
};
