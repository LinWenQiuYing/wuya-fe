<!--<template>-->
<!--  <div class="information-menu-side">-->
<!--    <el-input v-model="searchValue" class="menu-search" placeholder="搜索..." :suffix-icon="Search" />-->
<!--    <el-menu-->
<!--      :default-active="defaultActive"-->
<!--      class="side-menu"-->
<!--      @select="handleSelectMenu"-->
<!--      :default-openeds="['history']"-->
<!--    >-->
<!--      <el-menu-item index="news">-->
<!--        <HomeIcon />-->
<!--        <span>资讯主页</span>-->
<!--      </el-menu-item>-->
<!--      <el-menu-item index="tags" class="menu-tag-item">-->
<!--        <TagIcon />-->
<!--        <span>标签管理</span>-->
<!--      </el-menu-item>-->
<!--      <el-sub-menu index="history">-->
<!--        <template #title>-->
<!--          <EventIcon />-->
<!--          <span>主题事件收藏</span>-->
<!--        </template>-->
<!--        <el-tree-->
<!--          lazy-->
<!--          draggable-->
<!--          ref="treeRef"-->
<!--          :class="$style.el_tree"-->
<!--          :filter-node-method="filterNode"-->
<!--          :props="props"-->
<!--          empty-text=""-->
<!--          :data="historyChats"-->
<!--          :load="loadNode"-->
<!--          :allow-drag="allowDrag"-->
<!--          :allow-drop="allowDrop"-->
<!--          @node-drop="handleDrop"-->
<!--        >-->
<!--          <template #default="{ node, data }">-->
<!--            <div :class="$style.content_wrapper">-->
<!--              <div :class="{ [$style.firstChat]: data.id === firstChat?.id && haveDir }"></div>-->
<!--              <div :class="$style.content">-->
<!--                <span :class="$style.icon">-->
<!--                  <FileTextIcon v-if="!data.is_dir" :class="$style.file" />-->
<!--                  <FolderIcon v-else-if="!node.expanded" :class="$style.folder" />-->
<!--                  <FolderOpenIcon v-else-if="node.expanded" :class="$style.folder" />-->
<!--                </span>-->
<!--                <span-->
<!--                  :class="[$style.tree_node_label, { [$style.is_dir]: data.is_dir }]"-->
<!--                  @click="onClickChat(data)"-->
<!--                >-->
<!--                  {{ node.label }}-->
<!--                </span>-->
<!--                <el-popover placement="right" trigger="click" width="60">-->
<!--                  <template #default>-->
<!--                    <div :class="$style.operation">-->
<!--                      <span :class="$style.item" @click="onClickEdit(data)"> 编辑 </span>-->
<!--                      <span v-show="!data.is_dir" :class="$style.item" @click="onClickMove(data)">-->
<!--                        移动-->
<!--                      </span>-->
<!--                      <span :class="$style.item" @click="onClickDelete(data)"> 删除 </span>-->
<!--                    </div>-->
<!--                  </template>-->
<!--                  <template #reference>-->
<!--                    <span :class="$style.fake_icon_more" title="点击对该条历史记录进行操作"> </span>-->
<!--                  </template>-->
<!--                </el-popover>-->
<!--              </div>-->
<!--            </div>-->
<!--          </template>-->
<!--        </el-tree>-->
<!--      </el-sub-menu>-->
<!--    </el-menu>-->
<!--    <el-dialog v-model="editVisible" align-center title="编辑" width="400px">-->
<!--      <el-form ref="formRef" label-position="top" label-width="auto" :model="form" :rules="rules">-->
<!--        <el-form-item label="标题" prop="title_name">-->
<!--          <el-input v-model="form.title_name" type="textarea" />-->
<!--        </el-form-item>-->
<!--      </el-form>-->
<!--      <template #footer>-->
<!--        <div :class="$style.dialog_footer">-->
<!--          <el-button @click="onEditCancel">取消</el-button>-->
<!--          <el-button type="primary" @click="onEditOk(formRef)">确认</el-button>-->
<!--        </div>-->
<!--      </template>-->
<!--    </el-dialog>-->
<!--    <el-dialog v-model="deleteVisible" align-center title="删除" width="400px">-->
<!--      <div style="display: flex">-->
<!--        <WarningFilled style="height: 20px" />-->
<!--        <span style="padding-left: 5px; line-height: 22px">确定要删除该历史收藏或文件夹吗? </span>-->
<!--      </div>-->
<!--      <template #footer>-->
<!--        <div class="dialog-footer">-->
<!--          <el-button @click="onDeleteCancel">取消</el-button>-->
<!--          <el-button type="primary" @click="onDeleteOk(curNode.id)">确认</el-button>-->
<!--        </div>-->
<!--      </template>-->
<!--    </el-dialog>-->
<!--    <el-dialog v-model="moveVisible" align-center title="移动" width="400px">-->
<!--      <el-form ref="moveFormRef" label-position="top" label-width="auto" :model="moveForm" :rules="moveRules">-->
<!--        <el-form-item label="目标文件夹" prop="parent_id">-->
<!--          <el-select v-model="moveForm.parent_id" placeholder="请选择" style="width: 380px">-->
<!--            <el-option v-for="item in moveTree" :key="item.id" :label="item.title_name" :value="item.id" />-->
<!--          </el-select>-->
<!--        </el-form-item>-->
<!--      </el-form>-->
<!--      <template #footer>-->
<!--        <div :class="$style.dialog_footer">-->
<!--          <el-button @click="onMoveCancel">取消</el-button>-->
<!--          <el-button type="primary" @click="onMoveOk(moveFormRef)">确认</el-button>-->
<!--        </div>-->
<!--      </template>-->
<!--    </el-dialog>-->
<!--  </div>-->
<!--</template>-->

