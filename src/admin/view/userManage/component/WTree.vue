<template>
  <div class="wTree">
    <el-tree
      ref="treeRef"
      node-key="id"
      :data="treeData"
      :props="defaultProps"
      :expand-on-click-node="false"
      @node-click="nodeClickFn"
      highlight-current
      style="background: none"
    >
      <template #default="scope">
        <div class="custom-node">
          <div class="custom-node-left">
            <p class="icon-warp">
              <FolderOpenIcon v-if="scope.node.expanded" class="iconSize" />
              <FolderIcon v-else class="iconSize" />
            </p>
            <div class="custom-node-title">
              <el-tooltip :content="scope.node.label" effect="dark" placement="top">
                <h6 class="custom-node-title-top">{{ scope.node.label }}</h6>
              </el-tooltip>
              <!--              <span class="custom-node-title-bottom">{{ scope.node.data.code }}</span>-->
            </div>
          </div>
          <div v-if="props.isShowHandle" class="custom-node-right">
            <el-tooltip content="新增" effect="dark" placement="top">
              <el-icon class="icon" style="margin-right: 5px" @click="addOrganFn(scope.node)">
                <FolderAdd />
              </el-icon>
            </el-tooltip>
            <el-dropdown
              v-if="scope.node.level !== 1"
              size="small"
              @command="handleCommand($event, scope.node)"
            >
              <el-link :underline="false" class="more">...</el-link>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="edit">编辑</el-dropdown-item>
                  <el-dropdown-item command="move">移动</el-dropdown-item>
                  <el-dropdown-item command="delete">删除</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </div>
      </template>
    </el-tree>
    <el-dialog
      v-model="addOrgDialog"
      :title="orgDialogStatus ? '添加机构' : '编辑机构'"
      width="800"
      @close="resetData()"
    >
      <el-form ref="addOrganRef" style="max-width: 500px" :model="state.addOrgData" label-width="100px">
        <el-form-item
          prop="name"
          label="机构名称"
          :rules="[
            {
              required: true,
              message: '请添加机构名称',
              trigger: 'blur',
            },
          ]"
        >
          <el-input v-model="state.addOrgData.name" placeholder="请输入机构名称" />
        </el-form-item>
        <el-form-item
          v-if="orgDialogStatus"
          :rules="[
            {
              required: true,
              message: '请选择机构',
              trigger: 'blur',
            },
          ]"
          label="上级机构"
          placeholder="请添加机构"
          prop="organId"
        >
          <div class="treeSelectCom">
            <WTreeSelect :organ-id="state.addOrgData.organId" @send-current-org-id="getCurrentOrgId" />
          </div>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="addOrgDialog = false">取消</el-button>
          <el-button type="primary" @click="addOrganSubmitFn(addOrganRef)">确定</el-button>
        </div>
      </template>
    </el-dialog>
    <WarningDialog
      v-if="delOrganDialog"
      :name="state.delOrgData.name"
      type="机构"
      @send-warning-close-fn="getWarningCloseFn"
    />
    <WTreeDialog
      v-if="moveOrgDialog"
      :organ-id="state.moveOrgData.id"
      @send-close-fn="getCloseMoveDialogFn"
    />
    <el-dialog v-model="disableDltVisible" :show-close="false" width="400">
      <div class="disable-dlt-box">
        <div class="icon">
          <DeleteIcon />
        </div>
        <div class="del-title">
          <span>删除机构提醒</span>
          <p>不允许删除，需要先将子机构和用户移动到其他机构下，才可以删除这个机构</p>
        </div>
      </div>
      <template #footer>
        <div class="btn">
          <el-button @click="disableDltVisible = false">取消</el-button>
          <el-button type="primary" @click="disableDltVisible = false">确认</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from "vue";
import { FolderAdd } from "@element-plus/icons-vue";
import WarningDialog from "./WarningDialog.vue";
import WTreeDialog from "./WTreeDialog.vue";
import WTreeSelect from "./WTreeSelect.vue";
import { deleteOrgan, addOrgan, editOrgan, getAllOrgTree } from "@/admin/api/userManage";
import FolderOpenIcon from "@/admin/icons/folder-open.svg";
import FolderIcon from "@/admin/icons/folder.svg";
import DeleteIcon from "@/admin/icons/delete.svg";
import { getTargetTree, selectOrgTree } from "@/admin/utils/transformList";
import { OrganizationTree } from "@/admin/types";
import { ElMessage } from "element-plus";

const treeRef = ref(null);
const emits = defineEmits(["node-click"]);
const disableDltVisible = ref<boolean>(false);

const orgDialogStatus = ref(true);
const props = withDefaults(defineProps<{ isShowHandle?: boolean }>(), {
  isShowHandle: true,
});
const treeData = ref<OrganizationTree[]>([]);

const reloadTreeFn = () => {
  getTreeList();
};
const defaultProps = {
  children: "children",
  id: "id",
  label: "name",
};
const nodeClickFn = (currentNode: OrganizationTree, node: Node) => {
  emits("node-click", currentNode);
};

