<template>
  <el-tree
    ref="treeRef"
    :filter-node-method="filterNode"
    :class="$style.folder_tree"
    highlight-current
    :data="treeData"
    node-key="id"
    @node-click="checkKnowledge"
    empty-text="暂无数据"
  >
    <template #default="{ data }">
      <div :class="$style.tree_label_name" :title="data.name">
        <StructureIcon :class="$style.folder_icon" />&nbsp;{{ data.name }}
      </div>
    </template>
  </el-tree>
</template>

<script lang="ts" setup>
import { OrganizationTree } from "@/admin/types";
import { FilterValue, TreeNodeData } from "element-plus/es/components/tree/src/tree.type";
import store from "@/store";
import { nextTick, onMounted, ref, watch } from "vue";
import { getAllOrgTree } from "@/admin/api/userManage";
import { selectOrgTree } from "@/admin/utils/transformList";
import StructureIcon from "@/admin/icons/structure.svg";

const treeRef = ref();
const props = defineProps<{
  search: string;
}>();
const treeData = ref<OrganizationTree[]>([]);
const emit = defineEmits(["change-type"]);
const filterNode = (value: FilterValue, data: TreeNodeData) => {
  if (!value) return true;
  return data.name.indexOf(value) !== -1;
};

const checkKnowledge = (data: OrganizationTree) => {
  emit("change-type", "list");
  store.commit("knowledge/SET_ORGANIZATION", data);
};

watch(
  () => props.search,
  (val) => {
    treeRef.value!.filter(val);
  },
);

const getOrganList = async () => {
  const res = await getAllOrgTree();
  treeData.value = selectOrgTree(res.data);

  store.commit("knowledge/SET_ORGANIZATION", treeData.value[0]);

  nextTick(() => {
    treeRef.value.setCurrentKey(treeData.value[0].id);
  });
};
onMounted(() => {
  getOrganList();
});
</script>

<style lang="scss" module>
@use "src/styles/theme";
@import "src/styles/mixins";

.tabs {
  //line-height: 24px;
  //font-weight: 700;

  :global {
    @include margin-color();
  }
}

.cardList {
  height: 100%;
  position: relative;

  :global {
    .input .el-input__inner {
      border-radius: 0;
    }

    .el-tabs__nav-wrap::after {
      background-color: inherit;
    }
  }

  .add_btn {
    position: absolute;
    top: 12px;
    right: 0;
    z-index: 10;

    &:hover {
      color: theme.$blue_color;
    }
  }

  .input {
    height: 30px;
    margin: 8px auto 6px;
    border-radius: theme.$border-radius-md;
  }
}

.folder_tree {
  height: 100%;
  background: none;
  --el-tree-node-content-height: 30px;
  --el-color-primary-light-9: rgba(8, 109, 244, 0.15);
}

.tree_label_name {
  flex: 1;
  height: 100%;
  line-height: 30px;
  color: #2d364d;
  font-weight: 400;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.circle_icon {
  width: 20px;
  height: 20px;
  cursor: pointer;
}

.folder_wrapper {
  margin-top: 6px;
  height: calc(100vh - 190px);
  overflow: auto;
}

.folder_icon {
  width: 20px;
  height: 20px;
  vertical-align: middle;
}

.tree_label_warp {
  width: calc(100% - 31px);
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  &:hover {
    .dropdown_warp {
      visibility: visible;
    }
  }
}

.label_more {
  transform: rotate(90deg);
  font-size: 14px;
  font-weight: 700;
}

.dropdown_warp {
  visibility: hidden;
}

.dropdown_btn {
  display: inline-block;
  line-height: 18px;
  height: 18px;
  padding: 0 12px;

  &:hover {
    cursor: pointer;
    background: #ecf5ff;
    color: theme.$blue_color;
  }
}
</style>
