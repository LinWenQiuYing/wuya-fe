<template>
  <div class="relation_left">
    <div class="left_top">
      <div class="left_top_title">标签列表</div>
      <div class="left_top_action" @click="addTag">新建标签</div>
    </div>
    <div class="left_content">
      <el-table
        border
        :data="tableList"
        class="left_content_table"
        :style="{ height: calculatedHeight }"
        empty-text="暂无数据"
      >
        <el-table-column prop="tagName" label="名称" width="168px"> </el-table-column>
        <el-table-column prop="type" label="类型" width="80px"> </el-table-column>
        <el-table-column fixed="right" label="操作" width="110px">
          <template #default="scope">
            <el-link
              type="primary"
              :underline="false"
              style="margin-right: 16px"
              @click.stop="editTag(scope.row)"
              >编辑
            </el-link>
            <el-link
              v-if="route.path.includes('/admin/knowledge')"
              type="primary"
              :underline="false"
              @click.stop
              :disabled="true"
              class="disabledBtn"
              >删除
            </el-link>
            <el-popconfirm title="是否确认删除该标签？" @confirm="delTag(scope.row)">
              <template #reference>
                <el-link
                  type="primary"
                  :underline="false"
                  @click.stop
                  v-if="!route.path.includes('/admin/knowledge')"
                  >删除
                </el-link>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>

  <el-dialog v-model="tagVisible" :title="tagTitle" width="480px" class="tag_group_modal">
    <div class="project_item">
      <div class="item_label">标签名称<i style="color: red; margin-right: 5px">*</i></div>

      <el-input
        v-model="tags.tagName"
        class="item_value"
        placeholder="请输入"
        maxlength="50"
        :disabled="editFlag"
      />
    </div>
    <div class="project_item">
      <div class="item_label">类型<i style="color: red; margin-right: 5px">*</i></div>
      <el-radio-group v-model="tags.type" class="ml-4" style="height: 30px" :disabled="editFlag">
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
      <el-select
        v-model="tags.start"
        class="item_value"
        placeholder="请选择"
        style="height: 30px"
        :disabled="editFlag"
      >
        <el-option v-for="item in tags.tagOption" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
    </div>

    <div v-if="tags.type === '2'" class="project_item">
      <div class="item_label">结束节点<i style="color: red; margin-right: 5px">*</i></div>
      <el-select
        v-model="tags.end"
        class="item_value"
        placeholder="请选择"
        style="height: 30px"
        :disabled="editFlag"
      >
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
        :disabled="editFlag"
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
  gatAllProjectNodeTag,
  gatAllProjectTag,
  parseFile,
  updateTag,
} from "@/admin/api/graphConstruction";
import { Connection, SuccessFilled } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import { computed, onMounted, reactive, ref, watch } from "vue";
import { useRoute } from "vue-router";

const props = defineProps<{
  currentProjectId: string;
}>();
const emits = defineEmits(["immediateUpdate"]);
const route = useRoute();
const editFlag = computed(() => route.path.includes("/admin/knowledge") && tagTitle.value === "编辑标签");

const calculatedHeight = computed(() => {
  if (route.path.includes("/admin/knowledge")) {
    return `calc(100vh - 270px)`;
  } else if (route.path.includes("/admin/knowledge/createKnowledge")) {
    return `calc(100vh - 330px)`;
  }
});

//标签列表
const tableList = ref([]);

// 获取标签列表
const getTableList = async () => {
  const res: any = await gatAllProjectTag(props.currentProjectId);
  if (res.code === 200) {
    tableList.value =
      res?.data?.map((item) => {
        return {
          relation: item.relation,
          notes: item.tasTag.remark,
          tagName: item.tasTag.tagName,
          id: item.tasTag.id,
          type: item.tasTag.tagType === 1 ? "实体" : "关系",
          dicContent: item.tasTag.dictionaryContent,
        };
      }) ?? [];
  }
};

