<template>
  <el-dialog
    v-model="visible"
    align-center
    destroy-on-close
    title="移动"
    width="400px"
    @close="() => close(false)"
    append-to-body
  >
    <div style="margin-bottom: 10px">目标文件夹</div>
    <el-tree-select
      v-model="moveId"
      :load="moveOptions"
      :props="selectProp"
      check-strictly
      highlight-current
      lazy
      no-data-text="没有可选择的目录"
      placeholder="请选择目录"
    ></el-tree-select>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="close(false)">取消</el-button>
        <el-button :disabled="!moveId" type="primary" @click="close(true)" :loading="moveIng">确认</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import Node from "element-plus/es/components/tree/src/model/node";
import { getMoreDirByUpId, moveResource } from "@/api/knowledgeRequst";
import { ElMessage } from "element-plus";
import useRequestLoading from "@/hooks/useRequestLoading";
import { FileOrFolderState } from "@/api/type";
import { Category } from "@/client/types/treeData";

const visible = ref<boolean>(true);
const selectProp = {
  value: "id",
  label: "name",
  isLeaf: "isLeaf",
  children: "children",
};
const props = defineProps<{
  currentNode: {
    repositoryId: number;
    parentId: number;
    id: number;
  };
}>();

type MoveSate = {
  isLeaf: boolean;
} & Partial<FileOrFolderState>;
const emit = defineEmits(["closeDialog"]);
const moveId = ref<number>();

const moveOptions = async (node: Node, resolve: (data: MoveSate[]) => void) => {
  const id = node.level ? node.data.id : props.currentNode.repositoryId;
  const res = await getMoreDirByUpId(id);

  const folderData = res.data.children.filter(
    (d) =>
      d.category !== Category.file && d.id !== props.currentNode?.parentId && d.id !== props.currentNode?.id,
  ) as MoveSate[];

  if (!node.level && props.currentNode?.parentId !== props.currentNode.repositoryId)
    folderData.unshift({
      id: props.currentNode.repositoryId,
      name: "根目录",
      isLeaf: true,
    });
  resolve(folderData);
};

const [moveFn, moveIng] = useRequestLoading(moveResource);
const close = async (val: boolean) => {
  if (val) {
    await moveFn({
      currentNodeId: props.currentNode?.id,
      newParentNodeId: moveId.value,
    }).catch(console.error);
    ElMessage.success("操作成功");
  }
  visible.value = false;
  emit("closeDialog", val, moveId.value);
};
</script>
