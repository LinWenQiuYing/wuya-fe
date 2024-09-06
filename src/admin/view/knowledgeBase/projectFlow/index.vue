<!-- 图谱构建-构建项目流程 -->
<template>
  <div class="project_flow">
    <div class="project_flow_header">
      <!-- <el-icon
        style="cursor: pointer; width: 20px; height: 20px"
        @click="reback"
        ><ArrowLeft
      /></el-icon>
      <div class="project_flow_back">返回</div> -->
      <div class="back flexAlign" @click="reback('')">
        <ArrowLeftBold />
        <span>返回</span>
      </div>
    </div>
    <div class="project_flow_content">
      <div class="content_top">新建构建任务</div>
      <el-steps :active="activeStep" align-center class="content_steps">
        <el-step
          v-for="(item, index) in taskStep"
          :key="index"
          :title="item.title"
          :icon="index <= activeStep ? h('p', { class: ['dot', 'cueent_dot'] }) : h('div', { class: 'dot' })"
        />
      </el-steps>

      <div v-if="activeStep === 0" class="content_middle">
        <div class="project_item">
          <div class="item_label">任务名称<i style="color: red; margin-right: 5px">*</i></div>
          <el-input v-model="tasks.name" class="item_value" placeholder="请输入" maxlength="50" />
        </div>
        <div class="project_item" style="align-items: start">
          <div class="item_label" style="margin-top: 2px">备注</div>
          <el-input
            v-model="tasks.notes"
            class="item_value"
            style="height: 52px"
            :autosize="{ minRows: 2, maxRows: 2 }"
            type="textarea"
            placeholder="请输入"
          />
        </div>
        <div class="project_item">
          <div class="item_label">文档类型<i style="color: red; margin-right: 5px">*</i></div>
          <el-radio-group v-model="tasks.type" :class="['ml-4', 'item_value']" @change="changeRadio">
            <el-radio label="1" size="large">本地文件</el-radio>
            <el-radio label="2" size="large">知识库文档</el-radio>
          </el-radio-group>
        </div>
        <div v-if="tasks.type === '1'" class="project_item">
          <div class="item_label" style="margin-top: 2px">
            选择文件<i style="color: red; margin-right: 5px">*</i>
          </div>
          <div :class="['item_value_upload', 'item_value']">
            <el-upload
              v-model:file-list="uploadFileList"
              accept=".docx,.pdf"
              :class="['item_upload']"
              multiple
              :show-file-list="false"
              :auto-upload="false"
              :on-change="handleFileChange"
            >
              <div class="item_upload_wrapper">
                <div class="wrapper_action">
                  <el-icon><Upload /></el-icon>
                  <span style="color: #086df4; font-size: 14px">上传文件</span>
                </div>
              </div>
              <!-- <template #tip>
              <div class="el-upload__tip">
                jpg/png files with a size less than 500kb
              </div>
            </template> -->
            </el-upload>
            <!-- <el-button size="small" plain @click="handleUpload">
              <el-icon style="color: #086df4"><Upload /></el-icon>
              确定</el-button
            > -->
          </div>
        </div>
        <div v-if="tasks.type === '1'" class="project_item">
          <div class="item_label" style="margin-top: 2px">上传进度</div>
          <el-progress :percentage="tasks.percentage" class="item_value" />
        </div>
        <div v-if="tasks.type === '1'" class="list_file">
          <div v-for="(item, index) in tasks.fileList" :key="index" class="file_item">
            <div class="file_item_left">
              <div class="file_item_left_name">
                <div>{{ item.fileName }}</div>
                <el-icon v-if="item.status === 1" style="color: #086df4"><Loading /></el-icon>
                <el-icon v-if="item.status === 2" style="color: #1fcc1a"><Check /></el-icon>
                <el-icon v-if="item.status === 3" style="color: #ea3a45"><CircleCloseFilled /></el-icon>
              </div>
              <el-progress
                v-if="item.status === 2"
                :percentage="100"
                :stroke-width="2"
                class="file_item_left_progress"
                status="success"
              />
              <el-progress
                v-if="item.status === 1"
                :percentage="100"
                :format="format"
                :stroke-width="2"
                :indeterminate="true"
                class="file_item_left_progress"
              />
              <el-progress
                v-if="item.status === 3"
                :percentage="0"
                :stroke-width="2"
                class="file_item_left_progress"
              />
            </div>
            <el-popconfirm title="是否确认删除该文件？" @confirm="handleDelete(item.id)">
              <template #reference>
                <el-icon><Delete style="margin-top: 7px; cursor: pointer" /></el-icon>
              </template>
            </el-popconfirm>
          </div>
        </div>
        <div v-if="tasks.type === '2'" class="project_item" style="margin-bottom: 0">
          <div class="item_label">知识库<i style="color: red; margin-right: 5px">*</i></div>
          <el-select
            v-model="tasks.knowledgeBase"
            class="item_value"
            placeholder="请选择"
            style="height: 30px"
            @change="changeSelect"
          >
            <el-option
              v-for="item in tasks.knowledgeBaseOption"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
        <TreeTransfer
          v-if="tasks.type === '2'"
          :tree-data="tData"
          @change-doc-file-list="changeDocFileList"
        ></TreeTransfer>
      </div>

      <FileParse
        v-if="activeStep === 1 && !isParseOver"
        :task-id="taskId"
        :is-parse-over="isParseOver"
        @change-is-parse-over="changeIsParseOver"
      ></FileParse>

      <FileLabel v-if="activeStep === 1 && isParseOver" :task-id-param="taskIdParam"></FileLabel>
      <div class="content_bottom">
        <el-button @click="reback('')">取消</el-button>
        <el-button v-if="activeStep === 0" type="primary" :disabled="!isUploadOver" @click="handleNext">
          执行解析
        </el-button>
        <el-button v-else type="primary" :disabled="!isParseOver" @click="handleNext"> 生成图谱 </el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  createGraph,
  deleteFile,
  getLibrarys,
  getLibrarysTree,
  getProgress,
  parseDocBaseTask,
  parseLocalTask,
  uploadFile,
} from "@/admin/api/graphConstruction";
import { getChildData } from "@/admin/utils/getChildData";
import { ArrowLeftBold, Check, CircleCloseFilled, Delete, Loading, Upload } from "@element-plus/icons-vue";

