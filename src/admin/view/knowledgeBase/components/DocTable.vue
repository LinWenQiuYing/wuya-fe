<template>
  <div class="list-content">
    <el-config-provider :locale="zhCn">
      <el-table
        border
        class="doc-table"
        :data="tableList.slice((currentPage - 1) * pageSize, currentPage * pageSize)"
        highlight-current-row
        :key="props.isUpdate"
        row-key="id"
        max-height="600"
        :lazy="!!loadNode"
        :load="loadNode"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        @row-click="changeRow"
        :row-style="getRowHighlight"
        :expand-row-keys="expandKeys"
        @expand-change="handleExpand"
      >
        <el-table-column :resizable="false" label="文档名" prop="name" show-overflow-tooltip>
          <template #header>
            <el-space>
              <span>文档名</span>
              <FilterIcon :class="isFilter && 'filter-icon-bg'" class="status-icon" @click="checkType" />
            </el-space>
          </template>
          <template #default="{ row }">
            <el-input
              v-if="row.category === 1 && !row.name"
              ref="inputRef"
              v-model="folderName"
              style="max-width: 130px"
              placeholder="请输入文件夹名"
              class="input"
              @keyup.enter="(e: KeyboardEvent) => handleKeyEnter(e, () => (<HTMLElement>e.target).blur())"
              @blur="() => setFolderName(row)"
            ></el-input>
            <span v-else>{{ row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column
          :resizable="false"
          label="状态"
          prop="fileStatus"
          :filters="filterStatus"
          :filter-method="filterFileStatus"
        >
          <template #default="{ row }: { row: ListType }">
            <div v-if="row.category !== 1 && row.fileStatus">
              <component
                :is="getUploadStatusIcon(row.fileStatus, true)[0]"
                class="status-icon"
                :class="getUploadStatusIcon(row.fileStatus, true)[1]"
              />

              {{
                DocUploadStatus.get(
                  [StatusNumber.parse_success, StatusNumber.edited].includes(row.fileStatus)
                    ? StatusNumber.saved
                    : row.fileStatus,
                )
              }}
            </div>
          </template>
        </el-table-column>
        <el-table-column :resizable="false" label="创建时间" show-overflow-tooltip>
          <template #default="{ row }">
            <div v-if="row.category !== 1">{{ row.createTime }}</div>
          </template>
        </el-table-column>
        <el-table-column :resizable="false" label="操作" prop="operation">
          <template #default="{ row }">
            <slot v-if="!row.noDel" :data="row" name="btnName"></slot>
            <slot v-if="!row.noDel" :data="row" name="edit"></slot>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        class="pagination"
        background
        layout="slot, prev, pager, next"
        :current-page="currentPage"
        :page-size="pageSize"
        :total="tableList.length"
        @current-change="handleCurrentChange"
      >
        <div>
          {{ getPaginationStr(currentPage, pageSize, tableList.length) }}
        </div>
      </el-pagination>
    </el-config-provider>
  </div>
</template>

<script lang="ts" setup>
import { TypeFileOrFolderState } from "@/admin/types";
import { computed, ref, watch } from "vue";
import { DocUploadStatus, filterStatus, StatusNumber } from "../const";
import { getPaginationStr } from "@/admin/utils/getPaginationStr";
import FilterIcon from "@/admin/icons/filter.svg";
import getKeyData from "@/admin/utils/getKeyData";
import { getUploadStatusIcon } from "@/utils/getUploadStatusIcon";
import { addFolder } from "@/api/knowledgeRequst";
import zhCn from "element-plus/es/locale/lang/zh-cn";
import { TableLazyFolderOrFile } from "@/api/type";
import { TreeNode } from "element-plus";
import handleKeyEnter from "@/client/utils/handleKeyEnter";

type ListType = TableLazyFolderOrFile | TypeFileOrFolderState;
const props = defineProps<{
  tableData: Array<ListType>;
  loadNode?: (
    row: TableLazyFolderOrFile,
    node: TreeNode,
    resolve: (data: TableLazyFolderOrFile[]) => void,
  ) => void;
  loadMap?: Map<
    number,
    { row: TableLazyFolderOrFile; node: TreeNode; resolve: (data: TableLazyFolderOrFile[]) => void }
  >;
  isUpdate?: boolean;
  searchValue: string;
}>();
const currentPage = ref<number>(1);
const tableList = computed<Array<ListType>>(() => {
  return getDocName(props.searchValue, props.tableData);
});
const pageSize = ref<number>(10);
const currentRow = defineModel<ListType>("currentRow");
const isFilter = defineModel<boolean>("isFilter");
const folderName = ref<string>("");
const inputRef = ref();
const expandKeys = defineModel<string[]>("expendKeys");

const handleCurrentChange = (val: number) => {
  currentPage.value = val;
};

const setFolderName = async (column: TableLazyFolderOrFile) => {
  if (folderName.value.trim()) {
    const data = getKeyData(props.tableData, "id", column.id)!;
    const res = await addFolder({ name: folderName.value, parentId: column.parentId });
    data.name = folderName.value;
    data.id = res.data.id;
    if (props.loadMap?.has(column.parentId)) {
      const { row, node, resolve } = props.loadMap?.get(column.parentId)!;
      props.loadNode!(row, node, resolve);
    }

    folderName.value = "";
  } else {
    const data = getKeyData(props.tableData, "id", column.parentId);
    if (data) {
      const idx = data.children!.findIndex((d) => d.id === column.id);
      data.children!.splice(idx, 1);
    } else {
      const idx = props.tableData.findIndex((d) => d.id === column.id);
      props.tableData.splice(idx, 1);
    }
  }
};

const changeRow = (row: TableLazyFolderOrFile) => {
  currentRow.value = row;
};

function getDocName<T extends ListType>(val: string, data: T[]): T[] {
  const getName = (data: T[]): T[] => {
    const res: T[] = [];
    data.forEach((d) => {
      const lowerCaseVal = val.toLocaleLowerCase();
      const lowerCaseName = d.name.toLocaleLowerCase();
      const isMatch = lowerCaseName.indexOf(lowerCaseVal) !== -1;
      let filteredChildren;
      if (d.children) filteredChildren = getName(d.children as T[]);
      if (isMatch || (filteredChildren && filteredChildren.length > 0)) {
        res.push({
          ...d,
          children: filteredChildren,
        });
      }
    });
    return res;
  };
  return getName(data);
}

const filterFileStatus = (val: string, row: ListType) => {
  if (!row.fileStatus) return false;
  const [_, state] = getUploadStatusIcon(row.fileStatus);
  return val === state;
};

const getRowHighlight = ({ row }: { row: ListType }) => {
  if (currentRow.value?.id === row.id) {
    return {
      background: "#ecf5ff",
    };
  }
  return null;
};

const handleExpand = (row: ListType, expanded: boolean) => {
  if (expanded) {
    expandKeys.value!.push(row.id + "");
  } else {
    expandKeys.value = expandKeys.value!.filter((id) => id !== row.id + "");
  }
};

const checkType = () => {
  isFilter.value = !isFilter.value;
};

watch(inputRef, (val) => {
  if (val) {
    val.focus();
  }
});
</script>

<style lang="scss" scoped>
@import "src/styles/theme";
.list-content {
  max-height: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  .doc-table {
    flex: 1;
  }
  .pagination {
    height: 32px;
    margin-top: 20px;
  }

  .status-icon {
    width: 16px;
    height: 16px;
    vertical-align: text-bottom;
    outline: 0 !important;
  }

  .success {
    fill: $green_color;
  }
}

.popover-wrapper {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.filter-icon-bg {
  fill: $blue_color;
}
</style>