watch(
  () => props.currentProjectId,
  () => {
    getTableList();
  },
);

// 获取所有实体点
const getAllTags = async () => {
  const res: any = await gatAllProjectNodeTag(props.currentProjectId);
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
  tagTitle.value = "新建标签";
  initTags();
  tagVisible.value = true;
};

// 列表标签的删除、编辑
const currentTagId = ref(""); //编辑时的标签id
const editTag = (row) => {
  tagTitle.value = "编辑标签";
  currentTagId.value = row.id;
  tags.fileList = [];
  tags.tagName = row.tagName;
  tags.type = row.type === "实体" ? "1" : "2";
  if (tags.type === "1") {
    tags.dicContent = row.dicContent;
  } else {
    tags.start = row.relation.srcTagId;
    tags.end = row.relation.dstTagId;
  }
  tags.notes = row.notes;
  tagVisible.value = true;
};
const delTag = async (row) => {
  const res: any = await deleteTag({ id: row.id });
  if (res.code === 200) {
    getTableList();
    emits("immediateUpdate");
  } else {
    ElMessage.error(res.msg);
  }
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
            tagProjectId: props.currentProjectId,
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
            tagProjectId: props.currentProjectId,
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
    emits("immediateUpdate");
  } else {
    ElMessage.error(res.msg);
  }
  tagVisible.value = false;
  currentTagId.value = "";
};
const tagCancel = () => {
  tagVisible.value = false;
};

// 导入
const beforeUpload = async (file: any) => {
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

onMounted(async () => {
  await getTableList();
});
</script>

<style lang="scss">
@import "src/styles/theme";
.relation_left {
  width: 360px;
  height: 100%;
  border: 1px solid rgba(224, 228, 241, 1);
  margin-right: 16px;
  border-radius: 4px;

  .left_top {
    height: 51px;
    font-size: $font-size-base;
    padding: $padding-md $padding-sm 13px $padding-sm;
    display: flex;
    justify-content: space-between;

    &_title {
      height: 22px;
      line-height: 22px;
      color: $text-color-primary;
      font-weight: 700;
    }

    &_action {
      height: 22px;
      line-height: 22px;
      cursor: pointer;
      color: #086df4;
    }
  }

  .left_content {
    height: calc(100% - 51px);
    &_table {
      width: 100%;
      //height: calc(100vh - 222px);

      .el-table__header {
        .el-table__cell {
          background: #f0f3fa;
          color: $text-color-primary;
        }
      }

      .el-table__inner-wrapper::before {
        background-color: transparent;
      }

      .disabledBtn {
        //pointer-events: none;
        color: #909399;
      }
    }
  }
}

.tag_group_modal {
  box-shadow: 0px 4px 12px 0px rgba(45, 54, 77, 0.1);
  border-radius: $border-radius-md;

  .el-dialog__title {
    font-size: $font-size-lg;
    color: $text-color-primary;
    line-height: 24px;
    font-weight: 700;
  }

  .project_item {
    margin-bottom: $margin-md;

    .item_label {
      height: 22px;
      line-height: 22px;
      color: #6d7587;
      margin-bottom: $margin-xs;
    }

    .item_value {
      width: 100%;
      height: 30px;
      background: #ffffff;
      border-radius: $border-radius-sm;

      .el-input__wrapper {
        border: 1px solid rgba(214, 218, 230, 1);

        .el-input__inner {
          border-radius: 0 !important;
        }
      }
    }

    .item_upload {
      height: 22px;
      line-height: 22px;
      margin: $margin-xss 0 $margin-xss 0;
    }

    .item_upload_label {
      color: #409eff;
      cursor: pointer;
    }

    .item_file {
      height: 22px;
      color: $text-color-primary;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 9px;

      &_left,
      &_right {
        display: flex;
        align-items: center;
        .el-icon {
          margin-right: 5px;
        }
      }

      &_right {
        .el-icon {
          color: #1fcc1a;
        }
      }
    }
  }
}
</style>