const handleCommand = (type, data) => {
  switch (type) {
    case "edit":
      editOrganFn(data);
      break;
    case "delete":
      deleteOrganFn(data);
      break;
    case "move":
      moveOrganFn(data);
      break;
  }
};
const state = reactive({
  addOrgData: {
    id: "",
    parentId: null,
    name: "",
    code: "",
    organId: "",
  },
  delOrgData: {
    id: "",
    name: "",
  },
  moveOrgData: {
    id: "",
  },
});
const addOrgDialog = ref(false);
const addOrganRef = ref();
const addOrganFn = (node) => {
  state.addOrgData.organId = node.data.id;
  state.addOrgData.parentId = node.data?.id;
  orgDialogStatus.value = true;
  addOrgDialog.value = true;
};
const addOrganSubmitFn = async (formEl) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      if (orgDialogStatus.value) {
        addOrgan({
          name: state.addOrgData.name,
          parentId: state.addOrgData.parentId,
        })
          .then((res) => {
            ElMessage.success("添加成功");
            reloadTreeFn();
          })
          .catch(() => {
            ElMessage.error("添加失败");
          });
      } else {
        editOrgan({
          id: state.addOrgData.id,
          newName: state.addOrgData.name,
        })
          .then((res) => {
            ElMessage.success("修改成功");
            reloadTreeFn();
          })
          .catch(() => {
            ElMessage.error("修改失败");
          });
      }
      addOrgDialog.value = false;
      resetData();
    } else {
      console.log("error submit!", fields);
    }
  });
};
// 获取机构id
const getCurrentOrgId = (id) => {
  state.addOrgData.organId = id;
};
const editOrganFn = (node) => {
  state.addOrgData.id = node.data.id;
  state.addOrgData.name = node.data.name;
  orgDialogStatus.value = false;
  addOrgDialog.value = true;
};
const delOrganDialog = ref(false);
const deleteOrganFn = (node) => {
  state.delOrgData.id = node.data.id;
  state.delOrgData.name = node.data.name;
  delOrganDialog.value = true;
};
const getWarningCloseFn = async (val: boolean) => {
  try {
    if (val) {
      const delOrg = getTargetTree(treeData.value, state.delOrgData.id);
      if (delOrg?.children?.length) {
        delOrganDialog.value = false;
        disableDltVisible.value = true;
      } else {
        await deleteOrgan(state.delOrgData.id);
        ElMessage.success("删除成功");
        reloadTreeFn();
        delOrganDialog.value = false;
      }
    } else {
      delOrganDialog.value = false;
    }
  } catch (e) {
    ElMessage.error("删除失败");
  }
};
const moveOrgDialog = ref(false);
const moveOrganFn = (node) => {
  state.moveOrgData.id = node.data.id;
  moveOrgDialog.value = true;
};
const getCloseMoveDialogFn = (val) => {
  moveOrgDialog.value = false;
  if (val) {
    reloadTreeFn();
  }
};
const resetData = () => {
  state.addOrgData = {
    id: "",
    parentId: null,
    name: "",
    organId: "",
  };
  state.delOrgData = {
    id: "",
    name: "",
  };
  state.moveOrgData = {
    id: "",
  };
};

const getTreeList = async () => {
  const res = await getAllOrgTree();
  treeData.value = selectOrgTree(res.data);
};

onMounted(async () => {
  await getTreeList();
  treeRef.value.setCurrentKey(treeData.value[0].id);
  emits("node-click", treeData.value[0]);
});
</script>

<style lang="scss" scoped>
@import "src/styles/theme";

.disable-dlt-box {
  display: flex;
  align-items: center;

  .del-title {
    height: 40px;
    margin-left: 8px;

    span {
      font-size: 14px;
      color: #2d364d;
      line-height: 22px;
      font-weight: 700;
    }

    p {
      font-size: 12px;
      color: #6d7587;
      line-height: 20px;
      font-weight: 400;
    }
  }

  .icon {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    text-align: center;
    line-height: 30px;
    background-color: rgb(243, 198, 198);

    svg {
      height: 28px;
      fill: red;
      font-size: 28px;
    }
  }
}

.wTree {
  width: 100%;
  height: 100%;
  min-height: 55px;
}

.custom-node {
  flex: 1;
  display: flex;
  height: 100%;
  overflow: hidden;
}

.custom-node-left {
  flex: 1;
  display: flex;
  min-width: 10px; // 设置一个任意值，不让文本撑开宽度
}

.custom-node-right {
  width: 37px;
  display: flex;
  align-items: center;
  visibility: hidden;
  height: 100%;
  line-height: 55px;
}

.icon {
  font-size: 18px;
  cursor: pointer;
  color: #086df4;
  margin-right: 3px;
}

.more {
  font-size: 14px;
  margin-left: 4px;
  color: #086df4;
  transform: rotate(90deg);
  font-weight: 700;
  line-height: 45px;
}

.icon-warp {
  width: 28px;
  height: 100%;
  display: flex;
  align-items: center;
  overflow: hidden;
}

.custom-node-title {
  flex: 1;
  min-width: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;

  .custom-node-title-top {
    width: 100%;
    font-size: 14px;
    color: #2d364d;
    line-height: 22px;
    font-weight: 400;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .custom-node-title-bottom {
    font-size: 12px;
    color: #6d7587;
    line-height: 20px;
    font-weight: 400;
  }
}

:deep(.el-tree-node__content) {
  height: 55px;

  &:hover {
    border-radius: 3px;
  }
}

.treeSelectCom {
  // height: 100px;
  width: 100%;
}
:deep(.el-tree-node__content:hover .custom-node-right) {
  visibility: visible;
}

.iconSize {
  width: 24px;
}
</style>
