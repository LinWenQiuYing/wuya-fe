// 图谱构建
import { deleteReq, get, getBlob, post, put, upload } from "@/admin/utils/reqMethod";

// ------新建图谱构建项目
export const createGraphTask = (params) => {
  return post("/tas/api/project", params);
};
// 更新图谱构建项目
export const updateGraphTask = (params) => {
  return put(`/tas/api/project`, params);
};
// 分页查询项目
export const getTaskByPage = (params) => {
  return get("/tas/api/project/page", params);
};
// 删除项目
export const deleteTask = (id: string) => {
  return deleteReq(`/tas/api/project/${id}`, null);
};
// 查看项目详情
export const getTaskDetail = (id: string) => {
  return get(`/tas/api/project/${id}`, null);
};

//------标签组
//获取标签组&搜索
export const getAllTagGroup = (params) => {
  return post("/tas/api/tag/selectTagGroups", params);
};
// 新建标签组
export const createTagGroup = (params) => {
  return post("/tas/api/tag/createTagGroup", params);
};
// 更新标签组
export const updateTagGroup = (params) => {
  return put(`/tas/api/tag/updateTagGroup`, params);
};
// 删除标签组
export const deleteTagGroup = (params) => {
  return deleteReq("/tas/api/tag/deleteTagGroup", params);
};

//------标签
// 分页查询标签&搜索tag
export const getTagByPage = (params) => {
  return post("/tas/api/tag/selectTagsByPage", params);
};
//查询标签(不分页)
export const getAllTag = (params) => {
  return post("/tas/api/tag/selectTags", params);
};
// 删除标签组
export const deleteTag = (params) => {
  return deleteReq("/tas/api/tag/deleteTag", params);
};
//新建标签
export const createTag = (params) => {
  return post("/tas/api/tag/createTag", params);
};
//字典文件（xlsx）解析
export const parseFile = (params) => {
  return upload("/tas/api/tag/parseDictionaryFile", params);
};
//编辑tag
export const updateTag = (params) => {
  return put(`/tas/api/tag/updateTag`, params);
};

//------构建任务
//新建构建任务
export const createBuildTask = (params) => {
  return post("/tas/api/buildTask", params);
};
//编辑tag
export const updateBuildTask = (params) => {
  return put(`/tas/api/buildTask`, params);
};
//上传
export const uploadFile = (params) => {
  return upload("/tas/api/buildTask/upload", params);
};
//查看
export const getBuildTaskById = (id: string) => {
  return get(`/tas/api/buildTask/${id}`, null);
};
//删除
export const deleteBuildTask = (id: string) => {
  return deleteReq(`/tas/api/buildTask/${id}`, null);
};
//获取所有构建任务
export const getAllBuildTask = (id: string) => {
  return get(`/tas/api/buildTask/${id}/list`, null);
};
//分页查看构建任务
export const getBuildTaskByPage = (params) => {
  return post(`/tas/api/buildTask/${params.projectId}/page`, params);
};
//查看上传进度
export const getProgress = (id: string) => {
  return get(`/tas/api/buildTask/${id}/upload/status`, null);
};
//删除上传的文件
export const deleteFile = (id: string) => {
  return deleteReq(`/tas/api/document/${id}`, null);
};
//本地文件执行解析
export const parseLocalTask = (params) => {
  return post("/tas/api/buildTask/localTask", params);
};
//知识库上传的执行解析
export const parseDocBaseTask = (params) => {
  return post("/tas/api/buildTask/wuYaTask", params);
};
//获取知识库下拉选项
export const getLibrarys = () => {
  return get("/tas/api/buildTask/library/list", null);
};
//获取知识库文件树状结构
export const getLibrarysTree = (id: string) => {
  return get(`/tas/api/buildTask/library/${id}`, null);
};
//文件执行解析
export const parseFileList = (params) => {
  return post("/tas/api/document/parseFiles", params);
};
//查看文件解析进度
export const getFileParseProgress = (id: string) => {
  return get(`/tas/api/document/getParseSchedule/${id}`, null);
};

// ------标注
// 导出样本集
export const exportSampleSet = (id: string) => {
  return getBlob(`/tas/api/buildTask/${id}/sample/export`, null);
};
// 生成图谱
export const createGraph = (id: string) => {
  return get(`/tas/api/graph/graph/${id}`, null);
};
// ------图谱信息
// 获取图谱信息
export const getGraphInfo = (projectId: string) => {
  return get(`/tas/api/graph/graphDetail/${projectId}`, null);
};

//------图谱相关
// 根据项目创建蓝图
export const initSchema = (id: string, params) => {
  return get(`/tas/api/graph/schema/${id}`, params);
};
// 预标注
export const preAnnotation = (id: string) => {
  return get(`/tas/api/entityAnnotation/autoAnnotation/${id}`, null);
};
// 预标注进度
export const preAnnotationProcess = (id: string) => {
  return get(`/tas/api/preLabel/${id}`, null);
};

//------实体关系图Tab页面的标签管理
//查询项目的所有标签
export const gatAllProjectTag = (projectId: string) => {
  return get(`/tas/api/project/${projectId}/tag`, null);
};
//查询项目的所有实体标签
export const gatAllProjectNodeTag = (projectId: string) => {
  return get(`/tas/api/project/${projectId}/nodeTag`, null);
};
