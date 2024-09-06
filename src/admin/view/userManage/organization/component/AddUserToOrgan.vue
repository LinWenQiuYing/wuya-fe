<template>
  <el-dialog
    v-model="dialogTableVisible"
    class="dialog-page"
    :before-close="closeDialogFn"
    title="添加用户"
    width="800"
  >
    <div class="search">
      <el-input
        v-model="state.searchParams.likeMap.username"
        style="width: 250px"
        :suffix-icon="Search"
        placeholder="请输入关键字"
        size="small"
        @change="getUserListFn()"
      ></el-input>
    </div>
    <el-table :data="tableData" border height="40vh" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" />
      <el-table-column property="username" label="账号" />
      <el-table-column label="姓名" property="nickname" />
      <el-table-column label="用户角色" prop="roleNameList" />
      <el-table-column label="所属机构" prop="organName" />
    </el-table>
    <div class="footer">
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
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="closeDialogFn">取消</el-button>
        <el-button type="primary" @click="submitFn">确定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, onMounted, reactive } from "vue";
import { Search } from "@element-plus/icons-vue";
import { getUsersList } from "@/admin/api/userManage";
import { getPaginationStr } from "../../../../utils/getPaginationStr";
import { UserRecord } from "@/admin/types/api";
import { OrganizationTree } from "@/admin/types";

const emits = defineEmits(["sendCloseFn"]);
const props = defineProps<{
  current: OrganizationTree;
}>();
const dialogTableVisible = ref(true);
const tableData = ref([]);
const state = reactive({
  searchParams: {
    total: 0,
    page: 1,
    size: 10,
    likeMap: {
      username: "",
    },
  },
});
const closeDialogFn = () => {
  dialogTableVisible.value = true;
  emits("sendCloseFn", false);
};
const selectedUserIds = ref([]);
const submitFn = () => {
  dialogTableVisible.value = true;
  emits("sendCloseFn", true);
};
// 多选
const handleSelectionChange = (val) => {
  selectedUserIds.value = [];
  val.map((user) => {
    selectedUserIds.value.push(user.id);
  });
};
const handleSizeChange = (val: number) => {
  state.searchParams.size = val;
  getUserListFn();
};
const handleCurrentChange = (val: number) => {
  state.searchParams.page = val;
  getUserListFn();
};
// 查询未添加组织的用户
const getUserListFn = async () => {
  const params = {
    page: state.searchParams.page,
    size: state.searchParams.size,
    sortMap: {
      id: false,
    },
  };
  if (state.searchParams.likeMap.username) {
    params.likeMap = state.searchParams.likeMap;
  }
  const res = await getUsersList(params);
  state.searchParams.total = res.data.total;
  tableData.value = res.data.records.filter((record: UserRecord) => record.organId !== props.current?.id);
};
onMounted(() => {
  getUserListFn();
});
defineExpose({
  selectedUserIds,
});
</script>

<style lang="scss" scoped>
@import "src/styles/theme";

.search {
  width: 100%;
  margin-bottom: 20px;
  text-align: right;
}

.dialog-page {
  position: relative;

  .footer {
    display: flex;
    margin-top: 10px;
    justify-content: right;
  }
}
</style>