<!--<script setup lang="ts">-->
<!--import { getHistoryChat, moveChat } from "@/client/api/history";-->
<!--// import { CHAT_ROUTE } from "@/client/const";-->
<!--import useGetHistoryChat, { transform } from "@/client/hooks/useGetHistoryChat";-->
<!--import EventIcon from "@/client/icons/collect-event.svg";-->
<!--import FileTextIcon from "@/client/icons/file-text.svg";-->
<!--import FolderOpenIcon from "@/client/icons/folder-open.svg";-->
<!--import FolderIcon from "@/client/icons/folder.svg";-->
<!--import HomeIcon from "@/client/icons/home-outline.svg";-->
<!--import TagIcon from "@/client/icons/tag.svg";-->
<!--import {-->
<!--  useChatDetail,-->
<!--  useDeleteChat,-->
<!--  useEditChat,-->
<!--  useMoveChat,-->
<!--  useMoveChatRevoke,-->
<!--} from "@/client/layout/components/historyChat/hooks/index";-->
<!--import useHistoryType from "@/client/layout/useHistoryType";-->
<!--import { HistoryChatType } from "@/client/types";-->
<!--import useHistoryChat from "@/store/hooks/useHistoryChat";-->
<!--import { Search, WarningFilled } from "@element-plus/icons-vue";-->
<!--import { ElMessage } from "element-plus";-->
<!--import type Node from "element-plus/es/components/tree/src/model/node";-->
<!--import type { DragEvents } from "element-plus/es/components/tree/src/model/useDragNode";-->
<!--import type { NodeDropType } from "element-plus/es/components/tree/src/tree.type";-->
<!--import { computed, onMounted, ref, watch } from "vue";-->
<!--import { useRoute, useRouter } from "vue-router";-->
<!--import { useStore } from "vuex";-->

<!--const route = useRoute();-->
<!--const router = useRouter();-->
<!--const defaultActive = ref<string>("news");-->
<!--const handleSelectMenu = (index: string) => {-->
<!--  switch (index) {-->
<!--    case "news":-->
<!--    case "tags":-->
<!--      router.push(`/${index}`);-->
<!--      break;-->

<!--    default:-->
<!--      break;-->
<!--  }-->
<!--};-->

