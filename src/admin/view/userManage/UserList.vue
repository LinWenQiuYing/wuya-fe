<template>
  <div class="container_box">
    <div class="operation_box">
      <el-button type="primary" @click="checkModel">添加用户</el-button>
    </div>
    <div class="table_list">
      <el-table :data="tableData" @sort-change="tableSort" border>
        <el-table-column label="账号" prop="username">
          <template #header="{ column }">
            <div class="table-column-search">
              <span style="width: 40px">账号</span>
              <el-input
                v-model="searchParams.likeMap!.username!"
                :suffix-icon="Search"
                placeholder="请输入关键字"
                size="small"
                @change="getUserListFn()"
              />
            </div>
          </template>
        </el-table-column>
        <el-table-column label="姓名" prop="nickname">
          <template #header="{ column }">
            <div class="table-column-search">
              <span style="width: 40px">姓名</span>
              <el-input
                v-model="searchParams.likeMap!.nickname"
                :suffix-icon="Search"
                placeholder="请输入关键字"
                size="small"
                @change="getUserListFn()"
              />
            </div>
          </template>
        </el-table-column>
        <el-table-column label="邮箱" prop="email">
          <template #header="{ column }">
            <div class="table-column-search">
              <span style="width: 40px">邮箱</span>
              <el-input
                v-model="searchParams.likeMap!.email"
                :suffix-icon="Search"
                placeholder="请输入关键字"
                size="small"
                @change="getUserListFn()"
              />
            </div>
          </template>
        </el-table-column>
        <el-table-column label="用户状态" prop="status" sortable>
          <template #default="{ row }">
            <el-switch
              v-model="row.enable"
              :active-value="true"
              :inactive-value="false"
              @change="changeSwitchStatusFn(row)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" prop="createTime" sortable>
          <template #default="{ row }">{{ getTimeStr(row.createTime) }}</template>
        </el-table-column>
        <el-table-column prop="options" label="操作">
          <template #default="scope">
            <div class="options_btn">
              <el-link
                style="margin-right: 8px"
                link
                type="primary"
                size="small"
                @click="editUserFn(scope.row)"
                >编辑
              </el-link>
              <el-link
                style="margin-right: 8px"
                link
                type="primary"
                size="small"
                @click="resetPwdFn(scope.row)"
                >重置密码</el-link
              >
              <el-link
                style="margin-right: 8px"
                link
                type="primary"
                size="small"
                @click="deleteUserFn(scope.row)"
                >删除</el-link
              >
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="table_footer">
      <el-pagination
        v-model:current-page="searchParams.page"
        v-model:page-size="searchParams.size"
        :small="true"
        background
        layout="slot, prev, pager, next"
        :total="searchParams.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      >
        {{ getPaginationStr(searchParams.page, searchParams.size, searchParams.total) }}
      </el-pagination>
    </div>
    <el-dialog v-model="passwordDialog" title="重置密码" width="800">
      <el-form ref="resetPwdRef" style="max-width: 800px" :model="resetPwd" label-width="130">
        <el-form-item
          prop="password"
          label="密码"
          :rules="[
            {
              required: true,
              message: '请输入密码',
              trigger: 'blur',
            },
          ]"
        >
          <el-input v-model="resetPwd.password" placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item
          prop="rePassword"
          label="确认密码"
          :rules="[
            {
              required: true,
              message: '请输入确认密码',
              trigger: 'blur',
            },
          ]"
        >
          <el-input v-model="resetPwd.rePassword" placeholder="请输入确认密码"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="passwordDialog = false">取消</el-button>
          <el-button type="primary" @click="resetPwdSubmit(resetPwdRef)">确定</el-button>
        </div>
      </template>
    </el-dialog>
    <WarningDialog v-if="deleteDialog" :name="currentDlt.name" @send-warning-close-fn="getCloseDialogFn" />
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { Search } from "@element-plus/icons-vue";
import { Show_state, UserSearchRecord } from "@/admin/types";
import { delUsersUnderOrg, editUserStatus, getUsersList, resetUserPwd } from "@/admin/api/userManage";
import { ElMessage, ElForm } from "element-plus";
import WarningDialog from "./component/WarningDialog.vue";
import { getTimeStr } from "@/admin/utils/getTimeStr";
import { getPaginationStr } from "@/admin/utils/getPaginationStr";
import encrypt from "@/sign/utils/encrypt";
import { UserListParams, UserRecord } from "@/admin/types/api";

