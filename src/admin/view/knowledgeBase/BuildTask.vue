<template>
  <div class="contructionTask">
    <div class="taskList">
      <div class="hanldeZone">
        <el-button type="primary" @click="goProjectFlow">新建构建任务</el-button>
      </div>
    </div>
    <div class="taskTable">
      <el-config-provider :locale="zhCn">
        <el-table
          :data="state.tableDataFilter"
          style="width: 100%; height: calc(100vh - 290px)"
          class="marginT20"
          border
          @sort-change="sortChange"
          @filter-change="filterChange"
          empty-text="暂无数据"
        >
          <el-table-column prop="taskName" label="名称" width="250px" show-overflow-tooltip>
            <template #header>
              <div class="tableCell_name">
                <span style="margin-right: 8px">名称</span>
                <el-popover
                  v-model:visible="state.cellInputVisible"
                  placement="bottom-start"
                  :width="200"
                  trigger="click"
                >
                  <el-input
                    v-model="state.cellInputValue"
                    placeholder="请输入名称"
                    maxlength="50"
                    style="width: 100%; height: 32px"
                  />
                  <div class="tableCell_handleBtn">
                    <el-button plain size="small" @click="resetForm">重置</el-button>
                    <el-button type="primary" size="small" @click="searchName">搜索</el-button>
                  </div>
                  <template #reference>
                    <Search style="width: 16px; color: #2d364d; cursor: pointer; outline: none" />
                  </template>
                </el-popover>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="状态" width="200px" :filters="statusFilters">
            <template #default="scope">
              <span>{{ formatStatus(scope.row.status) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="updateTime" label="新建时间" width="200px" sortable></el-table-column>
          <el-table-column prop="remark" label="描述" show-overflow-tooltip></el-table-column>
          <el-table-column label="操作" width="120">
            <template #default="scope">
              <span
                v-if="scope.row.status > 1"
                class="handleBtn"
                @click="checkDetail(scope.row.status, scope.row.id)"
                >查看</span
              >
            </template>
          </el-table-column>
        </el-table>
      </el-config-provider>
    </div>

    <div class="pageBox">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        layout="slot, prev, pager, next"
        :total="total"
        @current-change="handleCurrentChange"
      >
        <div>
          {{ getPaginationStr(currentPage, pageSize, total) }}
        </div>
      </el-pagination>
    </div>
  </div>
</template>
<script setup lang="ts">
import { getBuildTaskByPage } from "@/admin/api/graphConstruction";
import { deepCopy } from "@/admin/utils/deepCopy";
import { Search } from "@element-plus/icons-vue";
import zhCn from "element-plus/es/locale/lang/zh-cn";
import { computed, onMounted, reactive, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { getPaginationStr } from "@/admin/utils/getPaginationStr";

interface Titles {
  name: string;
  status: string;
  createTime: string;
  des: string;
}

const route = useRoute();
const router = useRouter();

const props = defineProps<{
  currentProjectId: string;
}>();

// todo
const goProjectFlow = () => {
  router.push({
    path: "/admin/knowledge/projectFlow",
    query: {
      projectId: state.projectId,
      status: 1,
    },
  });
};

const statusFilters: any = ref([
  { text: "上传中", value: 1 },
  { text: "解析中", value: 2 },
  { text: "标注中", value: 3 },
  { text: "构建图谱中", value: 4 },
  { text: "构建完成", value: 5 },
]);
const currentPage = ref(1);
const pageSize = ref(20);
const total = ref(0);
const state = reactive({
  projectId: computed(() => props.currentProjectId),
  cellInputValue: "",
  cellInputVisible: false,
  status: [],
  order: 0,
  tableData: [],
  tableDataFilter: [],
});

const getTaskListByPage = async () => {
  const params = {
    projectId: state.projectId,
    pageNo: currentPage.value,
    pageSize: pageSize.value,
    taskName: state.cellInputValue,
    status: state.status,
    order: state.order,
  };
  const res: any = await getBuildTaskByPage(params);
  state.tableData = res.data.records;
  total.value = res.data.totalCount;
  state.tableDataFilter = deepCopy(state.tableData);
};
const searchName = () => {
  state.cellInputVisible = false;

  getTaskListByPage();
};

watch(
  () => props.currentProjectId,
  () => {
    getTaskListByPage();
  },
);

const handleCurrentChange = (value: number) => {
  currentPage.value = value;
  getTaskListByPage();
};
const resetForm = () => {
  // state.tableDataFilter = state.tableData;
  state.cellInputVisible = false;
  state.cellInputValue = "";
  getTaskListByPage();
};
const filterChange = (obj: any) => {
  // console.log(obj, Object.values(obj), obj["el-table_1_column_2"]);
  const arr: any = Object.values(obj)[0];
  state.status = [...arr];
  // state.status = obj["el-table_1_column_2"];
  getTaskListByPage();
};
// const statusFilterHandler = (value: any, row: Titles) => {
//   return row.status === value;
// };
const sortChange = (obj: any) => {
  if (obj.order === "ascending") {
    state.order = 1;
  } else if (obj.order === "descending") {
    state.order = 2;
  } else {
    state.order = 0;
  }
  getTaskListByPage();
  return false;
};

const checkDetail = (status: number, id: string) => {
  router.push({
    path: "/admin/knowledge/projectFlow",
    query: {
      projectId: state.projectId,
      taskId: id,
      status,
    },
  });
};

const formatStatus = (status: number) => {
  switch (status) {
    case 1:
      return "上传中";
    case 2:
      return "解析中";
    case 3:
      return "标注中";
    case 4:
      return "构建图谱中";
    case 5:
      return "构建成功";
    default:
      break;
  }
};
onMounted(() => {
  getTaskListByPage();
});
</script>

<style lang="scss" scoped>
@import "../../../styles/theme";

.contructionTask {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  .handleBtn {
    color: #409eff;
    cursor: pointer;
  }
  .tableCell_name {
    display: flex;
    justify-content: flex-start;
  }
  .pageBox {
    width: 100%;
    display: flex;
    justify-content: flex-end;
  }
}
.flexAlign {
  display: flex;
  align-items: center;
}
.marginT20 {
  margin-top: 20px;
}

.tableCell_handleBtn {
  margin-top: 5px;
  width: 100%;
  text-align: right;
}
// tabs
:deep(.el-tabs#graphInfoTabs .el-tabs__item) {
  margin-left: 10px;
  color: #6d7587;
}
:deep(.el-tabs#graphInfoTabs .el-tabs__item.is-active) {
  color: #2d364d;
  font-weight: bold;
}
:deep(.el-tabs#graphInfoTabs .el-tabs__nav-wrap::after) {
  height: 1px;
  background-color: #e0e4f1;
}
// table
:deep(.el-table#graphInfoTable .el-table__header-wrapper .el-table__header thead tr th) {
  background-color: #f0f3fa;
  color: #2d364d;
}
:deep(.el-table#graphInfoTable .el-table__header-wrapper .el-table__header thead tr th .cell) {
  line-height: 32px;
}
:deep(.el-table#graphInfoTable td.el-table__cell div) {
  color: #2d364d;
}
// iconfont-Unicode 引入方法
@font-face {
  font-family: "iconfont"; /* Project id 4129675 */
  src:
    url("//at.alicdn.com/t/c/font_4129675_vvzl2i0vxai.woff2?t=1709794156166") format("woff2"),
    url("//at.alicdn.com/t/c/font_4129675_vvzl2i0vxai.woff?t=1709794156166") format("woff"),
    url("//at.alicdn.com/t/c/font_4129675_vvzl2i0vxai.ttf?t=1709794156166") format("truetype");
}
:deep(.el-table#graphInfoTable .el-table__column-filter-trigger i.el-icon:before) {
  font-family: "iconfont" !important;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-style: normal;
  content: "\e60d";
  font-size: 18px;
  margin-top: -2px;
}

::v-deep .el-table-filter__bottom {
  display: flex;
  justify-content: space-between;
}
</style>
