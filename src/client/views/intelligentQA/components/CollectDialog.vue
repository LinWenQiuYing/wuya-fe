<template>
  <el-dialog
    v-model="visible"
    title="选择收藏夹"
    :width="isMobile ? '90%' : '400px'"
    destroy-on-close
    append-to-body
  >
    <div v-show="!isCreateFolder" :class="$style.add_warp" @click="() => (isCreateFolder = true)">
      <Plus :class="$style.add_folder" />
      <span>新建文件夹</span>
    </div>
    <el-input
      v-show="isCreateFolder"
      v-model="folderNameInput"
      placeholder="请输入收藏夹名称"
      @keydown.enter="(e: KeyboardEvent) => handleKeyEnter(e, () => (<HTMLElement>e.target).blur())"
      @blur="createFolder"
    ></el-input>
    <ul :class="$style.list_warp">
      <li
        v-for="(item, i) in moveTree"
        :key="i"
        :class="[$style.item, { [$style.check]: item.check }]"
        @click="() => selectFolder(item.id)"
      >
        <FolderIcon :class="$style.folder_icon" />
        <p>{{ item.title_name }}</p>
        <Check v-show="item.check" :class="$style.folder_icon" />
      </li>
    </ul>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="onCancel">取消</el-button>
        <el-button type="primary" :disabled="!moveTree.some((item) => item.check)" @click="onOk"
          >确认</el-button
        >
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { Plus, Check } from "@element-plus/icons-vue";
import { ref, computed } from "vue";
import { createChat, moveChat } from "@/client/api/history";
import useHistoryChat from "@/store/hooks/useHistoryChat";
import useGetHistoryChat from "@/client/hooks/useGetHistoryChat";
import useHistoryType from "@/client/layout/useHistoryType";
import store from "@/store";
import FolderIcon from "@/client/icons/folder.svg";
import { isMobile } from "@/config";
import handleKeyEnter from "@/client/utils/handleKeyEnter";

const visible = defineModel<boolean>();
const type = useHistoryType();
const { getHistoryChats } = useGetHistoryChat();
const { root, curChat, moveTree } = useHistoryChat();
const folderNameInput = ref<string>();
const isCreateFolder = ref<boolean>(false);

const chat_id = computed(() => store.state.chat.chat_id);

const createFolder = async () => {
  if (folderNameInput?.value?.trim()) {
    const data = {
      title_name: folderNameInput.value,
      is_dir: true,
      parent_id: root.value?.id,
      topic_type: type.value,
    };
    const folder = await createChat(data);
    folder.check = false;
    moveTree.value = [folder, ...moveTree.value];
  }

  isCreateFolder.value = false;
};

const selectFolder = (id: number) => {
  moveTree.value.forEach((item) => {
    item.check = item.id === id ? !item.check : false;
  });
};

const onCancel = () => {
  visible.value = false;
};

const onOk = async () => {
  if (chat_id.value && curChat.value) {
    const folder = moveTree.value.find((item) => item.check)!;
    curChat.value.parent_id = folder.id;
    await moveChat(chat_id.value, folder.id).catch(console.error);
  }

  await getHistoryChats(type.value, 1, false);
  visible.value = false;
};
</script>

<style module lang="scss">
@use "src/styles/theme";

.item {
  display: flex;
  padding: 6px theme.$padding-sm;
  margin: theme.$margin-xss 0;
  align-items: center;
  justify-content: space-between;
  border-radius: theme.$border-radius-md;
  background-color: #f0f2f7;

  p {
    flex: 1;
    text-align: left;
    color: #2d364d;
  }
}

.item.check {
  background: rgba(174, 207, 255, 0.3);
}

.list_warp {
  max-height: 248px;
  overflow: auto;
}

.add_warp {
  display: flex;
  align-items: center;
  color: #0a6efa;
  cursor: pointer;
}

.add_folder {
  width: 14px;
  margin-right: 4px;
  color: #0a6efa;
}

.folder_icon {
  width: 20px;
  margin-right: 6px;
}
</style>
