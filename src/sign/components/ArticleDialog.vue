<template>
  <el-dialog v-model="visible" :class="$style._">
    <div :class="$style.main">
      <slot />
    </div>
  </el-dialog>
</template>
<script lang="ts" setup>
const visible = defineModel<boolean>();
</script>
<style lang="scss" module>
._ {
  box-sizing: border-box;
  --el-dialog-margin-top: 0;
  top: 50%;
  transform: translateY(-50%);
  max-height: 96%;
  padding: 20px 10px 10px;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: flex-start;

  :global(.el-dialog__body) {
    flex: 1;
    overflow-y: auto;
  }
}

@media (min-width: 940px) {
  ._ {
    width: 900px;
    height: 780px;
  }

  .main {
    padding: 10px 68px;
  }
}

@media (max-width: 940px) {
  ._ {
    width: 92%;
    min-width: 340px;
    height: 88%;
  }

  .main {
    padding: 0 0 0 10px;
  }
}
</style>
