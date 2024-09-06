<!-- 图谱构建-项目信息 -->
<template>
  <div :class="['content_middle']">
    <div class="pre_tag">
      <div class="pre_tag_des">
        <div class="des_label">支持预标注标签：</div>
        <div class="des_value">{{ preLabel }}</div>
      </div>
      <el-button type="primary" @click="preAnnotationFn">预标注</el-button>
      <div class="pre_tag_progress">
        <el-progress :percentage="state.processValue" />
        <div class="pre_tag_progress_des">
          {{ state.processValue === 100 ? "预标注完成" : "请等待预标注完成后修改标注结果" }}
        </div>
      </div>
    </div>
    <div class="tag_content">
      <div class="tag_content_left">
        <div class="tag_content_left_top">
          <div class="top_icon first">
            <NodeGraphIcon style="width: 24px; height: 24px; fill: #029be6" />
          </div>
          <div class="top_item">
            <div class="top_item_value">{{ state.nodeNum }}</div>
            <div class="top_item_label">实体数</div>
          </div>
          <div class="top_icon second">
            <RelationGraphIcon style="width: 24px; height: 24px; fill: #994ad4" />
          </div>
          <div class="top_item">
            <div class="top_item_value">{{ state.relationNum }}</div>
            <div class="top_item_label">关系数</div>
          </div>
        </div>
        <div class="tag_content_left_table">
          <div class="table_top">
            <div class="table_top_left">文档列表</div>
            <div class="table_top_right" @click="exportSampleSetFn">导出样本集</div>
          </div>
          <TableList
            ref="annotationListRef"
            :table-header="tableHeader"
            :table-list="tableList"
            :scroll-height="561"
            :show="false"
            :layout="layout"
            :is-current-high-light="true"
            class="left_table"
            @annotation-select-change="selectChangeFn"
          >
          </TableList>
        </div>
      </div>
      <div class="tag_content_right">
        <div class="page-controller">
          <ArrowLeftIcon
            style="height: 16px; fill: #2d364d"
            class="controller-icon left"
            :class="{ disabled: state.pageInfo.pageCount === 0 }"
            @click="changeAnnotationPage('prev')"
          />
          <span>{{ state.pageInfo.pageTitle }}</span>
          <ArrowRightIcon
            style="height: 16px; fill: #2d364d"
            class="controller-icon right"
            :class="{
              disabled: state.pageInfo.pageCount === tableList.length - 1,
            }"
            @click="changeAnnotationPage('next')"
          />
        </div>
        <iframe v-if="state.showFrame" class="annotation-page" :src="state.frameUrl"></iframe>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  exportSampleSet,
  getBuildTaskById,
  preAnnotation,
  preAnnotationProcess,
} from "@/admin/api/graphConstruction";
import { ElMessage } from "element-plus";
import { nextTick, onMounted, reactive, ref } from "vue";
import TableList from "../../components/TableList.vue";
import ArrowLeftIcon from "@/admin/icons/arrow-left-circle.svg";
import ArrowRightIcon from "@/admin/icons/arrow-right-circle.svg";
import NodeGraphIcon from "@/admin/icons/graph-node.svg";
import RelationGraphIcon from "@/admin/icons/graph-relation.svg";

const props = defineProps<{
  taskIdParam: string;
}>();
const annotationListRef = ref(null);
const layout = ref("total, jumper");
const tableHeader = ref([
  {
    prop: "fileName",
    label: "文档名",
    width: 278,
    template: false, // 确认使用插槽时给布尔值
  },
  {
    prop: "entityCount",
    label: "实体数",
    width: 90,
    template: false,
  },
  {
    prop: "relationCount",
    label: "关系数",
    width: 90,
    template: false,
  },
]);
const tableList = ref([]);
const preLabel = ref(""); //支持标注标签
const state = reactive({
  nodeNum: 0,
  relationNum: 0,
  showFrame: false,
  frameUrl: "",
  pageInfo: {
    pageTitle: "",
    pageCount: 0,
  },
  processTimer: null,
  processValue: 0,
  activeDocId: "",
});

