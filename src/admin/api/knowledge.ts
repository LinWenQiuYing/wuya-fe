import { get, post, upload } from "@/utils/reqMethod";
import { service } from "@/utils/request";
import { BaseInfoProp, CreateDataParams, DateBseConnetionParams, ParserParams } from "../types";
import { DocSplit, ParserType, SaveDocParams, TypeListParams } from "@/admin/types/api";
import { Api } from "@/admin/api";
import { CancelTokenSource } from "axios";
import { dochubPrefix, documentsPrefix, userPrefix } from "@/utils/reqPrefix";

// 获取所有文档类的知识库
export const getKnowledgeList = () => {
  return get(`${documentsPrefix}/list`, null);
};

// 获取管理员权限下所有知识库
export const getAdminKnowList = (): Promise<any> => {
  return get(`${documentsPrefix}/list-repositories-count-info`, null);
};

// 根据id获取文件数 按照类型分类
export const getFileListType = (id: number): Promise<Api<TypeListParams>> => {
  return post(`${documentsPrefix}/list-files-business-type?id=${id}`, null);
};

// 创建知识库
export const create = (params): Promise<any> => {
  return post(`${documentsPrefix}/add-repository`, params);
};

// 批量上传本地文件

export const uploadLocalFiles = (params: FormData, cancel?: CancelTokenSource): Promise<any> => {
  return upload(`${documentsPrefix}/upload/local`, params, cancel?.token);
};

// 获取标签组下拉接口
export const getTagsList = (): Promise<any> => {
  return get(`${documentsPrefix}/tag/group/list`, null);
};

// 发起批量解析
export const splitDocuments = (params: any, cancel?: CancelTokenSource) => {
  return post(`${documentsPrefix}/split/documents`, params, cancel?.token);
};

// 单文档解析
export const parseDoc = (params: ParserParams, cancel?: CancelTokenSource) => {
  return post(`${documentsPrefix}/split/document`, params, cancel?.token);
};

// 编辑切片
export const editSplit = (uuid: string): Promise<Api<DocSplit[]>> => {
  return post(`${documentsPrefix}/split/doc/read?fileUuid=${uuid}`, null);
};

// pdf预览
export const getPdfPreview = (docUuid: string): Promise<any> => {
  return service({
    method: "post",
    url: `${documentsPrefix}/preview`,
    data: { docUuid, start: null, end: null },
    responseType: "arraybuffer",
  });
};

// 保存切片结果
export const saveUpdateSplit = (params) => {
  return post(`${documentsPrefix}/split/cache/save`, params);
};

// 创建完成
export const createKnow = (params: SaveDocParams) => {
  return post(`${documentsPrefix}/split/batch/save`, params);
};

// 测试数据源连接
export const dataBaseConnection = (params: DateBseConnetionParams) => {
  return post("/studio/api/connector/v1/tkh/datasource/schema", params);
};

// 数据源连接
export const dataConnection = (params: DateBseConnetionParams): Promise<any> => {
  return post("/studio/api/connector/v1/tkh/datasource", params);
};

// 创建数据源
export const createDatabase = (params: CreateDataParams): Promise<any> => {
  return post(`${userPrefix}/resource/create`, params);
};

// 获取解析方式
export const getParserType = (): Promise<Api<ParserType>> => {
  return get<ParserType>(`${dochubPrefix}/documents/parsers`);
};

// 获取机构下的知识库
export const organUnderKnow = (organId: number): Promise<Api<BaseInfoProp[]>> => {
  return post<BaseInfoProp[]>(`${documentsPrefix}/list-by-organ?organId=${organId}`, null);
};

// 中断文件上传
export const stopFileUpload = (taskId: number) => {
  return post(`${documentsPrefix}/upload/cancel?taskId=${taskId}`, null);
};
