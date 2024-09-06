export interface Api<T extends any> {
  code: number;
  data: T;
  message: string;
}

export enum ChatClientMenu {
  homePage, //首页
  qa, //问答
  news, //资讯
  writing, //写作
  qn, // 问数
  survey, // 尽调
}

export enum KnowledgeSourceType {
  ALL = "all", // 所有
  PERSONAL = "personal", // 个人
  ENTERPRISE = "enterprise", // 企业知识源
  INTERNET = "internet", // 互联网
  FINANCE = "finance", // 财经
  LAW = "law", // 法律
}

export enum ChatProgressStatus {
  LOADING = "loading",
  SUCCESS = "success",
}

export interface Chat {
  uuid: string; // id
  question: string; // 问题
  chatContent: Array<ChatContent>;
}

export interface ChatContent {
  question: string; // 问题
  progress: Array<ChatProgress>; // 进度
  reference: Array<Record<string, any>>; //参考
  answer: string; //回答
  images: Array<string>; // 图片地址
}

export interface ChatProgress {
  title: string;
  status: ChatProgressStatus;
}

export enum UploadState {
  SUCCESS = "success",
  FAIL = "fail",
  UPLOADING = "uploading",
}

//历史记录类型
export enum HistoryChatType {
  intelligent_qa = 1, //智能问答
  writing_assistant = 2, //实时资讯
  real_time_information = 3, //写作助手
}

//股票相关信息
export interface StockChat {
  fluctuations: number;
  price: number;
  priceChange: number;
  stockTrendList: Array<{
    close: number;
    fluctuations: number;
    high: number;
    low: number;
    open: number;
    tradeDate: string;
    upAndDown: number;
    volume: number;
  }>;
}

//产业链
export interface Atlas {
  graph_name: string;
  cypher: string[];
}

export type QuestionType = "report" | "writing";

export interface QuestionDocType {
  dirIdList?: string[];
  docIdList?: string[];
  kbIdList?: string[];
}

export type Language = "zh-CN" | "ja" | "en-US";

export type FeedBackType =
  | "格式错误"
  | "逻辑错误"
  | "有害信息"
  | "事实错误"
  | "没有帮助"
  | "答非所问"
  | "其他";
