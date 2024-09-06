<template>
  <div class="orgManage">
    <div class="orgManage-left">
      <WTree @node-click="getNodeClickFn" />
    </div>
    <div class="orgManage-right">
      <div class="orgManage-right-header">
        <div class="orgManage-right-header-l">
          <el-button type="primary" @click="addManageFn">添加用户</el-button>
          <el-button @click="moveUsersToOrganFn">移动</el-button>
          <el-button @click="delUsersFromOraganFn">删除</el-button>
        </div>
        <div class="orgManage-right-header-r">
          <el-input
            v-model="state.searchParams.likeMap!.username"
            style="width: 275px"
            placeholder="请输入关键词"
            :suffix-icon="Search"
            @change="getUsersByOrgIdFn()"
          />
        </div>
      </div>
      <div class="orgManage-right-section">
        <el-table
          :data="tableData"
          border
          :default-sort="{ prop: 'createTime', order: 'descending' }"
          height="100%"
          @selection-change="handleSelectionChange"
          @sort-change="tableSort"
        >
          <el-table-column type="selection" width="55" />
          <el-table-column label="账号" prop="username" />
          <el-table-column label="姓名" prop="nickname" />
          <el-table-column label="所属机构" prop="organName" />

          <el-table-column label="创建时间" prop="createTime" sortable>
            <template #default="{ row }">{{ getTimeStr(row.createTime) }}</template>
          </el-table-column>
          <el-table-column prop="address" label="操作">
            <template #default="scope">
              <el-link
                style="margin-right: 8px"
                link
                type="primary"
                size="small"
                @click="lookManageDetailFn(scope.row)"
                >查看角色
              </el-link>
              <el-link
                style="margin-right: 8px"
                link
                type="primary"
                size="small"
                @click="moveManageFn(scope.row)"
                >移动
              </el-link>
              <el-link
                style="margin-right: 8px"
                link
                type="primary"
                size="small"
                @click="deleteManageFn(scope.row)"
                >删除
              </el-link>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="orgManage-right-footer">
        <el-pagination
          v-model:current-page="state.searchParams.page"
          v-model:page-size="state.searchParams.size"
          :small="true"
          background
          layout="slot, prev, pager, next"
          :total="state.searchParams.total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        >
          {{ getPaginationStr(state.searchParams.page, state.searchParams.size, state.searchParams.total) }}
        </el-pagination>
      </div>
    </div>
    <WarningDialog v-if="deleteDialog" :name="currentDlt.name" @send-warning-close-fn="getCloseDialogFn" />
    <!-- 添加用户 -->
    <AddUserToOrgan
      v-if="addUserToOrganDialog"
      ref="addUserToOrganRef"
      :current="currentNode"
      @send-close-fn="getCloseFn"
    />
    <!-- 查看 -->
    <LookRolesDetailByUser
      v-if="lookRolesAboutUserDialog"
      :user-id="currentUserId"
      @send-close-fn="getAboutRolesCloseFn"
    />
    <!-- 移动 -->
    <MoveUserToOrgan
      v-if="moveTargetDialog"
      :user-ids="selectedUserIds"
      :organ-id="currentNode.id"
      @send-close-fn="getMoveTargetFn"
    />
  </div>
</template>
<script lang="ts" setup>
import { reactive, ref } from "vue";
import { delUsersUnderOrg, getUsersList, moveUsersToOrg } from "@/admin/api/userManage";
import { Search } from "@element-plus/icons-vue";
import WarningDialog from "../component/WarningDialog.vue";
import AddUserToOrgan from "./component/AddUserToOrgan.vue";
import LookRolesDetailByUser from "./component/LookRolesDetailByUser.vue";
import MoveUserToOrgan from "./component/MoveUserToOrgan.vue";
import WTree from "../component/WTree.vue";
import { getTimeStr } from "@/admin/utils/getTimeStr";
import { getPaginationStr } from "@/admin/utils/getPaginationStr";
import { UserListParams, UserRecord } from "@/admin/types/api";
import { ElMessage } from "element-plus";
import { OrganizationTree, UserSearchRecord } from "@/admin/types";

const state = reactive<{
  searchParams: UserSearchRecord;
}>({
  searchParams: {
    total: 0,
    page: 1,
    size: 10,
    sortMap: {
      create_time: false,
    },
    likeMap: {
      username: "",
    },
  },
});

const tableData = ref<UserRecord[]>([]);

