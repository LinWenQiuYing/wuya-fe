<template>
  <div :class="$style.chat_header">
    <div :class="$style.chat_header_left">
      <UserMeta :class="$style.chat_user_meta" />
      <div :class="$style.chat_header_left_tags">
        <slot name="time">
          <ul>
            <li v-for="tag in knowSourceTags" :key="tag">{{ tag }}</li>
          </ul>
        </slot>
      </div>
    </div>
    <slot name="none">
      <div :class="$style.chat_header_right">
        <span :class="$style.folder">
          <Plus :class="$style.add_icon" />
          <span :class="$style.add_title" @click="onClickCreat">{{ folderName ?? "收藏" }}</span>
        </span>
        /
        <el-input
          v-if="isEdit"
          ref="inputRef"
          v-model="question"
          :class="$style.el_input"
          @keydown.enter="(e: KeyboardEvent) => handleKeyEnter(e, editChatName)"
          @blur="onBlur"
        />
        <span v-else :class="$style.edit_file" @click="onClickEdit">{{ question ?? "未命名" }}</span>
      </div>
    </slot>
    <CollectDialog v-model="newFolderVisible" />
  </div>
</template>

<script setup lang="ts">
import { Plus } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import { ref, computed, watch, nextTick } from "vue";
import { editChat } from "@/client/api/history";
import useGetHistoryChat from "@/client/hooks/useGetHistoryChat";
import useHistoryType from "@/client/layout/useHistoryType";
import UserMeta from "@/sign/components/UserMeta.vue";
import useHistoryChat from "@/store/hooks/useHistoryChat";
import { getSourceName } from "@/client/utils/getSourceName";
import store from "@/store";
import CollectDialog from "./CollectDialog.vue";
import useSources from "@/client/hooks/useSources";
import handleKeyEnter from "@/client/utils/handleKeyEnter";

const sources = useSources();
const knowSourceTags = computed<string[]>(() => {
  const halfRootName = store.state.documentQA.halfRoots;
  const sourceNames = getSourceName(sources.value) as string[];
  return [...new Set(halfRootName.concat(sourceNames))];
});

const isEdit = ref(false);

const newFolderVisible = ref<boolean>(false);
const chat_id = computed(() => store.state.chat.chat_id);
const { getHistoryChats } = useGetHistoryChat();
const { curChat, parentFolder } = useHistoryChat();
const folderName = computed<string | undefined>(() => parentFolder.value?.title_name);
const question = ref<string | undefined>();
const type = useHistoryType();
const inputRef = ref<HTMLElement>();

const onClickEdit = async () => {
  isEdit.value = true;
  await nextTick(() => inputRef.value && inputRef.value.focus());
};
const onBlur = () => {
  isEdit.value = false;
};

const editChatName = async () => {
  isEdit.value = false;
  if (chat_id.value && question.value?.trim()) {
    const res = await editChat(chat_id.value, question.value).catch(console.log);
    if (!res) return;
    if (type.value) {
      await getHistoryChats(type.value, 1, false);
    }
    ElMessage.success("操作成功");
  }
};

const onClickCreat = () => {
  newFolderVisible.value = true;
};

watch(
  () => curChat.value,
  (curChat) => {
    question.value = curChat?.title_name;
  },
  {
    immediate: true,
  },
);
</script>

<style module lang="scss">
@use "src/styles/theme";
@use "src/styles/mixins";

.chat_header {
  height: 52px;
  padding: 0 theme.$padding-md;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .chat_header_left {
    flex: 1;
    display: flex;
    align-items: center;

    .user_name {
      padding-left: theme.$padding-xs;
      font-size: theme.$font-size-base;
      color: theme.$text-color-primary;
      font-weight: 400;
      overflow: hidden;
      white-space: nowrap;
    }

    &_tags {
      margin-left: 16px;

      ul {
        width: 100%;
        display: flex;
      }

      li {
        padding: 0 8px;
        height: 24px;
        line-height: 24px;
        text-align: center;
        font-size: 12px;
        margin-left: 8px;
        color: #6d7588;
        background: rgb(255 255 255 / 0.8);
        border-radius: 2px;
        overflow: hidden;
        cursor: default;
      }
    }
  }

  .chat_header_right {
    flex: 1;
    display: flex;
    align-items: center;
    font-size: theme.$font-size-base;
    color: theme.$text-color-primary;
    font-weight: 400;
    line-height: 20px;
    cursor: pointer;

    .folder {
      min-width: 60px;
      white-space: nowrap;
    }

    .add_icon {
      flex: 0 0 12px;
      width: 12px;
      height: 12px;
      color: inherit;
    }

    .add_title {
      margin: 0 8px;
      line-height: inherit;
    }

    .edit_file {
      width: 200px;
      margin: 0 8px;
      line-height: inherit;
      @include mixins.hide-lines(1);
    }

    .folder:hover,
    .edit_file:hover {
      color: theme.$color-primary;
    }

    .el_input {
      border-radius: 0;
      margin: 0 7px;
      max-width: 200px;
      overflow: hidden;
    }
  }

  :deep(.chat-user-meta img) {
    width: 28px;
    height: 28px;
  }
}
</style>
