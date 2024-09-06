<template>
  <el-dialog v-model="visible" :class="$style._" v-if="!isMobile">
    <template #header>
      <h3 :class="$style.title">我的邀请</h3>
    </template>
    <InviteForm></InviteForm>
  </el-dialog>
  <div :class="$style.mobileStyle" v-else>
    <InviteForm></InviteForm>
  </div>
</template>
<script setup lang="ts">
import InviteForm from "@/client/views/invite/InviteForm.vue";

import { isMobile } from "@/config";

const visible = defineModel<boolean>();
</script>
<style lang="scss" module>
@use "src/styles/theme";

._ {
  // 除了顶部, 将内边距移除, 改为form组件自己设置
  --el-dialog-padding-primary: #{theme.$dialog-breath-vertical} 0 0;
  width: 500px;
}

.mobileStyle {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: flex-start;
  height: 100%;
}

.title {
  color: theme.$text-color-primary;
  padding-left: theme.$dialog-breath-horizontal;
  font-weight: bold;
  font-size: theme.$font-size-xxl;
  line-height: 32px;
  text-align: left;
  font-style: normal;
}
</style>