import { ElMessage } from "element-plus";
import { h, onBeforeUnmount, onMounted, reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import TreeTransfer from "../components/TreeTransfer.vue";
import FileLabel from "./components/FileLabel.vue";
import FileParse from "./components/FileParse.vue";

const route = useRoute();
const router = useRouter();
// todo
const projectId = ref(route.query?.projectId);
const taskIdParam = ref(route.query?.taskId);

const reback = (param: string) => {
  router.push({
    path: "/admin/knowledge",
  });
};
/**
 * @params taskStatus
 * 1 上传中
 * 2 解析中
 * 3 标注中
 * 4 构建图谱中
 * 5 构建完成
 */
const taskStatus = ref(0);
// 进度条
const taskStep = ref([
  {
    title: "选择文档",
  },
  {
    title: "文本标注",
  },
]);
const activeStep = ref(0);
const isParseOver = ref(false); // 文档解析是否解析完成
const changeIsParseOver = (val) => {
  if (val) {
    setTimeout(() => {
      isParseOver.value = val;
    }, 1000);
  }
};

const uploadFileList = ref([]); // 本地上传文件时选中
const taskId = ref(""); // 本地上传文件的任务号
const isUploadOver = ref(true); // 本地文件上传是否100%结束
const format = (percentage) => (percentage === 100 ? "Full" : `${percentage}%`);
// 构建任务
const tasks = reactive({
  name: "",
  notes: "",
  type: "1",
  fileList: [],
  percentage: 0,
  knowledgeBase: "",
  knowledgeBaseOption: [],
  docFileList: [], // 选择的知识库列表
});

const changeDocFileList = (val: Array<any>) => {
  tasks.docFileList = val;
};

// 上传发生变化钩子
const handleFileChange = (file, fileList) => {
  // 判断上传文件是否已存在
  const existFile = fileList.slice(0, fileList.length - 1).find((f: any) => f.name === file.name);
  if (existFile) {
    fileList.pop();
  }
  for (let i = 0; i < tasks.fileList.length; i++) {
    for (let j = 0; j < fileList.length; j++) {
      if (tasks.fileList[i].fileName === fileList[j].name) {
        fileList.splice(j, 1);
      }
    }
  }
  uploadFileList.value = fileList;
  debouncedHandleUpload();
};

function debounce(func, delay) {
  let timerId;
  return function (...args) {
    clearTimeout(timerId);

    timerId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}

const timer = ref(null); // 定时器
// 本地导入
const handleUpload = async () => {
  if (!isUploadOver.value) {
    return;
  }
  isUploadOver.value = false;
  const formData = new FormData();
  if (uploadFileList.value.length === 0) {
    return;
  } else {
    uploadFileList.value.map((item) => {
      formData.append("files", item.raw);
    });
  }
  if (taskId.value) {
    formData.append("taskId", taskId.value);
  }
  const res: any = await uploadFile(formData);
  if (res.code === 200) {
    taskId.value = res?.data?.taskId ?? "";
    // tudo
    tasks.fileList =
      res?.data?.docInfos.map((item) => {
        return {
          ...item,
        };
      }) ?? [];

    if (!isUploadOver.value) {
      timer.value = setInterval(async () => {
        const res = await getProgress(taskId.value);
        if (res.code === 200) {
          tasks.percentage = res?.data?.percentage;
          tasks.fileList =
            res?.data?.docInfos.map((item) => {
              return {
                ...item,
              };
            }) ?? [];
          isUploadOver.value = tasks.percentage === 100;
          if (isUploadOver.value) {
            clearInterval(timer.value);
          }
        }
      }, 600);
    }
  } else {
    ElMessage.error(res.msg);
  }
};
const debouncedHandleUpload = debounce(handleUpload, 800);

// 删除上传中的文件
const handleDelete = async (id: string) => {
  const res: any = await deleteFile(id);
  if (res.code === 200) {
    tasks.fileList = tasks.fileList.filter((item) => item.id !== id);
  } else {
    ElMessage.error(res.msg);
  }
};

// 文档类型改变时一些初始化操作
const changeRadio = () => {
  // todo
  taskId.value = "";
  if (tasks.type === "2") {
    tasks.knowledgeBase = "";
    tData.value = [];
    tasks.docFileList = [];
  } else if (tasks.type === "1") {
    tasks.fileList = [];
    tasks.percentage = 0;
    uploadFileList.value = [];
    isUploadOver.value = true;
  }
};

// 获取所有知识库选项
const getAllDocOption = async () => {
  const res: any = await getLibrarys();
  if (res.code === 200) {
    tasks.knowledgeBaseOption = res?.data.map((item) => {
      return {
        value: item.id,
        label: item.name,
      };
    });
  }
};

// 知识库选中项修改,获取对应列表树
const changeSelect = async () => {
  const res: any = await getLibrarysTree(tasks.knowledgeBase);
  if (res.code === 200) {
    const arr = res?.data;
    tData.value = getChildData(arr);
  }
};

// 点击执行解析按钮
const execute = async () => {
  if (!tasks.name.trim()) {
    return ElMessage.warning("请输入任务名称！");
  } else if (!tasks.type) {
    return ElMessage.warning("请选择文档类型！");
  } else if (!tasks.fileList.length && tasks.type === "1") {
    return ElMessage.warning("请至少上传一个文件！");
  } else if (!tasks.docFileList.length && tasks.type === "2") {
    return ElMessage.warning("请至少上传一个文件！");
  }
  const json =
    tasks.type === "1"
      ? {
          taskId: taskId.value,
          projectId: projectId.value,
          remark: tasks.notes,
          taskName: tasks.name,
        }
      : {
          taskId: taskId.value,
          projectId: projectId.value,
          remark: tasks.notes,
          taskName: tasks.name,
          docInfos: tasks.docFileList,
        };

  const res: any =
    tasks.type === "1"
      ? await parseLocalTask(json) // 本地文件上传的执行解析
      : await parseDocBaseTask(json); // 知识库上传的执行解析
  if (res.code === 200) {
    taskId.value = res?.data?.id;
    taskIdParam.value = res?.data?.id;
    activeStep.value++;
    router.push({
      query: {
        projectId: projectId.value,
        taskId: taskIdParam.value,
        status: 3,
      },
    });
  } else {
    ElMessage.error(res.msg);
  }
};

// 生成图谱
const createGraphFn = async () => {
  await createGraph(taskIdParam.value)
    .then((res: any) => {
      if (res.code === 200) {
        reback("");
      } else {
        ElMessage.error(res.msg);
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

// 点击按钮执行下一步
const handleNext = () => {
  switch (activeStep.value) {
    case 0:
      execute();
      break;
    case 1:
      createGraphFn();
      break;
    default:
      break;
  }
};

// 知识库穿梭框文件列表
const tData = ref([]);

onMounted(() => {
  getAllDocOption();
  if (route.query.status && Number(route.query.status) > 1) {
    taskStatus.value = Number(route.query.status);
    activeStep.value++;
    isParseOver.value = true;
  }
});
onBeforeUnmount(() => {
  clearInterval(timer.value);
});
</script>

<style lang="scss">
@import "src/styles/theme";
.project_flow {
  width: 100%;
  height: 100%;
  background: $background-color-light;
  padding: 22px $padding-md 18px $padding-md;

  // &_header {
  //   height: 20px;
  //   font-size: $font-size-base;
  //   color: $text-color-primary;
  //   display: flex;
  //   align-items: center;
  //   margin-bottom: 7px;
  // }
  .back {
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    width: 55px;
    cursor: pointer;
    svg {
      width: 12px;
      margin-right: 5px;
    }
  }
  &_content {
    width: 100%;
    height: calc(100% - 27px);
    padding: 15px $padding-xl;
    background: #ffffff;
    border-radius: $border-radius-md;
    position: relative;

    .content_top {
      font-size: $font-size-xl;
      color: $text-color-primary;
      height: 32px;
      line-height: 32px;
      font-weight: 700;
      margin-bottom: 48px;
    }

    .content_steps {
      max-width: 600px;
      height: 57px;
      margin: 0 auto;
      margin-bottom: 20px;

      .el-step__head {
        .el-step__line {
          background-color: #f0f3fa;
        }
        .el-step__icon {
          width: 24px !important;
          .el-icon {
            display: flex;
            justify-content: center;
            align-items: center;

            .dot {
              width: 8px;
              height: 8px;
              border-radius: 50%;
              background-color: #d6dae6;
            }

            .cueent_dot {
              background-color: #086df4;
            }
          }
        }
      }

      .el-step__main {
        .el-step__title {
          color: #6d7587;
          line-height: 18px;
        }
      }
    }

    .content_middle {
      width: 100%;
      height: calc(100% - 189px);
      max-height: calc(100% - 189px);
      overflow: scroll;
      margin-bottom: 14px;

      .project_item {
        //todo
        // width: 560px;
        width: 700px;
        display: flex;
        align-items: center;
        //justify-content: space-between;
        margin: $margin-lg auto;

        .item_label {
          height: 23px;
          line-height: 23px;
          width: 75px;
          margin-right: 5px;
          font-size: $font-size-base;
          display: flex;
          justify-content: end;
          color: #6d7587;
        }

        .item_value {
          width: 480px;

          // .item-upload-wrapper {
          //   display: flex;
          //   align-items: center;
          // }
        }

        .item_value_upload {
          display: flex;
          align-items: center;
          //justify-content: space-between;
        }

        .item_upload {
          .item_upload_wrapper {
            .wrapper_action {
              .el-icon {
                color: #086df4;
              }
              height: 22px;
              display: flex;
              align-items: center;
            }
          }
        }
      }

      .list_file {
        width: 700px;
        // width: 560px;
        margin: 0 auto;
        padding-left: 80px;
        padding-right: 140px;
        .file_item {
          display: flex;
          justify-content: space-between;

          &_left {
            width: 450px;
            margin-bottom: $margin-xs;
            //margin-right: 10px;

            &_name {
              height: 30px;
              line-height: 30px;
              padding: 0 12px;
              font-size: $font-size-base;
              color: $text-color-primary;
              background: #f0f3fa;
              border-radius: $border-radius-sm;
              display: flex;
              justify-content: space-between;
              align-items: center;
            }

            &_progress {
              width: 450px;
              .el-progress__text {
                display: none;
              }
            }
          }
        }
      }

      .project_table {
        width: 700px;
        // width: 560px;
        padding-left: 80px;
        padding-right: 140px;
        margin: 0 auto;

        .el-table__header {
          .el-table_1_column_1,
          .el-table_1_column_2 {
            background: #f0f3fa;
          }
        }
      }
    }

    .middle_table {
      overflow: hidden;
    }

    .content_bottom {
      position: absolute;
      bottom: 15px;
      right: 24px;
    }
  }
}
</style>