const getAnnotationList = async () => {
  const res: any = await getBuildTaskById(props.taskIdParam);
  state.nodeNum = res.data.entityCount;
  state.relationNum = res.data.relationCount;
  tableList.value = res.data.fileInfos;
  preLabel.value = res.data.preLabels?.length ? res.data.preLabels?.toString() : "无";
  annotationListRef.value.setDefaultCurrentRow(tableList.value[0]);
  state.pageInfo.pageTitle = res.data.fileInfos[0].fileName;
  selectChangeFn(res.data.fileInfos[0].id);
  state.activeDocId = res.data.fileInfos[0].id;
};
const changeAnnotationPage = (type: string) => {
  if (type === "prev") {
    state.pageInfo.pageCount--;
  } else if (type === "next") {
    state.pageInfo.pageCount++;
  }
  selectChangeFn(tableList.value[state.pageInfo.pageCount].id);
  state.activeDocId = tableList.value[state.pageInfo.pageCount].id;
  annotationListRef.value.setDefaultCurrentRow(tableList.value[state.pageInfo.pageCount]);
};
const selectChangeFn = (id: string) => {
  state.showFrame = false;
  state.frameUrl = `http://172.18.20.141:18089/#/?taskDocId=${id}`; //发布地址
  //state.frameUrl = `http://172.18.124.39:18098/#/?taskDocId=${id}`;
  //state.frameUrl = `http://172.18.124.39:18099/#/?taskDocId=${id}`;
  //state.frameUrl = `http://localhost:7777/#/?taskDocId=${id}`;
  nextTick(() => {
    state.showFrame = true;
  });
};
const exportSampleSetFn = async () => {
  const res: any = await exportSampleSet(props.taskIdParam);
  const blob = new Blob([res.file], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = res.fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
const preAnnotationFn = async () => {
  const res = await preAnnotation(props.taskIdParam);
  state.processTimer = setInterval(() => {
    const flag = preAnnotationProcessFn(res.data.id);
    if (flag) clearInterval(state.processTimer);
  }, 2000);
};
const preAnnotationProcessFn = async (id: string) => {
  preAnnotationProcess(id).then((res: any) => {
    if (res.code === 200) {
      if (res.data === 100) {
        state.processValue = res.data;
        selectChangeFn(state.activeDocId);
        return true;
      } else {
        return false;
      }
    } else {
      ElMessage.error(res.msg);
    }
  });
};
onMounted(() => {
  getAnnotationList();
});
</script>

<style lang="scss">
@import "src/styles/theme";
.pre_tag {
  width: 100%;
  height: 42px;
  display: flex;
  align-items: center;
  margin-bottom: $margin-xl;

  &_des {
    display: flex;
    height: 22px;
    align-items: center;
    margin-right: 22px;

    .des_label {
      font-size: $font-size-base;
      color: #6d7587;
      margin-right: $margin-xs;
    }

    .des_value {
      width: 168px;
      height: 22px;
      line-height: 22px;
      font-size: $font-size-base;
      color: $text-color-primary;
      font-weight: 700;
      display: inline-block;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  &_progress {
    margin-left: $margin-md;
    width: 480px;

    &_des {
      font-size: $font-size-sm;
      color: #6d7587;
      line-height: 20px;
    }
  }
}

.tag_content {
  width: 100%;
  height: calc(100% - 66px);
  display: flex;
  justify-content: space-between;

  &_left {
    width: 460px;
    height: 100%;

    &_top {
      width: 100%;
      height: 90px;
      border: 1px;
      padding: 22px 28px $padding-lg 22px;
      display: flex;
      justify-content: space-between;
      align-items: center;

      margin-bottom: $margin-md;

      .top_icon {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 48px;
        height: 48px;
        border-radius: 100%;
      }

      .top_icon.first {
        background: #e6fbff;
      }
      .top_icon.second {
        background: #fbf0ff;
      }

      .top_item {
        &_value {
          font-size: $font-size-xl;
          color: $text-color-primary;
          line-height: 28px;
          font-weight: 700;
          text-align: right;
        }

        &_label {
          font-size: $font-size-sm;
          color: #6d7587;
          text-align: right;
          line-height: 20px;
        }
      }
    }

    &_table {
      width: 100%;
      height: calc(100% - 106px);
      padding: $padding-sm 0 $padding-sm 0;

      .table_top {
        width: 100%;
        height: 22px;
        padding: 0 $padding-sm 0 $padding-sm;
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 13px;

        &_left {
          font-size: $font-size-base;
          color: $text-color-primary;
          line-height: 22px;
          font-weight: 700;
        }

        &_right {
          font-size: $font-size-base;
          color: #409eff;
          text-align: right;
          line-height: 22px;
          cursor: pointer;
        }
      }

      .left_table {
        height: calc(100% - 35px) !important;
        //position: relative;

        .el-table__header {
          .el-table__cell {
            background: #f0f3fa;
            color: #2d364d;
          }
        }

        .el-table__inner-wrapper::before {
          background-color: transparent !important;
        }
      }
    }
  }

  &_right {
    width: calc(100% - 476px);
    height: 100%;
    padding: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    .page-controller {
      span {
        font-size: 14px;
        font-weight: bold;
        position: relative;
        top: -2px;
      }
      .controller-icon {
        cursor: pointer;
      }
      .controller-icon.left {
        margin-right: 20px;
      }
      .controller-icon.right {
        margin-left: 20px;
      }
      .controller-icon.disabled {
        cursor: not-allowed;
        opacity: 0.4;
      }
    }
    .annotation-page {
      width: 100%;
      height: 100%;
      border: 1px solid transparent;
    }
  }

  &_left_top,
  &_left_table,
  &_right {
    background: #ffffff;
    border: 1px solid rgba(224, 228, 241, 1);
    border-radius: $border-radius-md;
  }
}
</style>
