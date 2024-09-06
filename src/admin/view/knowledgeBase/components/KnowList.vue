<template>
  <el-tree
    ref="treeRef"
    :current-node-key="currentNode?.id"
    :data="treeData"
    :filter-node-method="filterNode"
    :class="$style.folder_tree"
    highlight-current
    node-key="id"
    :indent="8"
    empty-text="暂无数据"
    @node-click="checkKnowledge"
  >
    <template #default="{ data }">
      <div :class="$style.tree_label_warp">
        <div :class="$style.tree_label_name">
          <FolderIcon :class="$style.folder_icon" />&nbsp;{{ data.name }}
        </div>
        <el-dropdown
          :class="$style.dropdown_warp"
          size="small"
          trigger="click"
          @command="handleCommand($event, data)"
        >
          <el-link :class="$style.label_more" :underline="false">...</el-link>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="edit">编辑</el-dropdown-item>
              <el-dropdown-item command="delete">删除</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </template>
  </el-tree>
  <!-- 删除 -->
  <el-dialog v-model="deleteVisible" align-center title="删除" width="400px">
    <div style="display: flex">
      <WarningFilled style="height: 20px" />
      <span style="padding-left: 5px; line-height: 22px">确定要删除该历史收藏或文件夹吗? </span>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="deleteVisible = false">取消</el-button>
        <el-button type="primary" @click="delKnowledge()" :loading="delIng">确认</el-button>
      </div>
    </template>
  </el-dialog>

  <!-- 重命名 -->
  <el-dialog v-model="updateVisible" align-center title="编辑" width="400px" @close="closeEdit">
    <template #footer>
      <el-form ref="form" :model="formValue" label-width="auto">
        <el-form-item
          prop="name"
          label="名称"
          :rules="[
            {
              required: true,
              message: '请输入知识库名称',
              trigger: 'blur',
            },
          ]"
        >
          <el-input v-model="formValue.name" placeholder="请输入名称" />
        </el-form-item>
      </el-form>
      <div class="dialog-footer">
        <el-button @click="updateVisible = false">取消</el-button>
        <el-button type="primary" @click="editKnowledge()" :loading="editIng">确认</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import FolderIcon from "@/admin/icons/folder.svg";
import { computed, nextTick, onMounted, reactive, ref, watch } from "vue";
import { getFirstDir } from "@/client/api/knowSource";
import { BaseInfoProp } from "@/admin/types";
import store from "@/store";
import { FilterValue, TreeNodeData } from "element-plus/es/components/tree/src/tree.type";
import { deleteCondition, updateName } from "@/api/knowledgeRequst";
import { WarningFilled } from "@element-plus/icons-vue";
import useRequestLoading from "@/hooks/useRequestLoading";

const treeData = ref();
const form = ref();

const treeRef = ref();
const emit = defineEmits(["changeType"]);
const currentData = ref<BaseInfoProp>();
const deleteVisible = ref<boolean>(false);
const updateVisible = ref<boolean>(false);
const formValue = reactive({
  name: "",
});
const props = defineProps<{
  search: string | "";
}>();

const currentNode = computed(() => store.state.knowledge.currentData);
const getKnows = async () => {
  const res = await getFirstDir();
  const knows = res.publicTree;
  knows.sort((a, b) => {
    const dateA = new Date(a.createTime!) as any;
    const dateB = new Date(b.createTime!) as any;
    return dateB - dateA;
  });
  treeData.value = knows;
  const currentKnow = knows.find((know) => know.id === currentNode.value?.id);
  if (!currentKnow && knows.length) {
    store.commit("knowledge/SET_CURRENT_DATA", knows[0]);
    nextTick(() => {
      treeRef.value.setCurrentKey(knows[0].id);
    });
  }
};

watch(
  () => props.search,
  (val) => {
    treeRef.value!.filter(val);
  },
);

const filterNode = (value: FilterValue, data: TreeNodeData) => {
  if (!value) return true;
  return data.name.indexOf(value) !== -1;
};

const checkKnowledge = (data: BaseInfoProp) => {
  store.commit("knowledge/SET_CURRENT_DATA", data);
};

const [delFn, delIng] = useRequestLoading(deleteCondition);
const delKnowledge = async () => {
  delFn({ kbId: currentData.value!.id }).then(() => {
    getKnows();
    deleteVisible.value = false;
  });
};
const [editFn, editIng] = useRequestLoading(updateName);
const editKnowledge = async () => {
  const res = form.value.validate().catch(console.log);
  if (!res) return;
  editFn({ id: currentData.value!.id, name: formValue.name }).then(() => {
    getKnows();
    updateVisible.value = false;
  });
};

const closeEdit = () => {
  formValue.name = "";
};
const handleCommand = async (command: "edit" | "delete", data: BaseInfoProp) => {
  currentData.value = data;
  switch (command) {
    case "delete":
      return (deleteVisible.value = true);
    case "edit":
      return (updateVisible.value = true);
  }
};

onMounted(() => {
  getKnows();
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
