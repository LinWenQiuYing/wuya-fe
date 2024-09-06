import { CheckIdState } from "@/store/modules/documentQA";
import { AideKey } from "@/client/const";

export type ProgressState = string | ChatProgressState;

// 服务返回内容 基本
export interface BaseAnswerParams {
  // 对话id
  topic_id?: string;
  // 当前回答问题id
  record_id: number;
  // 公司名
  company?: string[];
  // 解析进度内容
  agent?: ProgressState;
  // 进度关键字
  keywords?: Array<string>;
  // 引用
  reference?: ReferenceState[];
  // 引用序号
  citations?: number[];
  // 推荐问题
  related_query?: string;
  // 服务输出完成会返回
  status?: string;
}

// qa服务返回片段
export type QaAnswer = {
  // 图谱
  industry_chain?: IndustryChainState;
  // 股票
  related_stocks?: StockState;
  // 回答内容
  llm_output?: string | null;
} & BaseAnswerParams;

// 视频解析服务返回片段
export type VideoAnswer = {
  agent?: string;
  text?: string;
} & BaseAnswerParams;

// 客服返回片段
export type ServiceAnswer = {
  agent?: string;
  llm_output?: string;
} & BaseAnswerParams;

// 尽调服务返回片段
export type SurveyAnswer = {
  outline?: string;
  llm_output?: string | null;
  qa_record_id?: number;
} & BaseAnswerParams;

// 合同审核服务返回片段
export type AuditAnswer = {
  audit_rule?: string;
  llm_output?: string | null;
} & BaseAnswerParams;

// 数据分析服务返回片段
export type AnalysisAnswer = {
  answer?: string;
  result?: string;
  text: string; //数据分析过程输出
  outline: string; // 大纲
} & BaseAnswerParams;

export type BaseRecordAnswer = {
  // 解读是否输出完成
  isProgress?: boolean;
  // 是否手动中止, true表示已被手动中止
  answerStop?: boolean;
  // 标识流是否输出完毕
  answerStatus?: 1;
  // 进度内容
  progress?: Array<ProgressState | string[]>;
  // 推荐问题
  query?: string[];
  // 来源
  reference?: ReferenceState[];
  // 公司名
  company?: string[];
  agentType?: AideKey;
};

// qa的记录 包括资讯
export type QaRecordState = {
  industry_chain?: IndustryChainState;
  related_stocks?: StockState;
  llm_output?: string | null;
} & BaseRecordAnswer;

// 尽调记录
export type SurveyRecordState = {
  outline?: string;
  preCheckConfirms?: {
    candidate_enterprise_name: string;
    candidate_stock_code: string;
    candidate_stock_name: string;
  }[];
  recordId?: number;
  llm_output?: string | null;
} & BaseRecordAnswer;

export type AuditRecordState = {
  auditRule?: string;
  llm_output?: string | null;
} & BaseRecordAnswer;

// 数据分析|财务分析 记录
export type AnalysisRecordState = {
  answer?: string;
  agent?: string;
  text?: string;
  outline?: string; // 财务分析大纲
} & BaseRecordAnswer;

// 视频解析记录
export type VideoRecordState = {
  text?: string;
} & BaseRecordAnswer;

// 客服记录
export type ServiceRecordState = {
  llm_output?: string;
} & BaseRecordAnswer;

// 记录类型
export interface RecordState<T> {
  question: string;
  newsId?: string;
  answer: T;
  //当前回答问题id
  recordId?: number;
  //赞或踩
  commentOn?: string;
  //踩的原因
  comment?: string;
}

// 首页问答类型
export type ChatDataState = RecordState<
  | AnalysisRecordState
  | QaRecordState
  | SurveyRecordState
  | AuditRecordState
  | VideoRecordState
  | ServiceRecordState
>;

export type IndustryChainState = {
  cypher: string;
  graph_name: string;
};

type ReferenceKey =
  | "uid"
  | "content"
  | "title"
  | "document_id"
  | "document_name"
  | "document_pages"
  | "news_link"
  | "news_source";
type PositionsKey = "x" | "y" | "width" | "height" | "page_no";
type StrKey = {
  [key in ReferenceKey]: string;
};

export type ReferenceState = {
  source: CheckIdState | string;
  positions?: Record<PositionsKey, number>;
} & StrKey;

export interface StockState {
  [key: string]: {
    code: string;
    name: string;
  };
}

export interface ChatProgressState {
  action: string;
  complete_message: string;
  active_message: string;
  data?: string[];
}
