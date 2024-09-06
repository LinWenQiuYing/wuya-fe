<template>
  <el-dialog v-model="visible" :show-close="false" :class="$style._">
    <template #header>
      <h2>联系方式</h2>
      <p>我们将尽快和您联系</p>
    </template>
    <template #default>
      <slot>
        <ContactUsForm @next="reportNext" />
      </slot>
    </template>
  </el-dialog>
</template>
<script setup lang="ts">
import ContactUsForm from "./ContactUsForm.vue";

const emit = defineEmits<{
  next: [];
}>();

const visible = defineModel<boolean>();
const closeDialog = () => (visible.value = false);

const reportNext = () => {
  closeDialog();
  emit("next");
};
</script>
<style lang="scss" module>
@use "src/styles/theme";

._ {
  width: 480px;
  box-sizing: border-box;
  --el-dialog-margin-top: 0;
  top: 50%;
  transform: translateY(-50%);
  max-height: 96vh;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: flex-start;

  :global(.el-dialog__header) {
    padding-bottom: 0;
    text-align: center;
    margin-top: 20px;
    color: theme.$text-color-primary;

    > h2 {
      color: inherit;
      font-size: 24px;
      line-height: 32px;
      font-weight: 700;
      margin: 0;
    }

    > p {
      font-size: 18px;
      line-height: 32px;
      font-weight: 400;
    }
  }

  :global(.el-dialog__body) {
    flex: 1;
    overflow-y: auto;
  }
}
</style>
