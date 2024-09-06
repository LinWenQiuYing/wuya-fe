<template>
  <div
    v-loading="state.loading"
    class="ctxmenuBox_container"
    :style="{ left: props.data.x, top: props.data.y }"
  >
    <el-tabs v-model="state.activeName" type="border-card" class="demo-tabs">
      <el-tab-pane v-if="props.data.type === 'nodes'" label="关系探索" name="1">
        <div v-if="state.links.length > 0" class="property">
          <div class="each_type">
            <el-checkbox-group v-model="state.chooseLinks" size="small">
              <el-checkbox-button v-for="link in state.links" :key="link.label" :label="link.label">{{
                link.label
              }}</el-checkbox-button>
            </el-checkbox-group>
          </div>
          <div class="counterTool">
            <div class="title">关系数量</div>
            <div class="counterTool">
              <el-input-number v-model="state.num" :min="1" :max="1000" />
            </div>
          </div>
          <div class="btn">
            <el-button type="primary" @click.stop="handleClickSure('ship')">确定</el-button>
          </div>
        </div>
        <template v-else class="property">
          <el-empty description="暂无数据" :image-size="50" />
        </template>
      </el-tab-pane>
      <el-tab-pane v-if="props.data.type === 'nodes'" label="实体编辑" name="2">
        <div class="property">
          <div class="each_type">
            <el-form
              ref="propertyRef"
              :model="state.property"
              label-width="100px"
              class="demo-ruleForm"
              status-icon
            >
              <el-form-item
                v-for="nodeKey in Object.keys(state.property)"
                :key="nodeKey"
                :label="nodeKey + ':'"
                :prop="nodeKey"
                :rules="{
                  required: true,
                  message: '输入不能为空',
                  trigger: 'blur',
                }"
              >
                <el-input v-model="state.property[nodeKey]" />
              </el-form-item>
            </el-form>
          </div>
          <div class="btn">
            <el-button type="primary" @click.stop="handleClickSure('node')">确定</el-button>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane v-if="props.data.type === 'edges'" label="关系编辑" name="1">
        <div class="property">
          <div class="each_type">
            <el-form
              ref="propertyRef"
              :model="state.property"
              label-width="100px"
              class="demo-ruleForm"
              status-icon
            >
              <el-form-item
                v-for="shipKey in Object.keys(state.property)"
                :key="shipKey"
                :label="shipKey + ':'"
                :prop="shipKey"
                :rules="{
                  required: true,
                  message: '输入不能为空',
                  trigger: 'blur',
                }"
              >
                <el-input v-model="state.property[shipKey]" />
              </el-form-item>
            </el-form>
          </div>
          <div class="btn">
            <el-button type="primary" @click.stop="handleClickSure('ship')">确定</el-button>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script lang="ts" setup>
/**
 * 右键事件流程
 * 右键实体 ->
 */
import { reactive, watch } from "vue";
import { ElMessage } from "element-plus";
// import { targetSource, relation } from '/@/api/index';
// import { deepClone } from '/@/utils/deepClone';

const props = defineProps<{
  data: Record<string, unknown>;
}>();

const emits = defineEmits(["handleCtxData"]);
const state = reactive({
  bluePrintId: "",
  currentInfo: {
    id: "",
    uuid: "",
    label: "",
    userId: "",
  },
  activeName: "1",
  loading: true,
  num: 3,
  chooseLinks: [],
  allLinks: [],
  nodeBase: [],
  links: [],
  graphData: {},
  property: {},
});

// 获取node节点 和所有的关系
const getNodeAndRelation = async () => {
  state.links = [];
  await relation.queryRelationByNodeLabel(props.data.bluePrintId, props.data.data.label).then((result) => {
    if (result?.length > 0) {
      result.map((item) => {
        state.links.push(item);
      });
    }
  });

  state.loading = false;
};

