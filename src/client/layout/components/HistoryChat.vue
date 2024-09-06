<template>
  <div :class="[isMobile ? $style.h5 : $style.pc, $style._]">
    <div :class="$style.title_warp">
      <h1 :class="$style.title_history_chat">历史收藏</h1>
      <FolderPlusIcon v-if="!isAnonymous" :class="$style.add_history_icon" @click="createFolder" />
    </div>
    <history-auth-interceptor>
      <div :class="$style.inputRow">
        <el-input
          v-model="searchValue"
          :class="$style.search_input"
          placeholder="搜索历史收藏"
          :suffix-icon="Search"
          @input="changeInput"
        ></el-input>
        <FolderPlusIcon v-if="isMobile" :class="$style.add_history_icon" @click="createFolder" />
      </div>
      <el-tree
        ref="treeRef"
        v-infinite-scroll="scrollAdd"
        lazy
        draggable
        :infinite-scroll-immediate="false"
        :class="$style.el_tree"
        :filter-node-method="filterNode"
        :props="props"
        empty-text=""
        :data="historyChats"
        :load="loadNode"
        :allow-drag="allowDrag"
        :allow-drop="allowDropNode"
        @node-drop="handleDrop"
      >
        <template #default="{ node, data }">
          <div :class="$style.content_wrapper">
            <div :class="{ [$style.firstChat]: data.id === firstChat?.id && haveDir }"></div>
            <div :class="$style.content">
              <span :class="$style.icon">
                <FileTextIcon v-if="!data.is_dir" :class="$style.file" />
                <FolderIcon v-else-if="!node.expanded" :class="$style.folder" />
                <FolderOpenIcon v-else-if="node.expanded" :class="$style.folder" />
              </span>
              <span
                v-if="node.label"
                :class="[$style.tree_node_label, { [$style.is_dir]: data.is_dir }]"
                @click="onClickChat(data)"
              >
                {{ node.label }}
              </span>
              <el-input
                v-else
                ref="addInputFolderRef"
                v-model="folderName"
                @keyup.enter="(e: KeyboardEvent) => handleKeyEnter(e, () => (<HTMLElement>e.target).blur())"
                @blur="() => handleName(node)"
              />
              <el-popover v-if="node.label" placement="right" trigger="click" width="60">
                <template #default>
                  <div :class="$style.operation">
                    <span :class="$style.item" @click="onClickEdit(data)"> 编辑 </span>
                    <span v-show="!data.is_dir" :class="$style.item" @click="onClickMove(data)"> 移动 </span>
                    <span :class="$style.item" @click="onClickDelete(data)"> 删除 </span>
                  </div>
                </template>
                <template #reference>
                  <span :class="$style.fake_icon_more" title="点击对该条历史记录进行操作"> </span>
                </template>
              </el-popover>
            </div>
          </div>
        </template>
      </el-tree>
    </history-auth-interceptor>
    <history-edit-dialog v-model="editDialogVisible" :cur-node="curNode" />
    <history-move-dialog v-model="moveDialogVisible" :cur-node="curNode" />
    <history-delete-dialog v-model="deleteDialogVisible" :cur-node="curNode" />
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, ref, watch } from "vue";
import { Search } from "@element-plus/icons-vue";
import useGetHistoryChat, { transform } from "@/client/hooks/useGetHistoryChat";
import store from "@/store";
import useHistoryType from "@/client/layout/useHistoryType";
import { createChat, getHistoryChat, moveChat } from "@/client/api/history";
import { HistoryChatType } from "@/client/types";
import type Node from "element-plus/es/components/tree/src/model/node";
import FolderOpenIcon from "@/client/icons/folder-open.svg";
import FolderIcon from "@/client/icons/folder.svg";
import FolderPlusIcon from "@/client/icons/folder-plus.svg";
import FileTextIcon from "@/client/icons/file-text.svg";
import { ElInput, ElMessage, ElTree } from "element-plus";
import useHistoryChat from "@/store/hooks/useHistoryChat";
import getKeyData from "@/admin/utils/getKeyData";
import { ChatTreeNode, CreatFolderParams } from "@/client/types/api";
import { useStopChat } from "./useStopChat";
import useJumpRoute from "./useJumpRoute";
import useMoveChatRevoke from "./useMoveChatRevoke";
import { isMobile } from "@/config";
import HistoryAuthInterceptor from "@/client/layout/components/HistoryAuthInterceptor.vue";
import { isAnonymous } from "@/store/hooks/useUserInfo";
import HistoryEditDialog from "@/client/layout/components/HistoryEditDialog.vue";
import HistoryMoveDialog from "@/client/layout/components/HistoryMoveDialog.vue";
import HistoryDeleteDialog from "@/client/layout/components/HistoryDeleteDialog.vue";
import handleKeyEnter from "@/client/utils/handleKeyEnter";

