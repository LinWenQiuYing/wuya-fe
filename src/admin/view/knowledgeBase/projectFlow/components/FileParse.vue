<!-- 图谱构建-项目信息 -->
<template>
  <div :class="['content_middle', 'middle_table']">
    <div class="project_item">
      <div class="item_label">解析进度<i style="color: red; margin-right: 5px">*</i></div>
      <el-progress class="item_value" :percentage="parsePercentage" color="#086DF4" />
    </div>

    <TableList :table-header="tableHeader" :table-list="tableList" :scroll-height="500" class="project_table">
      <template #state="{ scope }">
        <el-icon v-if="scope.row.state === '解析中'" style="color: #086df4"><Clock /></el-icon>
        <el-icon v-if="scope.row.state === '解析成功'" style="color: #1fcc1a"><SuccessFilled /></el-icon>
        <el-icon v-if="scope.row.state === '解析失败'" style="color: #ea3a45"><CircleCloseFilled /></el-icon>
        {{ scope.row.state }}
      </template>
    </TableList>
  </div>
</template>

<script setup lang="ts">
import { getFileParseProgress, parseFileList } from "@/admin/api/graphConstruction";
import { CircleCloseFilled, Clock, SuccessFilled } from "@element-plus/icons-vue";
import { onBeforeUnmount, onMounted, ref } from "vue";
import TableList from "../../components/TableList.vue";

const props = defineProps<{
  taskId: string;
  isParseOver: boolean;
}>();
const emits = defineEmits(["changeIsParseOver"]);

// ------文档解析
const parsePercentage = ref(0);

// 解析文档列表
const tableHeader = ref([
  {
    prop: "name",
    label: "文档名称",
    width: 360,
    template: false, // 确认使用插槽时给布尔值
  },
  {
    prop: "state",
    label: "状态",
    width: 120,
    template: true, // 确认使用插槽时给布尔值
  },
]);
const tableList = ref([]);

const timer = ref(null);

const getProgress = () => {
  if (!props.isParseOver) {
    timer.value = setInterval(async () => {
      const res = await getFileParseProgress(props.taskId);
      if (res.code === 200) {
        parsePercentage.value = res?.data?.percentage;
        tableList.value =
          res?.data?.infoDtos.map((item) => {
            return {
              ...item,
              name: item.fileName,
              state: item.parseStatus === 2 ? "解析成功" : item.parseStatus === 1 ? "解析中" : "解析失败",
            };
          }) ?? [];
        emits("changeIsParseOver", parsePercentage.value === 100);
        if (props.isParseOver) {
          clearInterval(timer.value);
        }
      }
    }, 1000);
  }
};

onMounted(() => {
  parseFileList(props.taskId);
  getProgress();
});
onBeforeUnmount(() => {
  clearInterval(timer.value);
});
</script>

<style lang="scss">
@import "src/styles/theme";
.project_table {
  .el-table__header-wrapper {
    .el-table__cell {
      background: #f0f3fa;
    }
  }
  .el-table__body-wrapper {
    .el-table__row {
      .cell {
        .el-icon {
          margin-right: 5px;
        }
        display: flex;
        align-items: center;
        color: $text-color-primary;
      }
    }
  }
}
</style>
