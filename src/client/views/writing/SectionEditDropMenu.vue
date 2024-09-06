<template>
  <el-dropdown
    :popper-class="$style.popper"
    placement="bottom-end"
    trigger="click"
    @visible-change="fireFold"
  >
    <LinkButton :icon="EllipsesIcon">更多</LinkButton>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item
          v-for="action in actions"
          :key="action.code"
          :disabled="isActionDisabled(action)"
          @click="() => fireEdit(action.code)"
        >
          <LinkButton :disabled="isActionDisabled(action)">{{ action.name }}</LinkButton>
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>
<script setup lang="ts">
import EllipsesIcon from "@/client/icons/ellipses.svg";
import LinkButton from "./LinkButton.vue";
import editActionMap, { EditAction, EditActionCode } from "./editActions";

const props = defineProps<{
  actions: EditActionCode[];
  currSectionIndex: number;
  sectionNums: number;
}>();

const emit = defineEmits<{
  click: [EditActionCode];
  fold: [boolean];
}>();

const actions = props.actions.map((action) => editActionMap[action]);
const fireEdit = (code: EditActionCode) => emit("click", code);
const fireFold = (visible: boolean) => emit("fold", visible);
const isActionDisabled = (action: EditAction): boolean => {
  if (!action.disabled) return false;
  return action.disabled({ currSectionIndex: props.currSectionIndex, sectionNums: props.sectionNums });
};
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
      width: 105px;
      height: 30px;
      justify-content: start;
      box-sizing: border-box;
      padding: 0 15px;
    }

    .el-popper__arrow {
      display: none;
    }
  }
}
</style>
