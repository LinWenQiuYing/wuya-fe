<template>
  <el-dialog v-model="dialogVisible" :class="$style._">
    <template #header>
      <h3 :class="$style.title">兑换会员</h3>
    </template>
    <CouponActivationForm @close="closeDialog" />
  </el-dialog>
</template>
<script setup lang="ts">
import CouponActivationForm from "./CouponActivationForm.vue";

const dialogVisible = defineModel<boolean>("visible", { required: true });

const closeDialog = () => (dialogVisible.value = false);
</script>
<style lang="scss" module>
@use "src/styles/theme";

._ {
  // 除了顶部, 将内边距移除, 改为form组件自己设置
  --el-dialog-padding-primary: 0;
  width: 480px;
  max-width: 94%;
}

.title {
  font-weight: bold;
  font-size: 18px;
  line-height: 24px;
  color: theme.$text-color-primary;
  padding: 30px 24px 0;
  margin-bottom: 16px;
}
</style>
