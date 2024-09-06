import { get, post } from "src/utils/reqMethod";
import { Atlas, StockChat } from "@/client/types";
import { basePrefix, chatPrefix, dochubPrefix } from "@/utils/reqPrefix";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import appendAuthHeader from "@/sign/appendAuthHeader";
import useDefaultLanguage from "@/client/views/settings/useDefaultLanguage";
import { ElMessage } from "element-plus";
import { AxiosRequestConfig } from "axios";
import { blobService, uploadService } from "@/utils/request";

// 模型类型
export type ModelCode = "default" | "transwarp";

// 模型
export type Model = {
  type?: "local" | "remote";
  code: ModelCode;
  name: string;
  description: string;
};

// 模型map(后端返回的数据结构)
type ModelMap = {
  [t in ModelCode]: {
    [p in Exclude<keyof Model, "code">]: Model[p];
  };
};

export const formatModelMap = (modelMap: ModelMap) => {
  const keys = <ModelCode[]>Object.keys(modelMap);
  return keys.map((code): Model => {
    return { ...modelMap[code], code };
  });
};

// 获取可用模型
export const getModels = async () => {
  const response = await get<ModelMap>(`${chatPrefix}/qa/models`);
  return formatModelMap(response.data);
};

// 获取相关问题的图片
export const getImages = async (q: string, n: number): Promise<Array<string>> => {
  const result = await get<Array<string>>(`${chatPrefix}/image/query`, { q, n });
  return result.data;
};

//获取股票数据
export const getStockChat = async (params: { stockCode: string; dateCode: number }): Promise<StockChat> => {
  const result = await post<StockChat>(`${basePrefix}/stock/get-stock-trend`, params);
  return result.data;
};

//获取产业链
export const getAtlas = async (params: {
  condition_company: string[];
  user_query: string;
  topic_id: string;
}): Promise<Atlas> => {
  const result = await post<Atlas>(`${chatPrefix}/industrychain`, params);
  return result.data;
};

export type DocExportPayload = {
  text: string;
  format: "markdown";
};

export type ExportParams = {
  qa_record_id: number;
  export_format: "pdf" | "docx";
  with_citation: boolean;
};

// 导出为docx格式
export const exportToDocx = async (text: string): Promise<string> => {
  const payload: DocExportPayload = { text, format: "markdown" };
  return await blobService.post(`${dochubPrefix}/export/docx`, payload);
};

// 导出为pdf格式
export const exportToPDF = async (text: string): Promise<string> => {
  const payload: DocExportPayload = { text, format: "markdown" };
  return await blobService.post(`${dochubPrefix}/export/pdf`, payload);
};

// 导出为pdf或docx 通过recordId进行转换
export const exportToPdfOrDocx = async (prams: ExportParams): Promise<string> => {
  return await blobService.post(`${chatPrefix}/enterprise_research/export_content`, prams);
};

// 单个文档引用的结构
export type DocumentReference = {
  uid: string;
  title: string;
  content: string;
  document_id?: string;
  document_name?: string;
  document_pages?: string;
  news_link?: string;
  news_source?: string;
  source?:
    | string
    | {
        doc_id: string;
        kb_id: string;
      };
};

export type DraftSection = {
  reference: DocumentReference[];
  content: string;
  id: number;
  name: string;
  ordinal: number;
};

export type Draft = {
  id: number;
  query: string;
  title: string;
  sections: DraftSection[];
};

// 写作流程中, 根据 topic_id, record_id 创建 草稿
export const createWritingDraft = async (payload: { topic_id: number; record_id: number }) => {
  const body = await post<Draft>(`${chatPrefix}/edit/create_draft`, payload);
  return body.data;
};

// 根据 draft_id 获取已经创建了的草稿
export const getWritingDraft = async (payload: { record_id: number; draft_id: number }) => {
  const body = await post<Draft>(`${chatPrefix}/edit/get_draft`, payload);
  return body.data;
};

export const previewWritingDraft = async (payload: { record_id: number; draft_id: number }) => {
  const body = await post<unknown>(`${chatPrefix}/edit/back_to_preview`, payload);
  return body.data;
};

export type DraftExportPayload = {
  draft_id: number;
  export_format: "docx" | "pdf";
  with_citation: boolean;
};

export const exportWritingDraft = async (payload: DraftExportPayload): Promise<string> => {
  return await blobService.post(`${chatPrefix}/edit/export_draft`, payload);
};

// 写作编辑草稿时, 将一个部分往上移
export const moveWritingDraftSectionUp = async (section_id: number) => {
  const body = await post<Draft>(`${chatPrefix}/edit/move_up_section`, { section_id });
  return body.data;
};

// 写作编辑草稿时, 将一个部分往下移
export const moveWritingDraftSectionDown = async (section_id: number) => {
  const body = await post<Draft>(`${chatPrefix}/edit/move_down_section`, { section_id });
  return body.data;
};

// 写作编辑草稿时, 删除一个部分
export const deleteWritingDraftSection = async (section_id: number) => {
  const body = await post<Draft>(`${chatPrefix}/edit/delete_section`, { section_id });
  return body.data;
};

export type SectionRegeneratePayload = {
  draft_id: number;
  section_id: number;
  // 对章节重写、生成的要求
  user_prompt: string;
  // 是否是简洁的
  concise: boolean;
  // 生成的章节是否是列表形式
  list_form: boolean;
  // 目标位置, 0 表示新插入的章节将变成第一章
  target_ordinal: number;
};

