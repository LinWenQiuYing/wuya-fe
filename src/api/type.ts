import { StatusNumber } from "@/admin/view/knowledgeBase/const";
import { Category } from "@/client/types/treeData";

export type FileOrFolderState = {
  category: Category;
  createTime: Date;
  creator: string | null;
  fileBusinessType: number | null;
  fileContentType: number | null;
  fileMd5: number | null;
  fileSize: number | null;
  fileStatus: StatusNumber | null;
  fileSuffix: number | null;
  fileUploadTaskId: number | null;
  fileUuid: string | null;
  id: number;
  name: string;
  parentId: number;
  updateTime: Date;
};
export type TableLazyFolderOrFile = {
  hasChildren: boolean;
  repositoryId: number;
  children?: TableLazyFolderOrFile[];
} & FileOrFolderState;
