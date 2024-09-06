<template>
  <el-dialog v-if="visible" v-model="visible" width="480px" :class="$style._">
    <template #header>
      <h3 :class="$style.title">修改密码</h3>
    </template>
    <PasswordEditForm @finish="closeDialog" />
  </el-dialog>
</template>
<script setup lang="ts">
import PasswordEditForm from "./PasswordEditForm.vue";

const visible = defineModel<boolean>();
const closeDialog = () => (visible.value = false);
</script>
<style lang="scss" module>
@use "src/styles/theme";

._ {
  // 除了顶部, 将内边距移除, 改为form组件自己设置
  --el-dialog-padding-primary: #{theme.$dialog-breath-vertical} 0 0;
}

.title {
  font-weight: 700;
  font-size: 16px;
  line-height: 24px;
  color: theme.$text-color-primary;
  padding-left: theme.$dialog-breath-horizontal;
}
</style>
