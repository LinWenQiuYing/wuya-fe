import { post } from "@/utils/reqMethod";
import { AuthsParams } from "@/admin/types/api";
import { basePrefix } from "@/utils/reqPrefix";

// 设置或修改权限
export const setKnowAuth = (id: number, params: AuthsParams[]) => {
  return post(`${basePrefix}/kb-organ-permission/update?kbId=${id}`, params);
};