//弹窗确定
const handleClickSure = async (type: string) => {
  if (type == "ship" && props.data.type === "nodes") {
    if (state.chooseLinks.length < 1) {
      ElMessage({
        message: "请选择关系类型",
        type: "warning",
      });
    } else {
      let data = {
        type: state.chooseLinks,
        num: state.num,
      };
      getHandleSendData(data);
    }
  } else if (type == "node" && props.data.type === "nodes") {
    if (props.data.bluePrintId) {
      await targetSource
        .updatePropertiesByNodeId(props.data.bluePrintId, {
          // ...state.currentInfo,
          nodeId: state.currentInfo.uuid,
          properties: state.property,
          label: state.currentInfo.label,
          userId: state.currentInfo.userId,
        })
        .then(() => {
          ElMessage.success("修改节点属性成功!");
          emits(
            "handleCtxData",
            {
              nodeProperty: state.property,
              currentInfo: state.currentInfo,
            },
            "nodeProperty",
          );
        });
    }
  } else {
    if (props.data.bluePrintId) {
      await targetSource
        .updatePropertiesByRelationId(props.data.bluePrintId, {
          relationId: state.currentInfo.id && state.currentInfo.id.replace("edges", ""),
          properties: state.property,
          label: state.currentInfo.label,
        })
        .then(() => {
          ElMessage.success("修改关系属性成功!");
          emits(
            "handleCtxData",
            {
              shipProperty: state.property,
              currentInfo: state.currentInfo,
            },
            "shipProperty",
          );
        });
    }
  }
};

/**
 * 多节点关系的处理
 */
const getHandleSendData = async (value) => {
  const dataParams = {
    id: props.data.data.uuid,
    label: props.data.data.label,
    relationLabel: value.type,
    limit: value.num,
    userId: props.data.data.userId,
  };

  let data = {
    dataParams,
    nodeData: props.data.data,
    isCtxClick: true,
  };

  emits("handleCtxData", data, "ship");
};

watch(
  () => props.data,
  () => {
    if (Object.keys(props.data).length > 0) {
      state.currentInfo = {
        id: props.data.data.id,
        uuid: props.data.data.uuid,
        label: props.data.data.label,
        userId: props.data.data.userId,
      };
      state.property = deepClone(props.data.data.properties);
      if (props.data.type === "nodes") {
        getNodeAndRelation();
      } else {
        state.loading = false;
      }
    }
  },
  {
    deep: true,
    immediate: true,
  },
);
</script>
<style lang="scss" scoped>
@import "src/styles/theme";
.ctxmenuBox_container {
  position: absolute;
  width: 350px;
  height: 400px;
  padding: 10px;
  left: 0;
  top: 10px;
  z-index: 1001;
  border-radius: 5px;
  background-color: rgba(254, 253, 253, 0.9333333333);
  box-shadow:
    20px 20px 60px #bebebe,
    -20px -20px 60px #a09e9e;
  .title {
    font-size: 16px;
    font-weight: bolder;
    margin-bottom: 10px;
  }

  .property {
    width: 100%;
    height: 310px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .each_type {
      height: calc(100% - 60px);
      overflow: auto;
      span {
        display: inline-block;
        margin: 5px;
        padding: 0px 5px;
        background: #fff;
        border: 1px solid #909399;
        color: #909399;
        height: 22px;
        min-width: 20px;
        text-align: center;
        line-height: 23px;
        font-size: 12px;
        border-radius: 20px;
        cursor: pointer;
      }
    }

    .btn {
      text-align: right;
    }
  }

  .active {
    background: #79bbff !important;
    border: 1px solid #79bbff !important;
    color: #fff !important;
  }

  .el-checkbox-button {
    display: inline-block;
    height: 27px;
  }
  .is-checked {
    span {
      border: 1px solid #4c77cd !important;
    }
  }
  .el-checkbox-button__inner {
    border-radius: 10px !important;
    border: 1px solid #909399 !important;
  }
}

:deep(.el-tabs__content) {
  padding: 10px !important;
}
</style>