const curNode = ref<ChatTreeNode>();
const searchValue = ref();
const addInputFolderRef = ref<HTMLInputElement>();
const folderName = ref<string>();
const treeRef = ref<InstanceType<typeof ElTree>>();
const page = ref<number>(1);
const { getHistoryChats } = useGetHistoryChat();
const { historyChats, curChat, root } = useHistoryChat();
const firstChat = computed(() => historyChats.value.find((item) => !item.is_dir));
const haveDir = computed(() => historyChats.value.find((item) => item.is_dir));
const moveNode = ref<ChatTreeNode>();
const props = {
  label: "title_name",
  id: "id",
  isLeaf: "isLeaf",
  children: "children",
};
const type = useHistoryType();
const editDialogVisible = ref<boolean>(false);
const moveDialogVisible = ref<boolean>(false);
const deleteDialogVisible = ref<boolean>(false);
const onClickEdit = (data: ChatTreeNode) => {
  curNode.value = data;
  editDialogVisible.value = true;
};
const onClickMove = (data: ChatTreeNode) => {
  curNode.value = data;
  moveDialogVisible.value = true;
};

const onClickDelete = (data: ChatTreeNode) => {
  curNode.value = data;
  deleteDialogVisible.value = true;
};

const { moveChatRevoke } = useMoveChatRevoke(moveNode);
const stopChat = useStopChat();
const { getHistoryDetail } = useJumpRoute();

const onClickChat = async (data: ChatTreeNode) => {
  if (!data.is_dir) {
    stopChat();
    curChat.value = data;
    await getHistoryDetail(data);
  }
};

const changeInput = (val: string) => {
  if (!treeRef.value) return;
  treeRef.value.filter(val);
};

// 筛选
const filterNode = (value: string, data: Record<string, string>) => {
  if (!value) return true;
  return data.title_name.indexOf(value) !== -1;
};

const loadNode = async (node: Node, resolve: (data: ChatTreeNode[]) => void) => {
  if (node.level !== 0) {
    const topicType =
      type.value === HistoryChatType.writing_assistant
        ? [HistoryChatType.writing_assistant]
        : [HistoryChatType.intelligent_qa, HistoryChatType.real_time_information];
    const res = await getHistoryChat((<ChatTreeNode>node.data).id, topicType, 1, 50);
    const data = transform(res);
    const currentData = getKeyData(historyChats.value, "id", node.data.id);
    if (currentData) {
      currentData.children = data;
    }
    resolve(data);
  }
};

const scrollAdd = async () => {
  page.value += 1;
  await getHistoryChats(type.value, page.value, true);
  if (searchValue.value) treeRef.value.filter(searchValue.value);
};
const allowDrag = (node: Node) => {
  return !node.data.is_dir;
};

const allowDropNode = (draggingNode: Node, dropNode: Node, type: string) => {
  const dropData = <ChatTreeNode>dropNode.data;
  if (type !== "inner") return;
  return dropData.is_dir;
};
const handleDrop = (draggingNode: Node, dropNode: Node) => {
  const draggingData = <ChatTreeNode>draggingNode.data;
  const dropData = <ChatTreeNode>dropNode.data;
  moveChat(draggingData.id, dropData.id)
    .then(() => {
      if (store.state.chat.chat_id === draggingData.id) {
        curChat.value = {
          ...draggingData,
          parent_id: dropData.id,
        };
      }
      moveNode.value = { ...draggingData };
      draggingData.parent_id = dropData.id;
      ElMessage.success("操作成功");
    })
    .catch(console.error);
};

const createFolder = async () => {
  const newFolder = {
    parent_id: root.value?.id,
    is_dir: true,
    id: +new Date(),
    title_name: "",
  } as ChatTreeNode;
  historyChats.value = [newFolder, ...historyChats.value];
  await nextTick();
  if (addInputFolderRef.value) addInputFolderRef.value.focus();
};

