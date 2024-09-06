<template>
  <el-tree-select
    v-model="organName"
    :class="$style.select_tree_box"
    :current-node-key="organId"
    :default-checked-keys="defaultCheckedKeys"
    :default-expanded-keys="expandedKeys"
    :data="selectData"
    check-strictly
    :props="{ label: 'name' }"
    :render-after-expand="false"
    highlight-current
    node-key="id"
    placeholder="请选择机构"
    value-key="id"
    clearable
    @clear="clearSelect"
    @node-click="getNodeClick"
  >
    <template #default="{ node, data }">
      <div :class="$style.label_warp">
        <div :class="$style.icon_warp">
          <FolderOpenIcon v-if="node.expanded" :class="$style.icon_size" />
          <FolderIcon v-else :class="$style.icon_size" />
        </div>
        <div :class="$style.label_name">
          <span :class="$style.label_title">{{ data.name }}</span>
        </div>
      </div>
    </template>
  </el-tree-select>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";
import { getAllOrgTree } from "@/admin/api/userManage";
import FolderIcon from "@/admin/icons/folder.svg";
import FolderOpenIcon from "@/admin/icons/folder-open.svg";
import { AuthsProp, OrganizationTree } from "@/admin/types";
import { getTargetTree, selectOrgTree } from "@/admin/utils/transformList";

const props = defineProps<{
  organId: number;
}>();
const organName = ref();
const emits = defineEmits(["sendCurrentOrgId"]);
const expandedKeys = ref<number[]>();
const defaultCheckedKeys = ref<number[]>();
const selectData = ref<OrganizationTree[]>([]);

const getNodeClick = (data: AuthsProp) => {
  emits("sendCurrentOrgId", data.id);
};

const clearSelect = () => {
  emits("sendCurrentOrgId", "");
};

// 获取所有机构
const getSelectData = async () => {
  const treeData = await getAllOrgTree();
  selectData.value = selectOrgTree(treeData.data);
};

const getParentIdsAndNames = (
  data: OrganizationTree[],
  targetId: number,
  ids: number[] = [],
  names: string[] = [],
): [number[], string[]] => {
  const target = getTargetTree(data, targetId)!;
  if (target) {
    ids.unshift(target.id);
    names.unshift(target.name);
    if (target.parentId) {
      return getParentIdsAndNames(data, target.parentId, ids, names);
    }
  }

  return [ids, names];
};

watch(
  () => props.organId,
  async () => {
    if (!selectData.value.length) {
      await getSelectData();
    }

    if (props.organId) {
      const [targetIds, targetNames] = getParentIdsAndNames(selectData.value, props.organId);
      targetIds.splice(targetIds.length - 1, 1); // 当前选中的不展开
      expandedKeys.value = targetIds;
      defaultCheckedKeys.value = targetIds;
      organName.value = targetNames.join("/");
    }
  },
  { immediate: true },
);
</script>

<style lang="scss" module>
@import "src/styles/theme";

.select_tree_box {
  --el-tree-node-content-height: 50px;

  :global(.el-tree-node__content .el-select-dropdown__item) {
    height: 50px;
    line-height: 50px;
  }
}

.tree_options {
  height: 50px;
}

.label_warp {
  display: flex;

  .icon_warp {
    height: 50px;
    line-height: 50px;
    display: flex;
    align-items: center;

    .icon_size {
      height: 22px;
    }
  }
}

.label_name {
  flex: 1;
  height: 50px;
  margin-left: 5px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.label_title {
  height: 14px;
  line-height: 14px;
  font-size: 14px;
  color: #2d364d;
}

.label_code {
  height: 12px;
  line-height: 12px;
  font-size: 12px;
  color: #6d7587;
}
</style>
