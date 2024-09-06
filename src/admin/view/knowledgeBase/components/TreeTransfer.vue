<template>
  <div class="transfer_tree_box">
    <!--左侧待选内容-->
    <div class="select_box">
      <div class="box_title">
        <div class="box_title_left">源列表</div>
        <div class="box_title_right" @click="clickAllSelectLeft">全选</div>
      </div>
      <div class="box_content">
        <el-input
          v-model="leftFilterText"
          placeholder="请输入搜索关键字"
          class="box_input"
          :suffix-icon="Search"
          clearable
        />
        <div class="box_center">
          <el-tree
            ref="leftTree"
            :data="params.leftData"
            :props="params.defaultProps"
            show-checkbox
            node-key="id"
            default-expand-all
            :filter-node-method="filterNode"
            empty-text="请选择知识库"
          >
            <template #default="{ node }">
              <span>{{ node.label }}</span>
            </template>
          </el-tree>
        </div>
      </div>
      <div class="box_bottom">
        <el-button plain class="bottom_btn" size="small" @click="resetLeft">重置</el-button>
      </div>
    </div>

    <!-- 中间穿梭按钮 -->
    <div class="transfer_btn">
      <div class="pick_btn" @click="towardsRight">&gt;</div>
      <div class="pick_btn" @click="towardsLeft">&lt;</div>
    </div>

    <!-- 右侧已选内容 -->
    <div class="select_box">
      <div class="box_title">
        <div class="box_title_left">目标列表</div>
        <div class="box_title_right" @click="clickAllSelectRight">全选</div>
      </div>
      <div class="box_content">
        <el-input
          v-model="rightFilterText"
          placeholder="请输入搜索关键字"
          class="box_input"
          :suffix-icon="Search"
          clearable
        />
        <div class="box_center">
          <el-tree
            ref="rightTree"
            :data="params.rightData"
            :props="params.defaultProps"
            show-checkbox
            node-key="id"
            default-expand-all
            :filter-node-method="filterNode"
            empty-text=""
          >
            <template #default="{ node }">
              <span>{{ node.label }}</span>
            </template>
          </el-tree>
        </div>
      </div>
      <div class="box_bottom">
        <el-button plain class="bottom_btn" size="small" @click="resetRight">重置</el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Search } from "@element-plus/icons-vue";
import { onMounted, reactive, ref, watch } from "vue";

const props = defineProps<{
  treeData: unknown[];
  choosedFileId: string;
}>();
const emits = defineEmits(["confirmTransfer", "changeDocFileList"]);

// 资源库文件所有可能的样式
const acceptFileType = ref(["pdf", "docx", "doc", "xlsx", "csv", "txt"]);

const params = reactive({
  defaultProps: {
    children: "children",
    label: "label",
  },
  leftData: [],
  rightData: [],
});

const leftTree = ref(null);
const rightTree = ref(null);

// 点击向右穿梭
const towardsRight = () => {
  // (leafOnly, includeHalfChecked) 接收两个 boolean 类型的参数，
  // 1. 是否只是叶子节点，默认值为 false 2. 是否包含半选节点，默认值为 false
  const checkedNodes = leftTree.value.getCheckedNodes(false, true); // 包含半选
  const checkedKeys = leftTree.value.getCheckedKeys(false);
  // console.log("向右穿梭99999999999", checkedNodes, checkedKeys);
  handleTransfer(rightTree.value, checkedNodes, checkedKeys);
  const res = handleData(params.rightData);
  emits("changeDocFileList", res);
};

// 点击向左穿梭
const towardsLeft = () => {
  const checkedNodes = rightTree.value.getCheckedNodes(false, true); // 包含半选
  const checkedKeys = rightTree.value.getCheckedKeys(false);
  handleTransfer(leftTree.value, checkedNodes, checkedKeys);
  const res = handleData(params.rightData);
  emits("changeDocFileList", res);
};

const handleTransfer = (tree, checkedNodes, checkedKeys) => {
  const copyNodes = JSON.parse(JSON.stringify(checkedNodes));
  copyNodes.forEach((x) => {
    x.children = [];
    if (!tree.getNode(x.id)) {
      tree.append(x, x.pid);
    }
  });

  checkedKeys.forEach((x) => {
    tree == rightTree.value ? leftTree.value.remove(x) : rightTree.value.remove(x);
  });
  afterToward();
  leftFilterText.value = "";
  rightFilterText.value = "";
};

// 点击全选左侧
const clickAllSelectLeft = () => {
  leftTree.value.setCheckedNodes(params.leftData);
};

// 点击全选右侧
const clickAllSelectRight = () => {
  rightTree.value.setCheckedNodes(params.rightData);
};

// 数据穿梭后
const afterToward = () => {
  leftTree.value.setCheckedKeys([]);
  rightTree.value.setCheckedKeys([]);
};

// 树形：搜索
const leftFilterText = ref("");
const rightFilterText = ref("");