const handleName = async (node: Node) => {
  if (!folderName.value?.trim() && treeRef.value) {
    treeRef.value.remove(node);
    return;
  }
  const params = {
    title_name: folderName.value,
    is_dir: true,
    parent_id: root.value?.id,
    topic_type: type.value,
  } as CreatFolderParams;
  await createChat(params);
  await getHistoryChats(type.value, 1, false);
  folderName.value = "";
};

watch(
  () => type.value,
  (value) => {
    if (value) {
      getHistoryChats(value, 1, false).catch(console.error);
    }
  },
  {
    immediate: true,
  },
);

moveChatRevoke();
</script>

<style lang="scss" module>
@use "src/styles/theme";
@use "src/styles/mixins";

._ {
  display: flex;
  flex-direction: column;
  overflow: hidden;

  :global {
    .el-input__wrapper {
      border-radius: 20px;
    }

    .el-select__wrapper {
      width: 100% !important;
    }

    .el-tree-node__label {
      width: 100px;
      color: theme.$text-color-primary;
      font-weight: 400;
      white-space: nowrap; /* 禁止换行 */
      overflow: hidden; /* 隐藏超出部分 */
      text-overflow: ellipsis;
    }

    .el-tooltip__trigger {
      width: 34px;
      height: 34px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #6d7588;
      transition: all 0.3s ease-in-out;

      &:hover {
        color: theme.$text-color-primary;
      }
    }

    .el-tree {
      background-color: transparent;
    }

    .el-tree-node__content {
      height: 34px;
      border-radius: theme.$border-radius-md;

      .is-loading {
        display: none;
      }
    }

    .el-tree-node__expand-icon {
      display: none;
    }

    .el-tree-node.is-drop-inner {
      background-color: #e0e4f1;
    }

    .el-tree__drop-indicator {
      height: 1.5px;
    }
  }
}

.title_warp {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.title_history_chat {
  font-size: theme.$padding-md;
  color: theme.$text-color-primary;
  line-height: 22px;
  font-weight: 700;
  text-align: left;
}

.add_history_icon {
  width: 20px;
  cursor: pointer;

  &:hover {
    fill: #306bec;
  }
}

.search_input {
  margin: theme.$margin-xs 0;
  border-radius: 15px;
  box-shadow: none;
}

.el_tree {
  --el-tree-node-hover-bg-color: rgba(221, 223, 227, 0.5);
  flex: 1;
  overflow: hidden auto;
}

.firstChat {
  width: 100%;
  border-top: 1px solid #e0e4f1;
}

.content_wrapper {
  width: 100%;
  display: flex;
  flex-direction: column;
}

.content {
  padding: 0 theme.$padding-sm;
  display: flex;
  align-items: center;
  width: 100%;
  overflow: hidden;

  :global {
    .el-input__wrapper {
      border-radius: 4px;
    }
  }
}

.tree_title {
  margin-top: theme.$margin-md;
  font-size: theme.$font-size-base;
  color: theme.$text-color-secondary;
  line-height: 22px;
}

.tree_node_label {
  flex: 1;
  font-weight: 400;
  color: theme.$text-color-primary;
  font-size: theme.$font-size-base;
  white-space: nowrap; /* 禁止换行 */
  overflow: hidden; /* 隐藏超出部分 */
  text-overflow: ellipsis;
  line-height: 34px;
}

.tree_node_label.is_dir {
  font-weight: 700;
}

.fake_icon_more {
  margin-right: -6px;

  &::after {
    content: "...";
    height: 1px;
    line-height: 1px;
    transform: rotate(90deg);
    font-size: 16px;
    position: relative;
    right: -4px;
  }
}

.icon {
  display: flex;
  align-items: center;
  width: 20px;

  .file {
    height: 16px;
  }

  .folder {
    margin-left: -2px;
    height: 18px;
  }
}

.operation {
  display: flex;
  justify-items: center;
  flex-direction: column;
}

.item {
  padding: 5px 0;
  text-align: center;
  cursor: pointer;

  &:hover {
    color: theme.$color-primary;
  }
}

.h5 {
  height: 100%;
  padding-bottom: 10px;

  .title_warp {
    display: none;
  }
}

.inputRow {
  display: flex;
  align-items: center;

  .add_history_icon {
    margin-left: 5px;
  }
}
</style>
