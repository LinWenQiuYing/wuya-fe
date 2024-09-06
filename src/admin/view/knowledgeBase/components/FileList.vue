<template>
  <ul>
    <li v-for="(item, i) in fileList" :key="i" class="progress-box">
      <div class="progress-left">
        <span class="file-name">{{ item.name }}</span>
        <el-icon v-if="item.status === 'ready'" class="is-loading status-loading-icon loading-color-icon">
          <RefreshRight />
        </el-icon>
        <div v-if="item.status !== 'ready'" class="status-icon-box">
          <Check v-if="item.status === 'success'" class="status-icon success-color-icon" />
          <Close v-if="item.status === 'fail'" class="status-icon fail-color-icon" />
        </div>

        <div class="progress">
          <div :class="getColor(item.status)" class="status-color"></div>
        </div>
      </div>
      <div v-if="item.status !== 'ready'" class="delete-box" @click="deleteFile(i)">
        <Delete class="delete-icon" />
      </div>
    </li>
  </ul>
</template>

<script lang="ts" setup>
import { Delete, RefreshRight, Check, Close } from "@element-plus/icons-vue";
import { UploadFile } from "element-plus";
import { UploadStatus } from "element-plus/es/components/upload/src/upload";
import { deleteCondition } from "@/api/knowledgeRequst";

const props = defineProps<{
  fileList: Array<UploadFile>;
}>();
const getColor = (status: UploadStatus) => {
  switch (status) {
    case "fail":
      return "fail-color";
    case "success":
      return "success-color";
    default:
      return "loading-color";
  }
};

const deleteFile = (idx: number) => {
  if (props.fileList[idx].fileUuid) {
    const params = {
      docId: props.fileList[idx].fileUuid,
    };

    deleteCondition(params).then(() => {
      props.fileList.splice(idx, 1);
    });
  }
};
</script>

<style lang="scss" scoped>
@import "src/styles/theme";

.progress-box {
  max-width: 432px;
  display: flex;
}

.progress-left {
  flex: 1;
  display: flex;
  height: 30px;
  position: relative;
  margin: 0 $margin-xs $margin-xs 0;
  padding: 0 $padding-sm;
  background: #f0f3fa;

  .progress {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 2px;
    background: #d6dae6;

    .status-color {
      height: 100%;
    }
  }
}

.file-name {
  flex: 1;
  width: 40px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.delete-box {
  height: 30px;
  cursor: pointer;

  &:hover {
    color: $red-color;
  }

  .delete-icon {
    width: 20px;
    height: 20px;
    line-height: 30px;
    vertical-align: sub;
  }
}

.status-loading-icon {
  width: 30px;
  height: 30px;
  line-height: 30px;
  vertical-align: middle;
}

.status-icon-box {
  height: 30px;
  width: 15px;
}

.status-icon {
  width: 15px;
  height: 15px;
  line-height: 30px;
}

.success-color {
  background: $green_color;
}

.fail-color {
  background: $red_color;
}

.loading-color {
  background: #086df4;
}

.success-color-icon {
  color: $green_color;
}

.fail-color-icon {
  color: $red_color;
}

.loading-color-icon {
  color: #086df4;
}
</style>
