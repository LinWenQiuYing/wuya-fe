<template>
  <div class="table_list">
    <el-table
      border
      ref="tableListRef"
      :data="tableList"
      class="table_list_table"
      :height="`calc(100vh - ${scrollHeight}px)`"
      :highlight-current-row="isCurrentHighLight && true"
      @current-change="clickRow"
      empty-text="暂无数据"
    >
      <!-- :height="'calc(100vh - 380px)'" -->
      <el-table-column
        v-for="(property, index) in tableHeader"
        :key="index"
        :label="property.label"
        :prop="property.prop"
        :width="property.width"
        show-overflow-tooltip
      >
        <template #empty>
          <el-empty description="暂无数据" :image-size="100" />
        </template>
        <template v-if="property.template" #default="scope">
          <slot :name="property.prop" :scope="scope"></slot>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-if="show"
      class="table_list_pagination"
      layout="slot, prev, pager, next"
      :current-page="state.pageNum"
      :page-size="state.pageSize"
      :total="state.total"
      @current-change="handleCurrentChange"
    >
      <div>
        {{ getPaginationStr(state.pageNum, state.pageSize, state.total) }}
      </div>
    </el-pagination>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from "vue";
import { getPaginationStr } from "@/admin/utils/getPaginationStr";

const tableListRef = ref(null);

type PaginationState = {
  pageNum: number;
  total: number;
  pageSize: number;
};

interface TableHeaderState {
  prop: string;
  label: string;
  width: number;
  template: boolean;
}

const props = defineProps<{
  tableList?: unknown[];
  tableHeader?: TableHeaderState[];
  show?: boolean;
  scrollHeight?: number;
  layout?: string;
  state?: PaginationState;
  isCurrentHighLight?: boolean;
}>();

const state = computed(() => {
  return (
    props.state ?? {
      total: 1,
      pageNum: 1,
      pageSize: 10,
    }
  );
});
const layout = computed(() => props.layout ?? "total, sizes, prev, pager, next, jumper");
const scrollHeight = computed(() => props.scrollHeight ?? 0);
const show = computed(() => props.show ?? false);
const isCurrentHighLight = computed(() => props.isCurrentHighLight ?? false);
const tableList = computed(() => props.tableList ?? []);
const tableHeader = computed(() => props.tableHeader ?? []);

const emits = defineEmits(["handleCurrentChange", "annotationSelectChange"]);

const handleCurrentChange = (val: number) => {
  emits("handleCurrentChange", val);
};
const clickRow = (row: any) => {
  emits("annotationSelectChange", row.id);
};
const setDefaultCurrentRow = (rowData: any) => {
  tableListRef.value.setCurrentRow(rowData, true);
};

onMounted(() => {});
defineExpose({
  setDefaultCurrentRow,
});
</script>

<style lang="scss" scoped>
@import "src/styles/theme";

.table_list {
  width: 100%;
  height: 100%;

  &_table {
    width: 100%;
  }
}
</style>