<!--watch(-->
<!--  () => route.path,-->
<!--  (newVal) => {-->
<!--    switch (newVal) {-->
<!--      case "/news":-->
<!--      case "/tags":-->
<!--        defaultActive.value = newVal.replace("/", "");-->
<!--        break;-->

<!--      default:-->
<!--        break;-->
<!--    }-->
<!--  },-->
<!--  {-->
<!--    immediate: true,-->
<!--  },-->
<!--);-->

<!--const curNode = ref();-->
<!--const store = useStore();-->

<!--const searchValue = ref();-->
<!--const treeRef = ref();-->
<!--const { getHistoryChats } = useGetHistoryChat();-->
<!--const { getDetail } = useChatDetail();-->
<!--const { historyChats, moveTree, curChat } = useHistoryChat();-->
<!--const firstChat = computed(() => historyChats.value.find((item) => !item.is_dir));-->
<!--const haveDir = computed(() => historyChats.value.find((item) => item.is_dir));-->
<!--const moveNode = ref();-->
<!--const props = {-->
<!--  label: "title_name",-->
<!--  id: "id",-->
<!--  isLeaf: "isLeaf",-->
<!--  children: "children",-->
<!--};-->
<!--const type = useHistoryType();-->
<!--const { editVisible, formRef, form, rules, onClickEdit, onEditCancel, onEditOk } = useEditChat(curNode);-->

<!--const { deleteVisible, onClickDelete, onDeleteOk, onDeleteCancel } = useDeleteChat(curNode);-->

<!--const { moveFormRef, moveForm, moveRules, moveVisible, onClickMove, onMoveCancel, onMoveOk } =-->
<!--  useMoveChat(curNode);-->
<!--const { moveChatRevoke } = useMoveChatRevoke(moveNode);-->
<!--const onClickChat = async (data: Record<string, string>) => {-->
<!--  if (!data.is_dir) {-->
<!--    curChat.value = data;-->
<!--    const question = data.title_name;-->
<!--    await store.dispatch("chat/set_chat_id", data.id);-->
<!--    const chatDataInit = [-->
<!--      {-->
<!--        question,-->
<!--        answer: {-->
<!--          isProgress: false,-->
<!--          answerStop: false,-->
<!--          progress: [],-->
<!--        },-->
<!--      },-->
<!--    ];-->
<!--    await store.dispatch("chat/set_question", question);-->
<!--    await store.dispatch("chat/set_chat_data", chatDataInit);-->
<!--    const { chatData } = await getDetail(data.id);-->
<!--    await store.dispatch("chat/set_chat_data", chatData);-->
<!--    await store.dispatch("chat/toggle_startChat", false);-->
<!--    await router.push("/new/history");-->

<!--    // const url = encodeURIComponent(data.title_name);-->
<!--    // const routeData = router.resolve(`/new/id=${data.id}=${data.parent_id}&${url}`);-->
<!--    // window.open(routeData.href, "_blank");-->
<!--  }-->
<!--};-->

<!--// 筛选-->
<!--const filterNode = (value: string, data: Record<string, string>) => {-->
<!--  if (!value) return true;-->
<!--  return data.title_name.indexOf(value) !== -1;-->
<!--};-->

