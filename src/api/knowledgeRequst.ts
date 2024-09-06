import { DeleteParams, FolderParams } from "@/admin/types";
import { get, post } from "@/utils/reqMethod";
import { Api } from "@/client/types";
import { TreeChild, UploadTaskProp } from "@/client/types/api";
import { documentsPrefix } from "@/utils/reqPrefix";

// 创建文件夹
export const addFolder = (params: FolderParams): Promise<any> => {
  return post(`${documentsPrefix}/add-directory`, params);
};

// 删除文件夹, 文件, 知识库
export const deleteCondition = (params: DeleteParams): Promise<any> => {
  return post(`${documentsPrefix}/delete-by-conditon`, params);
};

// 文件上传进度
export const batchProgress = (id: number): Promise<Api<UploadTaskProp>> => {
  return post(`${documentsPrefix}/get-upload-task-detail?id=${id}`, null);
};
// 通过第一层数据源获取其下面的目录
export const getMoreDirByUpId = (id: number | string): Promise<Api<TreeChild>> => {
  return get(`${documentsPrefix}/${id}/list`, null);
};

// 移动文件或文件夹
export const moveResource = (params) => {
  return post(`${documentsPrefix}/update-by-conditon`, params);
};

// 知识库重命名
export const updateName = (params: { id: number; name: string }) => {
  return post(`${documentsPrefix}/repo-folder-rename`, params);
};
