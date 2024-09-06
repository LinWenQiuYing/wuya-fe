<template>
  <el-dialog v-model="visible" title="设置大纲" width="600px" append-to-body @close="close">
    <div :class="$style._">
      <header :class="$style.title">
        <span>上传文件，支持docx格式文档</span>
        <el-link
          type="primary"
          :class="$style.download"
          :icon="DownArrowLineIcon"
          :underline="false"
          @click="downTemplate"
          >下载模板</el-link
        >
      </header>
      <div :class="[$style.upload, checkFile && $style.cat_file]">
        <el-upload
          v-if="!checkFile"
          :show-file-list="false"
          accept=".docx"
          :auto-upload="false"
          :on-change="handleFile"
        >
          <ArrowTopIcon :class="$style.icon" />
          <el-link type="primary" :underline="false">上传文件</el-link>
        </el-upload>
        <template v-else>
          <div :class="$style.file_warp">
            <WordIcon :class="$style.file_icon" />
            <span :class="$style.name">{{ checkFile.name }}</span>
          </div>
          <Delete :class="$style.delete_icon" @click="clearFile" />
          <el-progress
            v-if="progress"
            :class="$style.progress"
            :show-text="false"
            color="#086DF4"
            :percentage="progress"
          ></el-progress>
        </template>
      </div>
      <p :class="$style.section">大纲预览（若不上传则默认为内置模板）</p>
      <div ref="containerRef" :class="$style.main" />
    </div>
    <template #footer>
      <div :class="$style.footer_btn">
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary" @click="send">确定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, watch, Ref } from "vue";
import "quill/dist/quill.snow.css";

import parseMarkdownToOps from "@/client/components/OutlineEditor/parseMarkdownToOps";
import Quill from "quill";
import htmlToMarkdown from "@/client/components/OutlineEditor/htmlToMarkdown";
import DownArrowLineIcon from "@/client/icons/down-arrow-line.svg";
import ArrowTopIcon from "@/client/icons/arrow-top.svg";
import WordIcon from "@/client/icons/word.svg";
import { Delete } from "@element-plus/icons-vue";
import { AxiosProgressEvent } from "axios";
import { UploadFile } from "element-plus/es/components/upload/src/upload";
import { exportMarkdownToDocx, uploadDocxToMarkdown } from "@/client/api/chat";
import { ElMessage } from "element-plus";

let signal: AbortController;

const props = defineProps<{
  clickSend: (question: string) => void;
}>();

const template = `# 一、公司基本情况
## （一）公司基本信息
   工商信息、公司简介、业务模式和主要产品/服务
## （二）公司管理能力现状
  管理能力现状是什么？包括股东构成、实际控制人、管理层构成等
  ...`;

const visible = defineModel<boolean>();
const containerRef = ref<HTMLDivElement>();
const progress = ref<number | null>();
const checkFile = ref<UploadFile | null>();
const editorRef = <Ref<Quill | null>>{ value: null };

const createEditor = (container: HTMLElement) => {
  return new Quill(container, {
    modules: {
      toolbar: [{ header: "1" }, { header: "2" }, { header: "3" }, { header: "4" }],
    },
    theme: "snow",
  });
};

watch(
  () => containerRef.value,
  (container) => {
    if (!container) return;
    const quill = createEditor(container);
    editorRef.value = quill;
    const ops = parseMarkdownToOps(template, true);
    quill.setContents(ops);
  },
  {
    immediate: true,
  },
);

