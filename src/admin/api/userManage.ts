import { get, post } from "@/utils/reqMethod";
import { OrganizationProp, UserListParams, UserListProp } from "@/admin/types/api";
import { Api } from "@/admin/api/index";
import { basePrefix, userPrefix } from "@/utils/reqPrefix";

/** 用户管理 */
// 查询用户管理处用户列表信息
export const getUsersList = (params: UserListParams): Promise<Api<UserListProp>> => {
  return post<UserListProp>(`${userPrefix}/user/admin/all`, params);
};

export const editUser = (params) => {
  return post(`${userPrefix}/user/admin/update`, params);
};

export const editUserStatus = (params) => {
  return get(`${userPrefix}/user/admin/enable`, params);
};
export const addUser = (params) => {
  return post(`${userPrefix}/user/admin/add`, params);
};
export const resetUserPwd = (params) => {
  return get(`${userPrefix}/user/admin/reset`, params);
};
// 查询角色
export const getRolesList = () => {
  return get(`${userPrefix}/admin/role/all`, null);
};
export const getRoleByUserId = (userId) => {
  return get(`/studio/api/auth/v1/user/detail/${userId}`, null);
};

export const getUserDetail = (id: number) => {
  return get(`${userPrefix}/user/admin/info?id=${id}`, null);
};

export const getAllOrgTree = (id?: number): Promise<Api<OrganizationProp>> => {
  return get<OrganizationProp>(`${basePrefix}/kb-organ-permission/tree`, { kbId: id });
};
// 添加机构
export const addOrgan = (params) => {
  return post(`${userPrefix}/organ/admin/add`, params);
};
export const deleteOrgan = (id: number) => {
  return get(`${userPrefix}/organ/admin/del?id=${id}`, null);
};
export const editOrgan = (params) => {
  return post(`${userPrefix}/organ/admin/rename`, params);
};
export const moveOrgan = (params) => {
  return get(`${userPrefix}/organ/admin/move`, params);
};

// 移动批量用户到某个机构下
export const moveUsersToOrg = (orgId: number, params: number[]) => {
  return post(`${userPrefix}/user/admin/update-organ?organId=${orgId}`, params);
};
// 删除机构下的用户
export const delUsersUnderOrg = (params: number[]) => {
  return post(`${userPrefix}/user/admin/del`, params);
};