<!--const loadNode = async (node: Node, resolve: Function) => {-->
<!--  if (node.level !== 0) {-->
<!--    const topicType =-->
<!--      type.value === HistoryChatType.writing_assistant-->
<!--        ? [HistoryChatType.writing_assistant]-->
<!--        : [HistoryChatType.intelligent_qa, HistoryChatType.real_time_information];-->
<!--    const res = await getHistoryChat(node.data.id, topicType, 50);-->
<!--    const data = transform(res);-->
<!--    resolve(data);-->
<!--  }-->
<!--};-->
<!--const allowDrag = (node: Node) => {-->
<!--  return !node.data.is_dir;-->
<!--};-->
<!--const allowDrop = (draggingNode: Node, dropNode: Node, type: string) => {-->
<!--  if (type !== "inner") return;-->
<!--  return dropNode.data.is_dir;-->
<!--};-->
<!--const handleDrop = (draggingNode: Node, dropNode: Node, dropType: NodeDropType, ev: DragEvents) => {-->
<!--  moveChat(draggingNode.data.id, dropNode.data.id)-->
<!--    .then(() => {-->
<!--      moveNode.value = draggingNode.data;-->
<!--      ElMessage.success("操作成功");-->
<!--    })-->
<!--    .catch(console.error);-->
<!--};-->

<!--watch(searchValue, (val) => {-->
<!--  treeRef.value.filter(val);-->
<!--});-->

<!--onMounted(() => {-->
<!--  getHistoryChats(3);-->
<!--});-->

<!--moveChatRevoke();-->
<!--</script>-->

<!--<style lang="scss" scoped>-->
<!--.information-menu-side {-->
<!--  .menu-search {-->
<!--    height: 40px;-->
<!--    margin-bottom: 18px;-->

<!--    :deep(.el-input__wrapper) {-->
<!--      border-radius: 20px;-->
<!--      border-color: #2d364d;-->

<!--      .el-input__inner,-->
<!--      .el-input__suffix {-->
<!--        color: #2d364d;-->

<!--        &::-webkit-input-placeholder {-->
<!--          color: #6d7587;-->
<!--        }-->

<!--        &:-moz-placeholder {-->
<!--          color: #6d7587;-->
<!--        }-->
<!--      }-->
<!--    }-->
<!--  }-->

<!--  .side-menu {-->
<!--    border-right: 0;-->
<!--    background: transparent;-->

<!--    :deep(.el-menu-item) {-->
<!--      height: 32px;-->
<!--      padding-left: 12px;-->
<!--      border-radius: 6px;-->

<!--      &.menu-tag-item {-->
<!--        path {-->
<!--          transform: scale(1.25);-->
<!--          transform-origin: 0 0;-->
<!--        }-->
<!--      }-->

<!--      svg {-->
<!--        width: 20px;-->
<!--        height: 20px;-->
<!--        margin-right: 4px;-->
<!--      }-->

<!--      span {-->
<!--        line-height: 32px;-->
<!--        color: #2d364d;-->
<!--        font-weight: bold;-->
<!--      }-->

<!--      &.is-active {-->
<!--        color: #2d364d;-->
<!--        background-color: #dddfe3;-->
<!--      }-->

<!--      &:hover {-->
<!--        background-color: #dddfe3;-->
<!--      }-->
<!--    }-->

<!--    :deep(.el-sub-menu) {-->
<!--      .el-tree {-->
<!--        padding-left: 24px;-->
<!--        background: transparent;-->

<!--        .el-icon {-->
<!--          display: none;-->
<!--        }-->
<!--      }-->

<!--      .el-sub-menu__title {-->
<!--        height: 32px;-->
<!--        line-height: 32px;-->
<!--        padding-left: 12px;-->
<!--        font-weight: bold;-->
<!--        border-radius: 6px;-->

<!--        &:hover {-->
<!--          background: transparent;-->
<!--        }-->

<!--        svg {-->
<!--          width: 20px;-->
<!--          height: 20px;-->
<!--          margin-right: 4px;-->
<!--        }-->

<!--        .el-icon {-->
<!--          right: 5px;-->
<!--        }-->
<!--      }-->

<!--      .el-menu&#45;&#45;inline {-->
<!--        background: transparent;-->
<!--        height: calc(100vh - 245px);-->

<!--        .el-menu-item {-->
<!--          padding-left: 36px;-->

<!--          svg {-->
<!--            width: 16px;-->
<!--            height: 16px;-->
<!--          }-->

<!--          .submenu-item-title {-->
<!--            width: calc(100% - 24px);-->
<!--            font-weight: normal;-->
<!--          }-->

<!--          .more {-->
<!--            &::after {-->
<!--              content: "...";-->
<!--              height: 1px;-->
<!--              line-height: 1px;-->
<!--              transform: rotate(90deg);-->
<!--              font-size: 16px;-->
<!--              position: relative;-->
<!--              right: -4px;-->
<!--              display: inline-block;-->
<!--            }-->
<!--          }-->
<!--        }-->
<!--      }-->
<!--    }-->
<!--  }-->

