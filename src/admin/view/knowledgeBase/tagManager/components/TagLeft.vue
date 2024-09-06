<template>
  <div class="container_left">
    <div class="left_top">
      <div class="left_top_title">标签组</div>
      <el-icon class="left_top_icon"
        ><CirclePlus style="cursor: pointer; width: 15px; height: 15px" @click="addTagGroup" />
      </el-icon>
    </div>
    <el-input
      v-model="serachTagGroup"
      style="width: 275px; height: 30px"
      placeholder="请输入关键词"
      :suffix-icon="Search"
      class="left_middle"
      @keyup.enter="getTagGroup"
    />
    <el-scrollbar class="left_scrollbar">
      <div class="left_bottom">
        <div
          v-for="(item, index) in tagGroups"
          :key="index"
          :class="['left_bottom_item', props.choosedTagGroupId === item.id ? 'left_bottom_item_active' : '']"
          @click="changeGroup(item)"
        >
          <div class="item_left">{{ item.name }}</div>
          <div class="item_right">
            <el-icon><Edit @click.stop="editTagGroup(item)" /></el-icon>
            <el-popconfirm title="是否确认删除该标签组？" @confirm.stop="delTagGroup(item.id)">
              <template #reference>
                <el-icon><Delete /></el-icon>
              </template>
            </el-popconfirm>
          </div>
        </div>
      </div>
    </el-scrollbar>
  </div>
  <el-dialog v-model="tagGroupVisible" :title="tagGroupTitle" width="480px" class="tag_group_modal">
    <div class="project_item">
      <div class="item_label">标签组名称<i style="color: red; margin-right: 5px">*</i></div>
      <el-input v-model="tagGroupName" class="item_value" placeholder="请输入" maxlength="50" />
    </div>
    <template #footer>
      <div class="dialog_footer">
        <el-button @click="tagGroupCancel">取消</el-button>
        <el-button type="primary" @click="tagGroupConfirm"> 确定 </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import {
  createTagGroup,
  deleteTagGroup,
  getAllTagGroup,
  updateTagGroup,
} from "@/admin/api/graphConstruction";
import { CirclePlus, Delete, Edit, Search } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import { computed, onMounted, ref } from "vue";
const emits = defineEmits(["changeChoosedTagGroupId"]);
const props = defineProps<{
  choosedTagGroupId: string;
}>();

const calculatedHeight = computed(() => {
  return `calc(100% - 73px)`;
});

// 标签组
const tagGroups = ref([]);
const serachTagGroup = ref("");

const changeGroup = (item) => {
  emits("changeChoosedTagGroupId", item.id);
};

// 获取标签组
const firstTagGroupId = ref("");
const getTagGroup = async () => {
  const json = {
    id: null,
    groupName: serachTagGroup.value ? serachTagGroup.value : null,
  };
  const res: any = await getAllTagGroup(json);
  if (res.code === 200) {
    tagGroups.value =
      res?.data.map((item) => {
        return {
          ...item,
          value: item.id,
          name: item.groupName,
        };
      }) ?? [];
    if (tagGroups.value.length) {
      firstTagGroupId.value = tagGroups.value[0].value;
    }
  }
};

// 新建标签组
const tagGroupVisible = ref(false);
const tagGroupTitle = ref("");
const tagGroupName = ref("");
const currentTagGroupId = ref("");
const addTagGroup = () => {
  tagGroupTitle.value = "新建标签组";
  tagGroupName.value = "";
  tagGroupVisible.value = true;
};
const editTagGroup = async (item) => {
  tagGroupName.value = item.name;
  currentTagGroupId.value = item.id;
  tagGroupTitle.value = "编辑标签组";
  tagGroupVisible.value = true;
};
const tagGroupConfirm = async () => {
  if (!tagGroupName.value.trim()) {
    return ElMessage.warning("标签组名称不能为空");
  }
  const json = {
    id: tagGroupTitle.value === "新建标签组" ? undefined : currentTagGroupId.value,
    groupName: tagGroupName.value,
  };
  const res: any =
    tagGroupTitle.value === "新建标签组" ? await createTagGroup(json) : await updateTagGroup(json);
  if (res.code === 200) {
    serachTagGroup.value = "";
    getTagGroup();
    if (tagGroupTitle.value === "新建标签组") {
      emits("changeChoosedTagGroupId", res?.data); // 新建标签组后默认选中该新建的标签组，点击新建按钮即在该标签组中新建标签
    }
  } else {
    ElMessage.error(res.msg);
  }
  tagGroupVisible.value = false;
};
const tagGroupCancel = () => {
  tagGroupVisible.value = false;
};
// 删除
const delTagGroup = async (id: string) => {
  const res: any = await deleteTagGroup({ id });
  if (res.code === 200) {
    serachTagGroup.value = "";
    getTagGroup();
  } else {
    ElMessage.error(res.msg);
  }
};

onMounted(async () => {
  await getTagGroup();
  emits("changeChoosedTagGroupId", firstTagGroupId.value);
});
</script>

<style lang="scss">
@import "src/styles/theme";
.container_left {
  width: 320px;
  height: 100%;
  padding: $padding-xl 21px;
  border-top: 1px solid #e0e4f1;
  border-right: 1px solid #e0e4f1;

  .left_top {
    height: 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: $margin-xs;

    &_title {
      font-size: $font-size-lg;
      color: $text-color-primary;
      font-weight: 700;
    }
  }

  .left_middle {
    margin-bottom: 11px;
  }

  .left_scrollbar {
    height: calc(100% - 73px);

    .left_bottom {
      // max-height: calc(100% - 73px);
      // overflow: scroll;

      &_item {
        height: 22px;
        line-height: 22px;
        margin-bottom: $margin-xs;
        font-size: $font-size-base;
        color: $text-color-primary;
        display: flex;
        align-items: center;
        justify-content: space-between;
        cursor: pointer;

        .item_left {
          width: calc(100% - 44px);
          height: 22px;
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;
        }

        .item_right {
          display: none;
        }

        &:hover {
          .item_right {
            display: flex;

            .el-icon {
              margin-right: $margin-xs;
              cursor: pointer;
            }
          }
        }
      }

      &_item_active {
        background: #ffffff;
      }
    }
  }
}
</style>
