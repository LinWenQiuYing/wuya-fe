<template>
  <div :class="[$style._, { mobile: isMobile }]">
    <account-header v-if="isMobile" :slot-options="slotOptions">
      <template #back>
        <ArrowLeftBold :class="$style.arrowClass" />
      </template>
      <template #title>我的邀请</template>
    </account-header>
    <div :class="$style.main">
      <InviteDialog />
    </div>
  </div>
</template>
<script setup lang="ts">
import InviteDialog from "@/client/views/invite/InviteDialog.vue";
import AccountHeader from "@/client/components/AccountHeader.vue";
import { isMobile } from "@/config";
import { ArrowLeftBold } from "@element-plus/icons-vue";
import { optionType } from "@/client/components/types/component";
const slotOptions: optionType[] = [
  {
    className: "title",
    name: "title",
  },
];
</script>
<style lang="scss" module>
@use "src/styles/theme";

._ {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: flex-start;
  height: 100%;

  &:global(.mobile) {
    background: linear-gradient(180deg, #fbfbff 0%, #fdfcfc 52%, #fff 100%, #fff 100%);
  }
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  max-width: 720px;
  margin: 0 auto;
  height: 52px;
  box-sizing: border-box;
  border-bottom: 2px solid #eee;

  h2 {
    font-size: 18px;
    color: theme.$text-color-primary;
    font-weight: 700;
  }

  a {
    color: #6d7587;
    font-size: 16px;
    font-weight: 400;

    &:global(.active) {
      font-weight: 600;
      color: theme.$text-color-primary;
    }
  }

  :global {
    .el-tabs {
      --el-tabs-header-height: 48px;
      --el-border-color-light: transparent;
    }

    .el-tabs__header {
      margin: 0;
    }
  }
}

.tab {
  width: 96px;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 52px;
}

.main {
  margin-top: -1px;
  flex: 1;
  overflow-y: auto;
  background: #fff;
  border-top-left-radius: 14px;
}

@media screen and (width <= 960px) {
  .header {
    margin: 0 15px;
    width: unset;
  }

  .main {
    margin-left: 15px;
    margin-right: 15px;
  }
}

.arrowClass {
  width: 20px;
  height: 57px;
}
</style>