<!--  :deep(.el-tree) {-->
<!--    height: 100%;-->
<!--    max-height: 100%;-->

<!--    &::-webkit-scrollbar-corner {-->
<!--      background-color: transparent;-->
<!--    }-->

<!--    .el-tree-node {-->
<!--      .el-tree-node__content {-->
<!--        height: 34px;-->
<!--      }-->
<!--    }-->
<!--  }-->
<!--}-->
<!--</style>-->
<!--<style lang="scss" module>-->
<!--@use "src/styles/theme";-->
<!--@use "src/styles/mixins";-->

<!--.el_tree {-->
<!--  background-color: #edeff3;-->
<!--  &#45;&#45;el-tree-node-hover-bg-color: #e2e4e9;-->
<!--  // todo-->
<!--  height: 580px;-->
<!--  max-height: 580px;-->
<!--  overflow: scroll;-->
<!--  // flex: 1;-->
<!--  // overflow: hidden auto;-->
<!--}-->

<!--.firstChat {-->
<!--  width: 100%;-->
<!--  border-top: 2px solid #e0e4f1;-->
<!--}-->

<!--.content_wrapper {-->
<!--  width: 100%;-->
<!--  display: flex;-->
<!--  flex-direction: column;-->
<!--}-->

<!--.content {-->
<!--  padding: 0 theme.$padding-sm;-->
<!--  display: flex;-->
<!--  align-items: center;-->
<!--  width: 100%;-->
<!--  overflow: hidden;-->
<!--}-->

<!--.tree_title {-->
<!--  margin-top: theme.$margin-md;-->
<!--  font-size: theme.$font-size-base;-->
<!--  color: theme.$text-color-secondary;-->
<!--  line-height: 22px;-->
<!--}-->

<!--.tree_node_label {-->
<!--  flex: 1;-->
<!--  font-weight: 400;-->
<!--  color: theme.$text-color-primary;-->
<!--  font-size: theme.$font-size-base;-->
<!--  white-space: nowrap; /* 禁止换行 */-->
<!--  overflow: hidden; /* 隐藏超出部分 */-->
<!--  text-overflow: ellipsis;-->
<!--  line-height: 34px;-->
<!--}-->

<!--.tree_node_label.is_dir {-->
<!--  font-weight: 700;-->
<!--}-->

<!--.fake_icon_more {-->
<!--  margin-right: -6px;-->

<!--  &::after {-->
<!--    content: "...";-->
<!--    height: 1px;-->
<!--    line-height: 1px;-->
<!--    transform: rotate(90deg);-->
<!--    font-size: 16px;-->
<!--    position: relative;-->
<!--    right: -4px;-->
<!--  }-->
<!--}-->

<!--.icon {-->
<!--  display: flex;-->
<!--  align-items: center;-->
<!--  width: 20px;-->

<!--  .file {-->
<!--    height: 16px;-->
<!--  }-->

<!--  .folder {-->
<!--    margin-left: -2px;-->
<!--    height: 18px;-->
<!--  }-->
<!--}-->

<!--.operation {-->
<!--  display: flex;-->
<!--  justify-items: center;-->
<!--  flex-direction: column;-->
<!--}-->

<!--.item {-->
<!--  padding: 5px 0;-->
<!--  text-align: center;-->
<!--  cursor: pointer;-->

<!--  &:hover {-->
<!--    color: theme.$color-primary;-->
<!--  }-->
<!--}-->
<!--</style>-->