// 返回的文档引用列表
export type ReferencesMessage = {
  reference: DocumentReference[];
};
export type SectionRegenerateMessage =
  | { text: string | null }
  | { status: "ok" }
  | { status: "error"; detail: string }
  | ReferencesMessage;

export type Abort = () => void;

// 试重写某章节内容 (不会更新到草稿中)
export const regenerateDraftSection = (
  payload: SectionRegeneratePayload,
  callback: (message: SectionRegenerateMessage) => void,
) => {
  const abortController = new AbortController();
  const defaultLanguage = useDefaultLanguage();
  const { promise, reject } = Promise.withResolvers<void>();
  const abort: Abort = () => {
    reject("aborted");
    abortController.abort();
  };
  fetchEventSource(`${chatPrefix}/edit/rewrite_section`, {
    method: "post",
    headers: appendAuthHeader({
      "Content-Type": "application/json",
      "Accept-Language": defaultLanguage.value,
    }),
    signal: abortController.signal,
    body: JSON.stringify(payload),
    onerror: console.error,
    onmessage(event) {
      const data = <SectionRegenerateMessage>JSON.parse(event.data);
      callback(data);
    },
  }).catch(ElMessage.error);
  return [promise, abort] as const;
};

export type SectionUpdatePayload = {
  section_id: number;
  updated_content: string;
  updated_references: DocumentReference[];
};
// 更新章节内容
// 重写章节流程: 先 rewrite_section, 再 update_section
export const updateDraftSection = async (payload: SectionUpdatePayload) => {
  const body = await post<Draft>(`${chatPrefix}/edit/update_section`, payload);
  return body.data;
};

export type SectionCreatePayload = {
  draft_id: number;
  // 对章节重写、生成的要求
  user_prompt: string;
  // 是否是简洁的
  concise: boolean;
  // 生成的章节是否是列表形式
  list_form: boolean;
  // 目标位置, 0 表示新插入的章节将变成第一章
  target_ordinal: number;
};
export type SectionGenerateMessage = SectionRegenerateMessage;

// 生成新的章节 (不会更新到草稿中)
export const createDraftSection = (
  payload: SectionCreatePayload,
  callback: (message: SectionGenerateMessage) => void,
) => {
  const abortController = new AbortController();
  const defaultLanguage = useDefaultLanguage();
  const { promise, reject } = Promise.withResolvers<void>();
  const abort: Abort = () => {
    reject("aborted");
    abortController.abort();
  };
  fetchEventSource(`${chatPrefix}/edit/insert_section`, {
    method: "post",
    headers: appendAuthHeader({
      "Content-Type": "application/json",
      "Accept-Language": defaultLanguage.value,
    }),
    signal: abortController.signal,
    body: JSON.stringify(payload),
    onmessage(event) {
      const data = <SectionGenerateMessage>JSON.parse(event.data);
      callback(data);
    },
  }).catch(ElMessage.error);
  return [promise, abort] as const;
};

export type SectionAppendPayload = {
  draft_id: number;
  // 章节内容(markdown)
  content: string;
  references: DocumentReference[];
  // 目标位置, 0 表示新插入的章节将变成第一章
  target_ordinal: number;
};

// 将上一步中生成的新的章节更新到草稿中
// 添加章节流程, 先 insert_section, 再 confirm_insert_section
export const appendDraftSection = async (payload: SectionAppendPayload) => {
  const body = await post<Draft>(`${chatPrefix}/edit/confirm_insert_section`, payload);
  return body.data;
};

// docx 转 markdown
export const uploadDocxToMarkdown = async (
  formData: FormData,
  config?: AxiosRequestConfig,
): Promise<string> => {
  const res = await uploadService.post<string>(`${dochubPrefix}/documents/convert/docx2md`, formData, config);
  return res.data;
};

// markdown 转 docx
export const exportMarkdownToDocx = async (params: { text: string; format: string }): Promise<string> => {
  const res: string = await blobService.post(`${dochubPrefix}/export/docx`, params);
  return res;
};

type confirmMessageState = {
  candidate_enterprise_info: {
    candidate_enterprise_name: string;
    candidate_stock_code: string;
    candidate_stock_name: string;
  }[];
  exec_message: string;
  qa_record_id: number;
  topic_id: number;
};

export const beforeSendConfirm = async (query: string) => {
  const res = await post<confirmMessageState>(`${chatPrefix}/enterprise_research/confirm_enterprise`, {
    query,
  });
  return res;
};

type OutlineParams = {
  enterprise_name: string;
  stock_code: string;
};

// 获取尽调默认模板
export const defaultOutline = async (params: OutlineParams) => {
  const res = await post<string>(`${chatPrefix}/enterprise_research/generate_outline`, params);
  return res.data;
};

export type RateType = "praise" | "trample";

export interface RateParams {
  record_id: number; //问题ID
  comment_on?: RateType; //赞或踩
  comment?: string; //评论
}

//问答赞和踩
export const ratePost = async (params: RateParams) => {
  const res = await post<boolean>(`${chatPrefix}/record/comment`, params);
  return res.data;
};

// 获取游客问答的key
export const getAnonymousKey = async () => {
  const res = await get<string>(`${chatPrefix}/visitor-qa-key `);
  return res.data;
};

interface ExportFinancialParams {
  qa_record_id: number;
  query?: string;
  sources?: string[];
  regenerate?: boolean;
  topic_id?: number;
  export_format?: "pdf" | "docx";
  with_citation?: boolean;
}

// 财务审核导出文件
export const exportFinancialReport = async (params: ExportFinancialParams): Promise<string> => {
  return await blobService.post(`${chatPrefix}/export_financial_report`, params);
};
