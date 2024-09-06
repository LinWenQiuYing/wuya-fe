<template>
  <el-dialog v-model="dialogVisible" :class="$style._">
    <MemberTerms />
  </el-dialog>
</template>
<script lang="ts" setup>
import MemberTerms from "./MemberTerms.vue";
const dialogVisible = defineModel<boolean>({ required: true });
</script>
<style lang="scss" module>
@use "src/styles/theme";

._ {
  width: 896px;
  height: 70vh;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  --el-dialog-padding-primary: 30px 10px 10px;

  :global {
    .el-dialog__header {
      padding: 0;
    }

    .el-dialog__body {
      flex: 1;
      overflow-y: auto;
      padding: 0 68px;
    }
  }

  h1 {
    padding: 35px 0 15px;
    margin: 0 0 20px;
    position: sticky;
    top: 0;
    pointer-events: none;
    background: linear-gradient(
      to bottom,
      #fff 0%,
      #fff 50%,
      rgba(255, 255, 255, 0.9) 60%,
      rgba(255, 255, 255, 0.8) 70%,
      rgba(255, 255, 255, 0.2) 100%
    );
  }
}
</style>
