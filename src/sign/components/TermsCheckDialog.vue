<template>
  <el-dialog v-model="visible" :class="$style._">
    <template #header>
      <div :class="$style.title">提示</div>
    </template>
    <p>
      <span>点击确定表示你已阅读并同意</span>
      <slot />
    </p>
    <template #footer>
      <el-button @click="closeDialog">取消</el-button>
      <el-button type="primary" @click="agreeTerms">确定</el-button>
    </template>
  </el-dialog>
</template>
<script setup lang="ts">
const checked = defineModel<boolean>("checked");
const visible = defineModel<boolean>("visible");

const closeDialog = () => (visible.value = false);

const agreeTerms = () => {
  checked.value = true;
  closeDialog();
};
</script>
<style lang="scss" module>
@use "src/styles/theme";

._ {
  width: 480px;
  max-width: 92%;
}

.title {
  font-weight: bold;
  font-size: 18px;
  line-height: 24px;
  color: theme.$text-color-primary;
  padding-top: 20px;
}
</style>