const handleSizeChange = (val: number) => {
  state.searchParams.size = val;
  getUsersByOrgIdFn();
};
const handleCurrentChange = (val: number) => {
  state.searchParams.page = val;
  getUsersByOrgIdFn();
};
const deleteDialog = ref(false);
const currentDlt = ref<{ id: number[]; name: string[] }>({
  id: [],
  name: [],
});
// 删除人员
const deleteManageFn = (row: UserRecord) => {
  currentDlt.value.id = [row.id];
  currentDlt.value.name = [row.username];
  setTimeout(() => {
    deleteDialog.value = true;
  }, 100);
};
const getCloseDialogFn = (val: boolean) => {
  deleteDialog.value = false;
  if (val) {
    delUsersUnderOrg(currentDlt.value.id)
      .then((res) => {
        if (res) ElMessage.success("删除成功!");
      })
      .catch(() => {
        ElMessage.error("删除失败!");
      })
      .finally(() => {
        getUsersByOrgIdFn();
      });
  }
};
// 移动
const moveTargetDialog = ref(false);
const selectedUserIds = ref<number[]>([]);
const moveManageFn = (row: UserRecord) => {
  selectedUserIds.value = [];
  selectedUserIds.value.push(row.id);
  moveTargetDialog.value = true;
};
const getMoveTargetFn = () => {
  moveTargetDialog.value = false;
  setTimeout(() => {
    getUsersByOrgIdFn();
  }, 500);
};

// 查看人员的相关角色
const currentUserId = ref<number>();
const lookRolesAboutUserDialog = ref(false);
const lookManageDetailFn = (row: UserRecord) => {
  currentUserId.value = row.id;
  lookRolesAboutUserDialog.value = true;
};
const getAboutRolesCloseFn = () => {
  lookRolesAboutUserDialog.value = false;
};
// 多选
const handleSelectionChange = (val: UserRecord[]) => {
  selectedUserIds.value = [];
  currentDlt.value.id = [];
  currentDlt.value.name = [];
  val.map((user) => {
    selectedUserIds.value.push(user.id);
    currentDlt.value.id.push(user.id);
    currentDlt.value.name.push(user.username);
  });
};
const moveUsersToOrganFn = () => {
  if (selectedUserIds.value.length === 0) return ElMessage.warning("请勾选需要移动的人员");
  moveTargetDialog.value = true;
};
const delUsersFromOraganFn = () => {
  if (currentDlt.value.id.length === 0) return ElMessage.warning("请勾选需要删除的人员");
  setTimeout(() => {
    deleteDialog.value = true;
  }, 100);
};
const currentNode = ref();
const getNodeClickFn = async (node: OrganizationTree) => {
  currentNode.value = node;
  getUsersByOrgIdFn();
};

const getUsersByOrgIdFn = async () => {
  tableData.value = [];
  const params: UserListParams = {
    page: state.searchParams.page,
    size: state.searchParams.size,
    eqMap: {
      organ_id: currentNode.value.id,
    },
    sortMap: {
      id: state.searchParams.sortMap?.create_time || false,
    },
  };
  if (state.searchParams.likeMap!.username) {
    params.likeMap = state.searchParams.likeMap!;
  }

  if (Object.keys(state.searchParams.sortMap!).length) {
    params.sortMap = {
      ...state.searchParams.sortMap,
      id: state.searchParams.sortMap?.create_time || false,
    };
  }

  const res = await getUsersList(params);
  tableData.value = res.data.records;
  state.searchParams.total = res.data.total;
};

const tableSort = ({ prop, order }: { prop: string; order: string | null }) => {
  if (!order) {
    state.searchParams.sortMap = {};
  } else {
    state.searchParams.sortMap!.create_time = order === "ascending";
  }

  getUsersByOrgIdFn();
};

// 添加人员
const addUserToOrganDialog = ref(false);
const addManageFn = () => {
  addUserToOrganDialog.value = true;
};
const addUserToOrganRef = ref();
const getCloseFn = async (val: boolean) => {
  console.log(currentNode.value);
  if (val && addUserToOrganRef.value.selectedUserIds.length > 0) {
    await moveUsersToOrg(currentNode.value.id, addUserToOrganRef.value.selectedUserIds);
    getUsersByOrgIdFn();
  }
  addUserToOrganDialog.value = false;
};
</script>
<style scoped lang="scss">
@import "src/styles/theme";

.orgManage {
  display: flex;
  justify-content: space-between;
  height: calc(100vh - 90px);
  overflow: hidden;

  &-left {
    width: 340px;
    height: 100%;
    padding: 20px 20px 20px 0;
    overflow: auto;
    border-right: 1px solid #e0e4f1;
  }

  &-right {
    flex: 1;
    height: inherit;
    margin-left: 10px;
    padding: 20px;
    display: flex;
    flex-direction: column;

    &-header {
      height: 35px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
    }

    &-section {
      overflow: hidden;
    }

    &-footer {
      display: flex;
      justify-content: right;
      height: 50px;
    }
  }
}
</style>
