<template>
  <el-popover :show-arrow="false" :popper-class="$style.popper" placement="bottom-end">
    <template #reference>
      <BlockButton v-model:loading="loading" primary :icon="exportAction.icon">{{
        exportAction.name
      }}</BlockButton>
    </template>
    <template #default>
      <ul :class="$style.list">
        <li v-for="it in exportableTypes" :key="it.code" @click="selectExportType(it.code)">
          <Component :is="it.icon" />
          <span>{{ it.name }}</span>
        </li>
      </ul>
    </template>
  </el-popover>
</template>
<script setup lang="ts">
import { exportAction } from "./transformActions";
import BlockButton from "./BlockButton.vue";
import exportableTypes, { ExportTypeCode } from "./exportableTypes";

const emit = defineEmits<{
  click: [ExportTypeCode];
}>();

const loading = defineModel<boolean>("loading");

// 选择导出类型
const selectExportType = (type: ExportTypeCode) => emit("click", type);
</script>
<style lang="scss" module>
@use "src/styles/theme";

.list {
  display: flex;

  > li {
    list-style-type: none;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 68px;
    height: 58px;
    box-sizing: border-box;
    margin: 0;
    font-size: 12px;
    line-height: 20px;
    cursor: pointer;
    color: theme.$text-color-primary;
    user-select: none;

    &:hover {
      background: #f0f2f7;
      border-radius: 2px;
    }
  }

  svg {
    height: 20px;
  }
}

.popper {
  margin-top: -6px;

  &#{&} {
    padding: 6px 8px;
    box-shadow: 0 4px 12px 0 rgba(45, 54, 77, 0.1);
    border-radius: 4px;
    border: 1px solid #edeff3;
  }
}
</style>
