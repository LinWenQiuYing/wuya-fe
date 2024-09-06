import { FileOrFolderState } from "@/api/type";
import { StatusNumber } from "@/admin/view/knowledgeBase/const";

export enum UserManage_title {
  ORGANIZATION = "organization_manage",
  USER = "user_manage",
  ROLE = "role_manage",
}

export enum Show_state {
  CHECK = "check",
  EDIT = "edit",
}

export enum KnowledgeBaseType {
  DOCUMENT = "document", // 文档
  ATLAS = "atlas", // 图谱
}

export enum KnowledgeBasePeople {
  PERSON = "个人", // 个人
  MANY = "协同", // 协同
}

export enum KnowledgeBaseTabsKey {
  DOCUMENT = "document", // 文档列表
  DATA_SOURCE = "data_source", // 数据源
  PERMISSION = "permission", // 知识库权限
  QUESTION_TEMPLATE = "question_template", // 提问模版
  RELATIONAL_GRAPH = "relational_graph", // 实体关系图
  BUILD_TASK = "build_task", //构建任务
}

export enum KnowledgeBaseState {
  LIST = "list", // 查看知识库列表
  CREATE = "create", // 创建知识库
}

export interface TableNodeProp {
  category: 1 | 2;
  createTime: Date;
  fileBusinessType: string;
  fileContentType: string;
  fileMd5: string;
  fileSize: number;
  fileStatus: number;
  fileSuffix: string;
  fileUploadTaskId: string;
  fileUuid: string;
  id: number;
  name: string;
  parentId: number;
  path?: string;
  repositoryId?: number;
  updateTime: Date;
  children?: TableNodeProp[];
  type?: string;
  hasChildren?: boolean;
}

export interface GrapSelectListProp {
  createTime: Date;
  createUser: null | string;
  groupName: string;
  id: string;
  isDelete: number;
  updateTime: null | string;
  updateUser: null | string;
}

export interface CreateKnowledgeBaseParams {
  description: string;
  name: string;
  repositoryType: number;
  sdbConfigureType?: number;
  graphEnName?: string;
  tagGroupId?: string;
}

export interface CreateKnowledgeProp {
  state: KnowledgeBaseState;
  currentData: BaseInfoProp;
  createType: number;
  uploadFilesRes: uploadFilesResProp[];
  taskId: string;
  organization: AuthsProp | null;
}

export interface BaseInfoProp {
  id: number;
  graphId: string;
  name: string;
  description: string;
  documentTreeId: number;
  repositoryType: number;
  datasourceId: null | string;
  repositoryStorageType: null | string;
  ownerType: number;
  creator: string;
  createTime: null | Date;
  updateTime: null | Date;
  count: number;
  uploadEnable: boolean;
}

export interface uploadFilesResProp {
  createTime: Date;
  creator: string;
  documentTreeId: number;
  fileBusinessType: number;
  fileContentType: number;
  fileMd5: string;
  fileSize: number;
  fileStatus: number;
  fileSuffix: number;
  fileUploadTaskId: number;
  fileUuid: string;
  id: number;
  name: string;
  updateTime: Date;
}

export interface DateBseConnetionParams {
  name: string;
  connectionType: string;
  workspaceUuid: string;
  description?: string;
  authInfos?: AcountParams | KerberosParams;
  connection: string;
  authType: string;
  connectionArgs?: {
    HDFS_SITE: string;
    CORE_SITE: string;
  };
}

export interface AcountParams {
  PASSWORD?: string;
  USERNAME?: string;
}

export interface KerberosParams {
  PRINCIPAL?: string;
  KEYTAB?: string;
}

export interface CreateDataParams {
  repositoryId: number;
  sourceId: string;
  updateInterval?: 1 | 7 | 30;
  updateType?: 1 | 2;
}

export interface tabsDataProp {
  key: KnowledgeBaseTabsKey;
  title: string;
  content: any;
}

export interface FolderParams {
  name: string;
  parentId: number;
}

export interface DeleteParams {
  dirId?: number;
  docId?: string;
  itemId?: string;
  kbId?: number;
}

export interface ParserParams {
  doc_id: string;
  document_parser: string;
}

export interface AuthsProp {
  children?: AuthsProp[];
  code: string;
  id: number;
  orgId: string;
  name: string;
  parentId: string;
  rootNode: string;
  sortOrder: number;
  type: number;
  viewAndAnswerEnable: boolean;
  uploadAndAnalysisEnable: boolean;
  hasChildren: boolean;
}

export interface OrganizationTree {
  description: string;
  id: number;
  name: string;
  parentId: number;
  permissionIds: number[];
  children?: OrganizationTree[];
}

export interface UserSearchRecord {
  total: number;
  page: number;
  size: number;
  sortMap?: {
    create_time?: boolean;
    status?: boolean;
    id?: boolean;
  };
  likeMap?: {
    username?: string;
    nickname?: string;
    email?: string;
  };
}

export interface TreeAuthList extends OrganizationTree {
  cat: boolean;
  upload: boolean;
  children?: TreeAuthList[];
}

export interface TypeFileOrFolderState {
  type: string[];
  children: FileOrFolderState[];
  noDel: boolean;
  id: number;
  category: 1;
  name: string;
  fileStatus: StatusNumber | null;
}
