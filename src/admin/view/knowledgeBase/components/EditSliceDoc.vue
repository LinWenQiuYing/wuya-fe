<template>
  <div class="file_preview">
    <iframe ref="iframeRef" :src="fileUrl" style="width: 50%; height: 100%"></iframe>
    <div class="merge_text">
      <div class="title" v-if="!isEdit">
        <el-tooltip content="请勾选连续的文本块后进行合并" placement="top">
          <el-link type="primary" :disabled="isMerge" style="width: 130px" @click="mergeText">
            <UnionIcon style="width: 16px; vertical-align: text-bottom; fill: #1776ff" />
            合并文本块
          </el-link>
        </el-tooltip>

        <div class="edit_text" :title="'拆分文本块：请进入文本块编辑状态，在拆分点输入Ctrl+Enter即可'">
          拆分文本块：请进入文本块编辑状态，在拆分点输入Ctrl+Enter即可
        </div>
        <div class="icon_btn">
          <UndoIcon :class="{ disabled: snapshotIdx - 1 < 0 }" class="btn-icon-name" @click="() => go(-1)" />
          <RedoIcon
            class="btn-icon-name"
            :class="{ disabled: snapshotIdx + 1 > snapshot.length - 1 }"
            @click="() => go(1)"
          />
        </div>
      </div>
      <div class="merge_content">
        <el-checkbox-group v-model="checkArr">
          <div v-for="(item, i) in snapshot[snapshotIdx]" :key="i" style="display: flex; margin: 12px 0">
            <el-checkbox :key="i" :value="i" />
            <div
              class="edit"
              contenteditable="true"
              @mouseup="() => changePage(item)"
              @keydown="(e) => handleKeyDown(e, i)"
            >
              <p style="font-size: 14px; color: #2d364d">
                {{ item.content }}
              </p>
            </div>
          </div>
        </el-checkbox-group>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { getCursorPotion } from "@/admin/utils/getCursorPotion";
import UnionIcon from "@/admin/icons/union.svg";
import UndoIcon from "@/admin/icons/undo.svg";
import RedoIcon from "@/admin/icons/redo.svg";
import { DocSplit } from "@/admin/types/api";
import { deepCopy } from "@/client/utils/deepCopy";

const props = defineProps<{
  splitContent: DocSplit[];
  fileUrl: string;
  isEdit: boolean;
}>();
const emits = defineEmits(["handle-content"]);
const fileUrl = ref(props.fileUrl); // pdf预览地址
// const splitContext = ref(props.splitContent); // 所有文本
const cursorPosition = ref(); // 当前光标位置
const checkArr = ref([]);
const isMerge = ref(true); // 是否可以合并
const snapshot = ref<DocSplit[][]>([deepCopy(props.splitContent)]); // 快照
const snapshotIdx = ref(0); // 当前快照位置

const iframeRef = ref();

// 跳转页数
const changePage = (data: DocSplit) => {
  const url = fileUrl.value.split("&");
  const page = url[url.length - 1].split("=")[1];
  const iframe = iframeRef.value;
  const currentPage =
    typeof data.metadata.page === "number" ? data.metadata.page : Number(data.metadata.page.split("_")[0]);
  if (iframe && currentPage !== Number(page)) {
    const newSrc = url[0] + `&page=${currentPage}`;
    iframe.src = newSrc;
    fileUrl.value = newSrc;
    iframeRef.value.contentWindow.location.reload(); // 修改页数需要刷新pdf
  }
  cursorPosition.value = getCursorPotion();
};

// 按下ctrl+enter后 对文本进行拆分
const handleKeyDown = (e: KeyboardEvent, index: number) => {
  if (e.ctrlKey && e.key === "Enter") {
    const currentText = snapshot.value[snapshotIdx.value][index];
    const startStr = currentText.content.substring(0, cursorPosition.value.end);
    const endStr = currentText.content.substring(cursorPosition.value.end);
    const splitArr = [startStr, endStr].map((str) => ({
      content: str,
      metadata: currentText.metadata,
    }));

    const copyArr = deepCopy(snapshot.value[snapshotIdx.value]);
    copyArr.splice(index, 1, ...splitArr);
    snapshot.value.push(copyArr);
    snapshotIdx.value = snapshot.value.length - 1; // 每次进行操作后都指向最新的快照
    emits("handle-content", copyArr);
    checkArr.value = [];
  }
};

// 合并文本
const mergeText = () => {
  const checkContent = checkArr.value.map((i) => snapshot.value[snapshotIdx.value][i].content).join("");
  const firstIdx = checkArr.value[0];
  const checkObj = {
    content: checkContent,
    metadata: props.splitContent[firstIdx].metadata,
  };
  const copyArr = deepCopy(snapshot.value[snapshotIdx.value]);
  copyArr.splice(firstIdx, checkArr.value.length, checkObj);
  snapshot.value.push(copyArr);
  snapshotIdx.value = snapshot.value.length - 1; // 每次进行操作后都指向最新的快照
  emits("handle-content", copyArr);
  checkArr.value = [];
};

// 前进或后退
const go = (num: number) => {
  snapshotIdx.value = snapshotIdx.value + num;
  emits("handle-content", snapshot.value[snapshotIdx.value]);
};

// 是否可以合并
watch(
  () => checkArr.value,
  (value) => {
    value.sort((a, b) => a - b);
    if (value.length < 2) {
      isMerge.value = true;
    } else {
      for (let i = 0; i < value.length - 1; i++) {
        if (value[i] + 1 !== value[i + 1]) {
          isMerge.value = true;
          return;
        } else {
          isMerge.value = false;
        }
      }
    }
  },
);
</script>

<style scoped lang="scss">
@import "src/styles/theme";

.file_preview {
  width: 100%;
  height: 100%;
  display: flex;
  overflow: hidden;

  .merge_text {
    width: 50%;
    height: 100%;
    display: flex;
    flex-direction: column;
    background-color: #fff;

    .title {
      display: flex;
      justify-content: space-between;
      height: 55px;
      line-height: 22px;
      padding: 16px;
      border-bottom: 1px solid #e1e4f0;

      .edit_text {
        margin: 0 10px;
        background: #f1f2f5;
        border-radius: 14px;
        padding: 0 8px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }

      .icon_btn {
        width: 72px;
        display: flex;

        .btn-icon-name {
          width: 16px;
          margin: 0 5px;
          vertical-align: text-bottom;
          fill: #1776ff;
        }

        .disabled {
          opacity: 0.5; /* 设置不透明度为50% */
          pointer-events: none; /* 禁用所有鼠标事件 */
        }
      }
    }

    .merge_content {
      flex: 1;
      /* height: calc(100% - 55px); */
      padding: 16px 16px 60px 16px;
      overflow-y: auto;

      .edit {
        margin-left: 6px;
        border: 1px solid rgba(190, 191, 201, 1);
        border-radius: 6px;
        line-height: 22px;
        padding: 0 10px;
        word-break: break-all;
        line-break: anywhere;
        flex: 1;
        overflow: hidden;
      }

      &:deep(.el-checkbox__label) {
        display: none;
      }
    }
  }
}
</style>
