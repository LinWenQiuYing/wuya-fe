<template>
  <div class="container_right">
    <div class="right_header">
      <el-button type="primary" style="width: 88px; height: 30px" class="right_header_btn" @click="addTag"
        >新建</el-button
      >
      <el-input
        v-model="serachTag"
        style="width: 275px; height: 30px"
        placeholder="请输入标签名称"
        :suffix-icon="Search"
        maxlength="50"
        @keyup.enter="getTableList"
      />
    </div>
    <div class="right_content">
      <TableList
        :table-header="tableHeader"
        :table-list="tableList"
        :state="state"
        :show="true"
        :scroll-height="220"
        class="right_content_table"
        @handle-current-change="handleCurrentChange"
      >
        <template #action="{ scope }">
          <span
            style="color: #409eff; margin-right: 16px; cursor: pointer"
            @click.stop="handleEdit(scope.$index, scope.row)"
            @click="handleEdit(scope.$index, scope.row)"
            >编辑</span
          >
          <el-popconfirm title="是否确认删除该标签？" @confirm="handleDelete(scope.$index, scope.row)">
            <template #reference>
              <span style="color: #409eff; cursor: pointer" @click.stop>删除</span>
            </template>
          </el-popconfirm>
        </template>
      </TableList>
    </div>
  </div>
  <el-dialog v-model="tagVisible" :title="tagTitle" width="480px" class="tag_group_modal">
    <div class="project_item">
      <div class="item_label">标签名称<i style="color: red; margin-right: 5px">*</i></div>
      <el-input v-model="tags.tagName" class="item_value" placeholder="请输入" maxlength="50" />
    </div>
    <div class="project_item">
      <div class="item_label">类型<i style="color: red; margin-right: 5px">*</i></div>
      <el-radio-group v-model="tags.type" class="ml-4" style="height: 30px" @change="changeRadio">
        <el-radio value="1" size="large">实体</el-radio>
        <el-radio value="2" size="large">关系</el-radio>
      </el-radio-group>
    </div>
    <div v-if="tags.type === '1'" class="project_item">
      <div class="item_label">字典</div>
      <!-- <div class="item-label">请直接输入字段或是</div> -->
      <el-upload class="item_upload" accept=".xlsx" :limit="1" :before-upload="beforeUpload">
        <span style="color: #6d7587">请直接输入字段或是</span
        ><span class="item_upload_label">上传xlsx文件</span>
      </el-upload>
      <div v-if="tags.fileList.length" class="item_file">
        <div class="item_file_left">
          <el-icon><Connection /></el-icon>{{ tags.fileList[0].name }}
        </div>
        <div class="item_file_right">
          <el-icon><SuccessFilled /></el-icon>解析成功
        </div>
      </div>
      <el-input
        v-model="tags.dicContent"
        class="item_value"
        style="height: 52px"
        :autosize="{ minRows: 2, maxRows: 2 }"
        type="textarea"
        placeholder="请在每个字段之间使用英文逗号分隔，例如事件一,事件二"
      />
    </div>

    <div v-if="tags.type === '2'" class="project_item">
      <div class="item_label">开始节点<i style="color: red; margin-right: 5px">*</i></div>
      <el-select v-model="tags.start" class="item_value" placeholder="请选择" style="height: 30px">
        <el-option v-for="item in tags.tagOption" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
    </div>

    <div v-if="tags.type === '2'" class="project_item">
      <div class="item_label">结束节点<i style="color: red; margin-right: 5px">*</i></div>
      <el-select v-model="tags.end" class="item_value" placeholder="请选择" style="height: 30px">
        <el-option v-for="item in tags.tagOption" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
    </div>

    <div class="project_item">
      <div class="item_label">备注</div>
      <el-input
        v-model="tags.notes"
        class="item_value"
        style="height: 52px"
        :autosize="{ minRows: 2, maxRows: 2 }"
        type="textarea"
        placeholder="请输入"
      />
    </div>
    <template #footer>
      <div class="dialog_footer">
        <el-button @click="tagCancel">取消</el-button>
        <el-button type="primary" @click="tagConfirm"> 确定 </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import {
  createTag,
  deleteTag,
  getAllTag,
  getTagByPage,
  parseFile,
  updateTag,
} from "@/admin/api/graphConstruction";
import { Connection, Search, SuccessFilled } from "@element-plus/icons-vue";
import dayjs from "dayjs";
import { ElMessage } from "element-plus";
import { onMounted, reactive, ref, watch } from "vue";
import TableList from "../../components/TableList.vue";

const props = defineProps<{
  choosedTagGroupId: string;
}>();

// 分页
const state = reactive({
  total: 0,
  pageNum: 1,
  pageSize: 20,
});

const handleCurrentChange = (val: number) => {
  state.pageNum = val;
};

const serachTag = ref("");
// 标签列表
const tableHeader = ref([
  {
    prop: "name",
    label: "标签名",
    template: false, // 确认使用插槽时给布尔值
  },
  {
    prop: "type",
    label: "类型",
    template: false, // 确认使用插槽时给布尔值
  },
  {
    prop: "time",
    label: "创建时间",
    template: false, // 确认使用插槽时给布尔值
  },
  {
    prop: "action",
    label: "操作",
    template: true, // 确认使用插槽时给布尔值
    width: 180,
  },
]);

const tableList = ref([]);

watch(
  () => state.pageNum,
  () => {
    getTableList();
  },
);
watch(
  () => state.pageSize,
  () => {
    getTableList();
  },
);
watch(
  () => props.choosedTagGroupId,
  () => {
    getTableList();
  },
);

