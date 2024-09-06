import { KnowledgeSourceType } from "@/client/types/index";

export interface TreeRootProp {
  id: string | number;
  isLeaf: boolean;
  name: string;
  type: KnowledgeSourceType;
  createTime?: string;
  creator?: string;
  datasourceId?: string;
  description?: string;
  documentTreeId?: string;
  graphId?: string;
  isCreate?: boolean;
  ownerType: number;
  repositoryStorageType: number;
  repositoryType: number;
  updateTime?: string;
  uploadEnable?: boolean;
  isRoot?: boolean;
  uuid?: string;
  children?: Array<FolderFileProp>;
}

// 预加载节点, 用于显示上传中的文档
type PreloadNode = {
  preload: true;
  name: string;
  progress: number;
  hash: string;
  isLeaf: boolean;
};

export enum Category {
  folder = 1, // 文件夹
  file = 2, // 文档
}

export interface FolderFileProp {
  category: Category;
  createTime: Date;
  creator: null | string;
  fileBusinessType: null | number;
  fileContentType: null | number;
  fileMd5: null | string;
  fileSize: null | number;
  fileStatus: number;
  fileSuffix: null | number;
  fileUploadTaskId: null | number;
  fileUuid: null | string;
  id: number;
  isLeaf: boolean;
  isPrivate?: boolean;
  name: string;
  parentId: number;
  isCreate?: boolean;
  updateTime: Date;
  documentTreeId?: number;
  type?: KnowledgeSourceType;
  children?: Array<FolderFileProp>;
  repositoryId?: number;
}
