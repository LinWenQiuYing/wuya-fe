<template>
  <div :class="$style.tableBox">
    <el-table
      :data="tableData"
      :header-cell-class-name="headerCellClassName"
      :cell-class-name="cellClassName"
      :class="$style.table"
      :max-height="isMobile ? 'auto' : '456px'"
      :height="isMobile && '100%'"
    >
      <el-table-column type="index" label="排行" width="120" :class="$style.indexText">
        <template v-slot="{ $index }">
          <div :class="$style.box">
            <div v-if="$index <= 2" style="margin-bottom: -15px">
              <Band :class="$style.clash" />
            </div>
            <div
              :class="[
                $style.circle,
                $index == 0 ? $style.circleGold : '',
                $index == 1 ? $style.circleSilver : '',
                $index == 2 ? $style.circleCopper : '',
              ]"
            >
              {{ $index + 1 }}
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="inviter" label="账号">
        <template #default="scope">
          <InviteUserMeta :user-name="scope.row.inviter" :avatar="scope.row.avatarBase64"></InviteUserMeta>
        </template>
      </el-table-column>
      <el-table-column prop="count" label="已邀请人数" width="120" />
    </el-table>
  </div>
</template>
<script setup lang="ts">
import Band from "@/client/icons/band.svg";
import InviteUserMeta from "./InviteUserMeta.vue";
import { isMobile } from "@/config";
import { useCssModule } from "vue";
import type { DtoInvite } from "@/client/api/invite";
const styleModule = useCssModule();
const tableData = defineModel<DtoInvite>();

interface TableScope {
  row: any;
  column: any;
  rowIndex: number;
  columnIndex: number;
}
const headerCellClassName = ({ columnIndex }: TableScope) => {
  return [styleModule.headerStyle, columnIndex == 0 && styleModule.headerStyleFirst].join(" ");
};

const cellClassName = ({ columnIndex }: TableScope) => {
  return [styleModule.cellStyle, columnIndex == 2 && styleModule.cellStyleCount].join(" ");
};
</script>
<style lang="scss" module>
@use "src/styles/theme";

._ {
  // 除了顶部, 将内边距移除, 改为form组件自己设置
  --el-dialog-padding-primary: #{theme.$dialog-breath-vertical} 0 0;
  width: 480px;
  :global {
    .el-table__inner-wrapper::before {
      width: 0;
    }
    .el-table--fit .el-table__inner-wrapper:before {
      width: 0;
    }
  }
}

.tableBox {
  margin: 12px 22px 0;
  overflow: auto;
  border-radius: theme.$border-radius-xl;
  border: 1px solid #dddfe3;
  min-height: 200px;
}

.isNotMobileTable {
  max-height: 456px;
  overflow: auto;
}

.indexText {
  text-align: center;
}

.table {
  background: #fff;
}

.headerStyle.headerStyle.headerStyle.headerStyle {
  background-color: #fff;
  border-bottom: none;
}

.headerStyleFirst {
  :global(.cell) {
    text-align: center;
  }
}

.cellStyle {
  &.cellStyle {
    padding: 0;
    height: 41px;
    border-bottom: 1px solid #dddfe3;
  }
}

.cellStyleCount {
  &.cellStyleCount {
    font-weight: bold;
    font-size: 14px;
    color: theme.$text-color-primary;
    line-height: 42px;
    font-style: normal;
    text-align: right;
    padding-right: 30px;
  }
}

.font {
  font-size: theme.$font-size-base;
  color: theme.$text-color-primary;
  line-height: 22px;
  text-align: left;
  font-style: normal;
}

.box {
  width: 100%;
  height: 41px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-flow: column;
}

.circle {
  position: relative;
  height: 20px;
  border-radius: 10px;
  padding: 0 6px;
  text-align: center;
  background: #dddfe3;
  font-weight: bold;
  font-size: theme.$font-size-base;
  color: #6d7587;
  line-height: 20px;
  font-style: normal;
}

.circleGold {
  background: linear-gradient(156deg, #fde55f 0%, #fac731 100%);
  color: white;
}

.circleSilver {
  background: linear-gradient(155deg, #e6e7e7 0%, #b0acac 100%);
  color: white;
}

.circleCopper {
  background: linear-gradient(155deg, #faa492 0%, #c96f5c 100%);
  color: white;
}

.clash {
  width: 22px;
  height: 14px;
  margin-bottom: 3px;
}

.title {
  font-weight: 700;
  font-size: theme.$font-size-lg;
  line-height: 24px;
  color: theme.$text-color-primary;
  padding-left: theme.$dialog-breath-horizontal;
}
</style>