// 分页获取标签组列表
const getTableList = async () => {
  const json = {
    tagGroupId: props.choosedTagGroupId,
    tagName: serachTag.value ? serachTag.value : undefined,
    pageNo: state.pageNum,
    pageSize: state.pageSize,
  };
  const res: any = await getTagByPage(json);
  if (res.code === 200) {
    state.total = res?.data?.totalCount;
    tableList.value =
      res?.data?.dateList.map((item) => {
        return {
          ...item,
          name: item.tasTag.tagName,
          id: item.tasTag.id,
          type: item.tasTag.tagType === 1 ? "实体" : "关系",
          time: dayjs(item.tasTag.createTime).format("YYYY-MM-DD HH:mm:ss"),
        };
      }) ?? [];
  }
};

// 获取所有实体点
const getAllTags = async () => {
  const json = {
    tagGroupId: props.choosedTagGroupId,
  };
  const res: any = await getAllTag(json);
  if (res.code === 200) {
    tags.tagOption =
      res?.data.map((item) => {
        return {
          ...item,
          value: item.tasTag.id,
          label: item.tasTag.tagName,
        };
      }) ?? [];
  }
};

const currentTagId = ref("");
// 列表标签的删除、编辑
const handleEdit = (index: number, row) => {
  currentTagId.value = row.id;
  tags.fileList = [];
  tags.tagName = row.name;
  tags.type = row.type === "实体" ? "1" : "2";
  if (tags.type === "1") {
    tags.dicContent = row.tasTag.dictionaryContent;
  } else {
    tags.start = row.relation.srcTagId;
    tags.end = row.relation.dstTagId;
  }
  tags.notes = row.tasTag.remark;
  tagTitle.value = "编辑标签";
  tagVisible.value = true;
};
const handleDelete = async (index: number, row) => {
  const res: any = await deleteTag({ id: row.id });
  if (res.code === 200) {
    getTableList();
  } else {
    ElMessage.error(res.msg);
  }
};

// 新建标签
const tags = reactive({
  tagName: "",
  type: "1",
  fileList: [], // 上传文件
  dicContent: "", // 解析字典内容
  start: "",
  end: "",
  tagOption: [],
  notes: "",
});
const tagVisible = ref(false);
const tagTitle = ref("");
const initTags = () => {
  tags.tagName = "";
  tags.type = "1";
  tags.fileList = [];
  tags.dicContent = "";
  tags.start = "";
  tags.end = "";
  tags.notes = "";
};
watch(
  () => tagVisible.value,
  () => {
    if (tagVisible.value) {
      getAllTags();
    }
  },
);
const addTag = () => {
  if (!props.choosedTagGroupId) {
    return ElMessage.warning("请先选择左侧标签组！");
  }
  tagTitle.value = "新建标签";
  initTags();
  tagVisible.value = true;
};
const tagConfirm = async () => {
  if (!tags.tagName.trim()) {
    return ElMessage.warning("标签名称不能为空！");
  } else if (tags.type === "2" && !tags.start) {
    return ElMessage.warning("关系标签的开始节点不能为空！");
  } else if (tags.type === "2" && !tags.end) {
    return ElMessage.warning("关系标签的结束节点不能为空！");
  }
  const json =
    tags.type === "1"
      ? {
          tasTag: {
            id: tagTitle.value === "新建标签" ? undefined : currentTagId.value,
            tagGroupId: props.choosedTagGroupId,
            tagName: tags.tagName,
            tagType: 1,
            dictionaryContent: tags.dicContent,
            remark: tags.notes,
          },
          relation: null,
        }
      : {
          tasTag: {
            id: tagTitle.value === "新建标签" ? undefined : currentTagId.value,
            tagGroupId: props.choosedTagGroupId,
            tagName: tags.tagName,
            tagType: 2,
            remark: tags.notes,
          },
          relation: {
            srcTagId: tags.start,
            dstTagId: tags.end,
          },
        };
  const res: any = tagTitle.value === "新建标签" ? await createTag(json) : await updateTag(json);
  if (res.code === 200) {
    getTableList();
  } else {
    ElMessage.error(res.msg);
  }
  tagVisible.value = false;
};
const tagCancel = () => {
  tagVisible.value = false;
};

// 导入
const beforeUpload = async (file) => {
  const fileName = file.name.split(".")[0];
  const formData = new FormData();
  formData.append("file", file);
  const res: any = await parseFile(formData);
  if (res.code === 200) {
    tags.fileList = [
      {
        name: fileName,
      },
    ];
    tags.dicContent = res?.data ?? "";
  } else {
    ElMessage.error(res.msg);
  }
};
onMounted(() => {});
</script>

<style lang="scss">
@import "src/styles/theme";
.container_right {
  width: calc(100% - 320px);
  height: 100%;
  padding: $padding-xl 22px;
  border-top: 1px solid #e0e4f1;

  .right_header {
    width: 100%;
    height: 30px;
    margin-bottom: $margin-md;
    display: flex;
    justify-content: space-between;
    align-items: center;

    &_btn {
      width: 60px !important;
    }
  }

  .right_content {
    width: 100%;
    height: calc(100% - 46px);
    position: relative;

    &_table {
      .el-table--fit {
        max-height: calc(100% - 40px);
        min-height: 80px;
      }

      .el-table__body-wrapper {
        .el-scrollbar__wrap {
          color: $text-color-primary;
        }
      }

      .el-pagination {
        position: absolute;
        bottom: 0;
        right: 0;
      }
    }
  }
}
</style>