const downTemplate = async () => {
  const content = template.replace(/\n/g, "\n\n");
  const docx = await exportMarkdownToDocx({ text: content, format: "markdown" });
  const url = window.URL.createObjectURL(new Blob([docx]));
  const a = document.createElement("a");
  a.href = url;
  a.download = "模板.docx";
  a.style.display = "none";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

const send = () => {
  if (!editorRef.value) return;
  const html = editorRef.value.getSemanticHTML();
  const text = editorRef.value.getText().replace(/\n/g, "");
  if (!text) return ElMessage.error("大纲不能为空");
  // 未对默认模板修改时 则传空值
  const markdown = htmlToMarkdown(html) === template ? "" : htmlToMarkdown(html);
  props.clickSend(markdown);
  visible.value = false;
};

const handleFile = async (file: UploadFile) => {
  if (file.status === "ready") {
    checkFile.value = file;
    await uploadFile(file);
  }
};

const onUploadProgress = (event: AxiosProgressEvent) => {
  progress.value = Math.ceil((event.progress ?? 0) * 100) * 100;
};

const uploadFile = async (file: UploadFile) => {
  const abortController = new AbortController();
  signal = abortController;
  const formData = new FormData();
  formData.append("file", file.raw!);
  const res = await uploadDocxToMarkdown(formData, {
    onUploadProgress,
    signal: abortController.signal,
  }).catch(console.error);
  progress.value = null;
  if (!res || !editorRef.value) return;
  const ops = parseMarkdownToOps(res, true);
  editorRef.value.setContents(ops);
};

const clearFile = () => {
  checkFile.value = null;
};
const close = () => {
  signal?.abort();
  // checkFile.value = null;
};
</script>

<style module lang="scss">
@use "src/styles/theme";
@import "src/styles/mixins";

$border-color-outline: #dddfe3;
._ {
  header {
    text-align: right;
  }

  .main {
    height: 300px;
    overflow: auto;
  }

  .section {
    margin: 8px 0;
  }
  :global {
    .ql-toolbar {
      opacity: 0.7;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      font-size: 12px;
      padding: 0 12px;
      border-radius: 3px 3px 0 0;

      & button {
        width: 30px;
        height: 30px;
        padding: 7px;
        position: relative;

        &:hover {
          background: #ddd;
        }
      }

      button + button::before {
        content: " ";
        width: 0;
        height: 14px;
        line-height: 14px;
        border-left: 1px solid #e1e1e1;
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
      }
    }

    .ql-container {
      border-bottom: 1px solid $border-color-outline;
      border-radius: 0 0 3px 3px;
    }

    .ql-editor {
      padding: 14px 20px;
      h1,
      h2,
      h3,
      h4 {
        color: theme.$text-color-primary;
      }

      h2,
      h3,
      h4 {
        line-height: 24px;
      }

      h1 {
        line-height: 26px;
        font-size: 18px;
        margin: 16px 0 8px;

        &:first-of-type {
          margin-top: 0;
        }
      }

      h2,
      h3 {
        font-size: 14px;
      }

      h2 {
        font-weight: bold;
      }

      h3 {
        font-weight: normal;
        text-indent: 9px;
      }

      h4 {
        font-size: 14px;
        font-weight: normal;
        text-indent: 23px;
      }

      p {
        font-size: 14px;
        color: #2d364d;
        line-height: 24px;
        margin-left: 30px;
        text-align: left;
        font-style: normal;
      }
    }
  }

  .upload {
    position: relative;
    display: flex;
    justify-content: center;
    border-radius: 6px;
    border: 1px solid #e1e1e1;
    margin-top: 8px;
    padding: 14px 20px;
    overflow: hidden;
  }

  .cat_file {
    justify-content: space-between;
  }
  .icon {
    width: 16px;
    fill: #409eff;
  }
  .progress {
    width: 100%;
    position: absolute;
    left: 0;
    bottom: 0;
    :global {
      border-radius: 0;
    }
  }

  .title {
    display: flex;
    justify-content: space-between;
  }

  .file_warp {
    flex: 1;
    display: flex;
    align-items: center;
  }

  .delete_icon {
    width: 18px;
  }

  .file_icon {
    width: 20px;
  }
  .name {
    flex: 1;
    width: 10px;
    @include hide-lines(1);
  }
}

.footer_btn {
  text-align: right;
  padding-top: 12px;
  border-top: 1px solid #edeff3;
}

.download {
  i,
  svg {
    width: 20px;
    height: 20px;
  }
}
</style>
