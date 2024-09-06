<template>
  <el-popover placement="top" :width="160">
    <template #default>
      <div
        v-for="(item, index) in models"
        :key="index"
        :class="$style.popover"
        @click="() => props.rebuildChat(item.code)"
      >
        <CubeIcon :class="$style.model_icon" />
        <span :class="$style.label" :title="item.description">{{ item.name }}</span>
      </div>
    </template>
    <template #reference>
      <div :class="$style.operation">
        <Refresh :class="$style.operation_icon" />
        <span :class="$style.title">重新生成</span>
      </div>
    </template>
  </el-popover>
</template>
<script setup lang="ts">
import CubeIcon from "@/client/icons/cube.svg";
import { Refresh } from "@element-plus/icons-vue";
import useModels from "@/store/hooks/useModels";

const props = defineProps<{
  rebuildChat: (code: string) => void;
}>();
const models = useModels();
</script>
<style module lang="scss">
@use "src/styles/theme";

.popover {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: theme.$padding-xss;

  &:hover {
    background: #e6f5ff;
    border-radius: 8px;
  }
}

.model_icon {
  flex: 0 0 20px;
  height: 22px;
  fill: theme.$text-color-primary;
}

.label {
  font-size: 14px;
  line-height: 22px;
  color: theme.$text-color-primary;
}

.detail {
  font-size: theme.$font-size-sm;
  color: theme.$text-color-secondary;
  line-height: 20px;
  font-weight: 400;
}

.operation {
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    cursor: pointer;
    color: theme.$color-primary;

    .operation_icon {
      fill: theme.$color-primary;
    }
  }
}

.title {
  padding: 0 theme.$padding-md 0 2px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.operation_icon {
  fill: theme.$text-color-primary;
  height: 15px;
}
</style>