const tableData = ref<UserRecord[]>([]);
const emit = defineEmits(["change-state"]);
const searchParams = ref<UserSearchRecord>({
  total: 0,
  page: 1,
  size: 10,
  sortMap: {
    create_time: false,
    status: false,
    id: false,
  },
  likeMap: {
    username: "",
    nickname: "",
    email: "",
  },
});
const deleteDialog = ref(false);
const currentDlt = ref<{ id: number | undefined; name: string }>({
  id: undefined,
  name: "",
});
const resetPwdRef = ref<InstanceType<typeof ElForm>>();
const passwordDialog = ref(false);
const resetPwd = ref<{
  id: undefined | number;
  password: string;
  rePassword: string;
}>({
  id: undefined,
  password: "",
  rePassword: "",
});

const checkModel = () => {
  emit("change-state", {
    status: Show_state.EDIT,
    data: null,
  });
};

const deleteUserFn = (row: UserRecord) => {
  currentDlt.value.id = row.id;
  currentDlt.value.name = row.nickname;
  deleteDialog.value = true;
};
const getCloseDialogFn = (val: boolean) => {
  deleteDialog.value = false;
  if (val) {
    delUsersUnderOrg([currentDlt.value.id])
      .then((res) => {
        if (res) ElMessage.success("删除成功!");
      })
      .catch(() => {
        ElMessage.error("删除失败!");
      })
      .finally(() => {
        getUserListFn();
      });
  }
};
const editUserFn = (row: UserRecord) => {
  emit("change-state", {
    status: Show_state.EDIT,
    data: row,
  });
};

const resetPwdFn = (row: UserRecord) => {
  resetPwd.value.id = row.id;
  passwordDialog.value = true;
};
const resetPwdSubmit = async (formEl: InstanceType<typeof ElForm>) => {
  if (!formEl) return;
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      if (resetPwd.value.password !== resetPwd.value.rePassword)
        return ElMessage.error("两次输入密码不一致，请重新输入");
      const params = {
        uid: resetPwd.value.id,
        password: encrypt(resetPwd.value.password),
      };
      resetUserPwd(params).then(() => {
        ElMessage.success("重置成功!");
      });
      passwordDialog.value = false;
    } else {
      console.log("error submit!", fields);
    }
  });
};

const handleSizeChange = (val: number) => {
  searchParams.value.size = val;
  getUserListFn();
};

const handleCurrentChange = (val: number) => {
  searchParams.value.page = val;
  getUserListFn();
};

const getUserListFn = async () => {
  const params: UserListParams = {
    page: searchParams.value.page,
    size: searchParams.value.size,
    sortMap: {
      id: searchParams.value.sortMap?.create_time || false,
    },
  };
  const likeKeys = Object.keys(searchParams.value.likeMap!) as Array<"username" | "nickname" | "email">;
  likeKeys.forEach((key) => {
    if (searchParams.value.likeMap![key]) {
      if (!params.likeMap) params.likeMap = {} as UserListParams["likeMap"];
      params.likeMap![key] = searchParams.value.likeMap![key]!;
    }
  });
  const sortKeys = Object.keys(searchParams.value.sortMap!) as Array<"create_time" | "status">;
  sortKeys.forEach((key: "create_time" | "status") => {
    if (typeof searchParams.value.sortMap![key] === "boolean") {
      if (!params.sortMap) params.sortMap = {} as UserListParams["sortMap"];
      params.sortMap![key] = searchParams.value.sortMap![key]!;
    }
  });

  const res = await getUsersList(params);
  searchParams.value.total = res.data.total;
  tableData.value = res.data.records;
};

const changeSwitchStatusFn = async (val: UserRecord) => {
  let msg = val.enable ? "启用" : "禁用";
  await editUserStatus({ userId: val.id, enable: val.enable })
    .then((res) => {
      ElMessage.success(msg + "成功");
    })
    .finally(() => {
      getUserListFn();
    });
};

const tableSort = ({ prop, order }: { prop: "createTime" | "status"; order: string | null }) => {
  const key: "create_time" | "status" = prop === "createTime" ? "create_time" : prop;
  if (!order) {
    searchParams.value.sortMap = {} as Record<"create_time" | "status", boolean>;
  } else {
    const value = order === "ascending";
    searchParams.value.sortMap = {
      [key]: value,
    };
  }
  getUserListFn();
};

onMounted(() => {
  getUserListFn();
});
</script>

<style scoped lang="scss">
@import "../../../styles/theme";
.container_box {
  position: relative;
  padding-top: 20px;
  height: calc(100vh - 150px);

  .operation_box {
    display: flex;
    justify-content: space-between;
  }

  .table_list {
    margin-top: 16px;
    width: 100%;

    .options_btn {
      display: flex;
    }
  }

  .table_footer {
    position: absolute;
    right: 10px;
    margin-top: 10px;
  }
}

.table-column-search {
  display: flex;
  align-items: center;
}

:deep(.operation_box .el-input__inner) {
  border-radius: 0;
}
</style>