watch(leftFilterText, (val) => {
  leftTree.value.filter(val);
});
watch(rightFilterText, (val) => {
  rightTree.value.filter(val);
});

const filterNode = (value, data) => {
  if (!value) return true;
  return data.label.includes(value);
};

// 左侧树重置
const resetLeft = () => {
  leftFilterText.value = "";
  leftTree.value.setCheckedNodes([]); // 取消全选
};

// 右侧树重置
const resetRight = () => {
  rightFilterText.value = "";
  rightTree.value.setCheckedNodes([]); // 取消全选
};

// 初始化
const init = () => {
  leftFilterText.value = "";
  rightFilterText.value = "";
  fileIdList.value = [];
  clickAllSelectRight();
  towardsLeft();
};

// 确定按钮
const handleConfirm = () => {
  // console.log("确定", params.leftData, params.rightData);
  fileIdList.value = [];
  const res = getLeafFileId(params.rightData);
  // console.log("筛选出来的数据", res);
  emit("confirmTransfer", res);
};

// 获取穿梭框右侧的文件叶子节点的id，如果空文件夹为叶子节点，需要剔除
const fileIdList = ref([]);
const getLeafFileId = (tree) => {
  for (const item in tree) {
    if (tree[item].children.length >= 1) {
      getLeafFileId(tree[item].children);
    } else if (acceptFileType.value.includes(tree[item].label.split(".").pop())) {
      fileIdList.value.push(tree[item].id);
    }
  }
  return fileIdList.value;
};

// 点击穿梭按钮时，处理文件数据
const handleData = (nodeList) => {
  console.log("穿梭按钮", params.rightData, params.leftData);
  const result = [];
  function getLeaf(tree) {
    for (let i = 0; i < tree.length; i++) {
      const node = tree[i];
      if ((!node.children && node.category === 2) || (!node.children.length && node.category === 2)) {
        result.push(node);
      } else {
        getLeaf(node.children);
      }
    }
  }
  getLeaf(nodeList);
  return result;
};

// 写作中已选择的文件id，反显到穿梭框的树中
// const choosedFileId = ref([]);
// watch(
//   () => props.isResourceShow,
//   () => {
//     setTimeout(() => {
//       const path = window.location.href;
//       const currentRoute = path.split("/").pop();
//       if (dialogVisible.value && currentRoute === "write") {
//         choosedFileId.value = props.choosedFileId;
//         // console.log("穿梭框接收到的数据", choosedFileId.value);
//         leftTree.value.setCheckedKeys(choosedFileId.value);
//         towardsRight();
//       }
//     }, 0);
//   },
//   { immediate: true }
// );

watch(
  () => props.treeData,
  () => {
    params.leftData = props.treeData;
    params.rightData = [];
  },
);

onMounted(() => {
  params.leftData = props.treeData;
  params.rightData = [];
  // choosedFileId.value = props.choosedFileId;
});
</script>

<style lang="scss">
@import "src/styles/theme";
.transfer_tree_box {
  display: flex;
  width: 700px;
  padding-left: 75px;
  margin: $margin-lg auto 10px auto;
  //width: 100%;
  justify-content: space-around;

  .select_box {
    border-radius: 1px;
    border: 1px solid #ccc;
    height: 320px;
    width: 280px;
    color: #ffffff;
    position: relative;

    .box_title {
      height: 39px;
      padding: 7px 10px 10px 10px;
      background: $background-color-light;
      padding: $padding-sm $padding-md;
      display: flex;
      justify-content: space-between;
      border-radius: 1px 1px 0 0;
      border-bottom: 1px solid #ccc;
      cursor: pointer;

      &_left,
      &_right {
        color: #3c485c;
        height: 22px;
        font-size: 14px;
        line-height: 22px;
      }

      &_left {
        font-weight: 600;
      }
    }

    .box_content {
      padding: $padding-md $padding-sm;
      height: calc(100% - 79px);
      padding: 7px 11px;

      .box_input {
        margin-bottom: $margin-md;
      }

      .box_center {
        height: 100%;
        width: 100%;
        max-height: 180px;
        overflow-y: auto;

        .el-tree {
          display: inline-block;
          min-width: 100%;

          span {
            display: flex;
            align-items: center;

            img {
              margin-right: $margin-xss;
            }
          }
        }
      }
    }

    .box_bottom {
      height: 40px;
      border-top: 1px solid #ccc;
      padding: $margin-xs $margin-md;
      display: flex;
      flex-direction: row-reverse;
    }

    // .bottom_btn:hover,
    // .bottom_btn:focus {
    //   background: #ffffff !important;
    //   color: var(--blue) !important;
    //   border: 1px solid var(--blue);
    // }
  }

  .transfer_btn {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .pick_btn {
      height: 32px;
      width: 32px;
      border: 1px solid rgba(214, 218, 230, 1);
      color: #2d364d;

      font-size: $font-size-xxl;
      border-radius: 100%;
      margin-top: 10px;
      text-align: center;
      line-height: 30px;
      cursor: pointer;
    }
  }
}
</style>
