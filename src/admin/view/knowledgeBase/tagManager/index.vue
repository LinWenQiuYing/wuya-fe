<!-- 图谱构建-标签管理 -->
<template>
  <div class="tag">
    <div class="tag_header">
      <el-icon style="cursor: pointer; width: 20px; height: 20px" @click="reback"><ArrowLeft /></el-icon>
      <div class="tag_header_back">返回</div>
    </div>
    <div class="tag_manage">
      <div class="tag_manage_container">
        <TagLeft
          :choosed-tag-group-id="choosedTagGroupId"
          @change-choosed-tag-group-id="changeChoosedTagGroupId"
        ></TagLeft>
        <TagRight :choosed-tag-group-id="choosedTagGroupId"></TagRight>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";

import { ArrowLeft } from "@element-plus/icons-vue";
import TagLeft from "./components/TagLeft.vue";
import TagRight from "./components/TagRight.vue";

// 返回项目页面
// 标签
const router = useRouter();
const reback = () => {
  router.push("/admin/graph_construction/project");
};

// 当前选中标签组id
const choosedTagGroupId = ref("");
const changeChoosedTagGroupId = (value: string) => {
  choosedTagGroupId.value = value;
};

onMounted(() => {});
</script>

<style lang="scss">
@import "src/styles/theme";
.tag {
  width: 100%;
  height: 100%;
  background: $background-color-light;
  // background-image: linear-gradient(-87deg, #dde5ed 0%, #f0f3fa 99%);
  // padding: 22px $padding-md 18px $padding-md;

  &_header {
    display: none !important;
    height: 20px;
    font-size: $font-size-base;
    color: $text-color-primary;
    display: flex;
    align-items: center;
    margin-bottom: 7px;
  }

  &_manage {
    width: 100%;
    height: 100%;
    //height: calc(100% - 27px);
    //background-image: linear-gradient(134deg, #e4f8ff 0%, #e7eeff 100%);

    &_container {
      display: flex;
      width: 100%;
      height: 100%;
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

      .el-input__wrapper {
        border: 1px solid rgba(214, 218, 230, 1);
      }

      background: #ffffff;
      border-radius: $border-radius-sm;
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
