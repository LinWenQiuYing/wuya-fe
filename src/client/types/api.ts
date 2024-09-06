import { HistoryChatType } from "@/client/types/index";
import { FileOrFolderState } from "@/api/type";
import { StatusNumber } from "@/admin/view/knowledgeBase/const";
import { CheckIdState } from "@/store/modules/documentQA";
import { AideKey } from "@/client/const";

export enum ParsingStatus {
  OK = "ok",
  FAILED = "failed",
}

export interface ParsingData {
  transcript: string | null;
  status: ParsingStatus;
}

export interface Sources {
  local: Record<string, Source>;
}

export interface Source {
  name: string;
  hippo: Array<string>;
  scope: Array<string>;
}

// 发送问题的基本参数
export interface BaseSendQuery {
  query: string; //用户输入
  topic_id?: number; //对话id
  chat_model?: string; //模型类型
  max_round?: number; //最大轮数
  regenerate?: boolean; //是否重新生成
}

export interface ChatParams extends BaseSendQuery {
  sources?: Array<CheckIdState | string>; //文档id
  regenerate?: boolean; //是否是重新问答
  newsId?: string; // 新闻问答id
  max_references?: number; //引用限制数量
  callback?: (query: string, key?: string) => Promise<void>;
  sourceNewsId?: string;
  chat_agent: AideKey;
  contract_source?: CheckIdState | null;
  video_source?: CheckIdState | null;
  audit_rule?: string;
  files?: string[]; //数据分析传送文件
  key?: string;
  outline?: string;
}

export interface ChatTreeNode {
  create_time: string;
  agent_type: string;
  id: number;
  is_dir: boolean;
  parent_id: number;
  title_name: string;
  check: boolean;
  topic_type: 1 | 2 | 3; // 1是智能问答2是写作助手3资讯
  user_id: string;
  isLeaf?: boolean;
  children?: Array<ChatTreeNode>;
}

export interface ChatDetail {
  a_parm: string;
  agent_type: AideKey;
  create_time: string;
  end_time: string;
  id: number;
  q_parm: string;
  question: string;
  topic_id: number;
  user_id: number;
  comment_on: string;
  comment: string;
}

export interface HistoryChatTree {
  topic: ChatTreeNode;
  tree: Array<HistoryChatTree>;
}

export interface CreatFolderParams {
  is_dir: boolean;
  parent_id?: number;
  title_name: string;
  topic_type: HistoryChatType;
}

export type UploadFileParams = {
  createTime: string;
  creator: string;
  documentTreeId: number;
  fileBusinessType: number;
  fileContentType: number;
  fileParsePercent: number;
  fileMd5: string;
  filePath: string;
  fileSize: number;
  fileStatus: StatusNumber;
  fileSuffix: number;
  fileUploadTaskId: number;
  fileUuid: string;
  id: number;
  name: string;
  updateTime: string;
};

export interface KnowledgeData {
  financeTree: Knowledge[];
  internetTree: Knowledge[];
  lawTree: Knowledge[];
  privateTree: Knowledge[];
  publicTree: Knowledge[];
}

export interface Knowledge {
  createTime: string;
  creator: string;
  datasourceId: string;
  description: string;
  documentTreeId: number;
  graphId: string;
  id: number;
  name: string;
  ownerType: number;
  repositoryStorageType: number;
  repositoryType: number;
  updateTime: string;
  uploadEnable: boolean;
  uuid: string;
}

export interface UploadTaskProp {
  documents: UploadFileParams[];
  endTime: Date;
  id: number;
  percent: string;
  startTime: Date;
  successDocs: number;
  totalDocs: number;
  uploadTaskStatus: number;
  uploadType: number;
}

export interface TreeChild {
  children: Array<FileOrFolderState>;
  parentId: number;
  repositoryId: number;
}

export interface TranslateData {
  detectedLanguage: { confidence: number; language: "zh" | "en" };
  translatedText: string;
}

export interface NewsQuestionParams {
  hot: Record<string, Record<string, string | string[]>>;
  realtime: Record<string, Record<string, string | string[]>>;
}
