<template>
  <slot :class="$style._" />
</template>
<style lang="scss" module>
._ {
  --el-text-color-regular: rgb(0 0 0 / 88%);

  :global {
    .el-checkbox {
      --el-checkbox-text-color: rgb(0 0 0 / 66%);
      --el-checkbox-checked-text-color: rgb(0 0 0 / 88%);
      align-items: flex-start;
      height: unset;
      margin-bottom: 6px;
    }

    .el-checkbox__input {
      margin-top: 3px;
    }

    .el-checkbox__label {
      line-height: 1.4;
    }
  }
}
</style>
