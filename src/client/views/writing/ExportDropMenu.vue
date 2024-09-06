<template>
  <el-dropdown :popper-class="$style.popper" placement="bottom-end">
    <slot>
      <BlockButton primary :icon="exportAction.icon">{{ exportAction.name }}</BlockButton>
    </slot>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item v-for="it in exportableTypes" :key="it.code" @click="selectExportType(it.code)">
          <Component :is="it.icon" :class="$style.icon" />
          <span>{{ it.name }}</span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>
<script setup lang="ts">
import BlockButton from "./BlockButton.vue";
import exportableTypes, { ExportTypeCode } from "./exportableTypes";
import { exportAction } from "./transformActions";

const props = defineProps<{
  readonly primary?: boolean;
}>();
const emit = defineEmits<{
  click: [ExportTypeCode];
}>();

// 选择导出类型
const selectExportType = (type: ExportTypeCode) => emit("click", type);
</script>
<style lang="scss" module>
@use "src/styles/theme";

.icon {
  height: 18px;
  margin-right: 2px;
}

.popper {
  margin-top: -8px;
  --el-dropdown-menuItem-hover-fill: #f0f2f7;
  --el-dropdown-menuItem-hover-color: currentColor;

  &:global(.el-popper) {
    border: 0 none;
    box-shadow: 0 0 8px rgba(#101015, 0.06);
  }

  :global {
    .el-dropdown-menu {
      padding: 8px 0;
    }

    .el-dropdown-menu__item {
      width: 140px;
      height: 30px;
      justify-content: start;
      box-sizing: border-box;
      padding: 0 12px;
    }

    .el-popper__arrow {
      display: none;
    }
  }
}
</style>
