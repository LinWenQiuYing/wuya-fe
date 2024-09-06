import { UserManage_title } from "@/admin/types";
import User from "./UserList.vue";
import Organization from "./organization/index.vue";

export const Manage_title = [
  {
    key: UserManage_title.ORGANIZATION,
    name: "机构管理",
    components: Organization,
  },
  {
    key: UserManage_title.USER,
    name: "用户管理",
    components: User,
  },
];
