//parsers
import { FileOrFolderState } from "@/api/type";

enum Target_File_Ext {
  PDF = "pdf", //PDF类型文件
  DOCX = "docx", //docx类型文件
  PPTX = "pptx", //pptx类型文件
}

export enum Parser_Type {
  GeneralPDFParser = "GeneralPDFParser",
  AnnualReportPDFParser = "AnnualReportPDFParser",
  OCRPDFParser = "OCRPDFParser",
  GeneralDocxParser = "GeneralDocxParser",
  GeneralPPTXParser = "GeneralPPTXParser",
}

export enum Target_Content_Type {
  PDF = "application/pdf",
  DOCX = "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  DOCX_WPS = "application/wps-office.docx",
  PPT = "application/vnd.openxmlformats-officedocument.presentationml.presentation",
}

interface File_Param {
  name: string;
  display_name: string;
  required: boolean;
  data_type: string;
  default: number | string;
}

export interface Parser {
  key: Parser_Type;
  name: string;
  target_content_type: Target_Content_Type | Array<Target_Content_Type>;
  target_file_ext: Target_File_Ext;
  params: Array<File_Param>;
}

export interface ParserType {
  status: string;
  data: Array<Parser>;
}

export interface DocSplit {
  content: string;
  metadata: {
    page: string;
    totalPages: number;
  };
}

export interface OrganizationProp {
  organ: {
    description: string;
    id: number;
    name: string;
    parentId: number;
  };
  organTrees: OrganizationProp[];
  permissionIds: Array<number>;
}

export interface UserListParams {
  page: number;
  size: number;
  sortMap?: Record<"create_time" | "status" | "id", boolean>;
  likeMap?: Record<"username" | "nickname" | "email", string>;
  eqMap?: Record<string, string>;
}

export interface UserListProp {
  countId: string;
  current: number;
  maxLimit: number;
  optimizeCountSql: boolean;
  orders: string[];
  pages: number;
  searchCount: boolean;
  size: number;
  total: number;
  records: UserRecord[];
}

export interface UserRecord {
  avatar: string;
  createTime: string;
  defaultKnowledgeSource: string;
  defaultModel: string;
  defaultPrompt: string;
  email: string;
  id: number;
  nickname: string;
  organId: number;
  password: string;
  personalDetails: null;
  phone: string;
  status: number;
  updateTime: string;
  useHistoryData: boolean;
  username: string;
  enable: boolean;
}

export interface AuthsParams {
  organId: number;
  permissionId: number;
}

export interface SaveDocParams {
  id?: number;
  uploadTaskId?: number;
}

export interface TypeListParams {
  docsList: FileOrFolderState[];
  imgList: FileOrFolderState[];
  mediaList: FileOrFolderState[];
  noneList: FileOrFolderState[];
  pdfList: FileOrFolderState[];
  pptxList: FileOrFolderState[];
  tableList: FileOrFolderState[];
  txtList: FileOrFolderState[];
}
